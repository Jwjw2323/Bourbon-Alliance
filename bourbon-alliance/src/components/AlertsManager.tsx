import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, 
  Moon, 
  Sliders, 
  Clock, 
  RotateCcw,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertTriangle,
  History,
  ShieldCheck,
  Save,
  Radio,
  ExternalLink
} from 'lucide-react';
import { DropTip, Store, BottleInfo, AlertPrefs, Priority, Channel, UserSession, NotificationLog } from '../types';
import { AlertEngine, PREVIEW_HOUR, DEFAULT_ALERT_PREFS } from '../services/alertEngine';

interface AlertsManagerProps {
  tips: DropTip[];
  stores: Store[];
  bottles: BottleInfo[];
  userSession: UserSession;
  onUpdateSession: (session: UserSession) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

const channelStyles: Record<Channel, { label: string; badge: string; icon: string }> = {
  sms: { label: 'Instant SMS', badge: 'bg-emerald-950 text-emerald-300 border-emerald-700', icon: '📱' },
  email: { label: 'Email Note', badge: 'bg-sky-950 text-sky-300 border-sky-700', icon: '✉️' },
  digest: { label: 'Morning Digest', badge: 'bg-amber-950 text-amber-300 border-amber-700', icon: '☕' },
  board: { label: 'Board Only', badge: 'bg-stone-800 text-stone-300 border-stone-700', icon: '📋' },
  drop: { label: 'Held / Filtered', badge: 'bg-stone-900 text-stone-500 border-stone-800', icon: '🚫' }
};

export const AlertsManager: React.FC<AlertsManagerProps> = ({
  tips,
  stores,
  bottles,
  userSession,
  onUpdateSession,
  onOpenPrivacy,
  onOpenTerms
}) => {
  const [selectedBottleToAdd, setSelectedBottleToAdd] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'watchlist' | 'channels' | 'logs'>('channels');

  // Phone and Email local form inputs
  const [phoneInput, setPhoneInput] = useState(userSession.phoneNumber || userSession.alertPrefs?.phoneNumber || '');
  const [emailInput, setEmailInput] = useState(userSession.notificationEmail || (userSession.isSignedIn ? userSession.email : '') || userSession.alertPrefs?.notificationEmail || '');
  const [webhookInput, setWebhookInput] = useState(userSession.alertPrefs?.webhookUrl || '');
  
  // Test notification status banner
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Notification logs state
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem('bourbon_notification_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('bourbon_notification_logs', JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  // Keep phone/email inputs synced if userSession updates externally
  useEffect(() => {
    if (userSession.phoneNumber && !phoneInput) {
      setPhoneInput(userSession.phoneNumber);
    }
    if ((userSession.notificationEmail || (userSession.isSignedIn && userSession.email)) && !emailInput) {
      setEmailInput(userSession.notificationEmail || userSession.email || '');
    }
  }, [userSession]);

  // Watch priorities from userSession
  const watch = userSession.watchPriorities || {
    'blantons-single-barrel': 'unicorn',
    'weller-antique-107': 'unicorn',
    'stagg-batch-barrel-proof': 'unicorn',
    'eh-taylor-small-batch': 'want',
    'eagle-rare-10': 'want',
    'john-j-bowman-single-barrel': 'want'
  };

  const prefs: AlertPrefs = {
    ...DEFAULT_ALERT_PREFS,
    ...(userSession.alertPrefs || {}),
    phoneNumber: userSession.phoneNumber || userSession.alertPrefs?.phoneNumber || '',
    notificationEmail: userSession.notificationEmail || userSession.email || userSession.alertPrefs?.notificationEmail || ''
  };

  // Plan alerts with the Alert Engine
  const plannedAlerts = useMemo(() => {
    return AlertEngine.planAlerts({
      tips,
      stores,
      bottles,
      prefs,
      watch,
      hour: PREVIEW_HOUR
    });
  }, [tips, stores, bottles, prefs, watch]);

  const watchedAlerts = plannedAlerts.filter(p => watch[p.bottle.id]);
  const heldCount = plannedAlerts.filter(p => p.decision.channel === 'drop').length;
  const smsCount = plannedAlerts.filter(p => p.decision.channel === 'sms').length;

  const handleSetPriority = (bottleId: string, priority: Priority | 'none') => {
    const updated = { ...watch };
    if (priority === 'none') {
      delete updated[bottleId];
    } else {
      updated[bottleId] = priority;
    }
    onUpdateSession({
      ...userSession,
      watchPriorities: updated
    });
  };

  const handleUpdatePrefs = (newPrefs: AlertPrefs) => {
    onUpdateSession({
      ...userSession,
      alertPrefs: newPrefs,
      phoneNumber: newPrefs.phoneNumber,
      notificationEmail: newPrefs.notificationEmail
    });
  };

  // Save phone number & email address
  const handleSaveContactDetails = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phoneInput.trim();
    const cleanEmail = emailInput.trim();

    const updatedPrefs: AlertPrefs = {
      ...prefs,
      phoneNumber: cleanPhone,
      notificationEmail: cleanEmail,
      webhookUrl: webhookInput.trim()
    };

    onUpdateSession({
      ...userSession,
      phoneNumber: cleanPhone || undefined,
      notificationEmail: cleanEmail || undefined,
      alertPrefs: updatedPrefs
    });

    setStatusMessage({
      type: 'success',
      text: `Notification channels successfully updated! Alerts will be dispatched to ${cleanPhone || 'phone (none)'} and ${cleanEmail || 'email (none)'}.`
    });

    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Send Test SMS
  const handleSendTestSms = () => {
    const targetPhone = phoneInput.trim() || userSession.phoneNumber;
    if (!targetPhone) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid mobile phone number above before testing SMS notifications.'
      });
      return;
    }

    const testBottle = bottles.find(b => b.id === 'blantons-single-barrel') || bottles[0];
    const testStore = stores[0] || { name: "Schneider's of Capitol Hill", jurisdiction: 'DC' };
    const alertMessage = `🚨 [Bourbon Alliance] UNICORN DROP ALERT: ${testBottle?.name || "Blanton's Original"} spotted at ${testStore.name} ($65, Limit 1). https://bourbonalliance.net Reply STOP to cancel, HELP for help. Msg&data rates may apply.`;

    const newLog: NotificationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'sms',
      recipient: targetPhone,
      title: `SMS Drop Alert: ${testBottle?.name}`,
      message: alertMessage,
      status: 'delivered'
    };

    setNotificationLogs(prev => [newLog, ...prev]);

    // If webhook is provided, trigger a real HTTP POST request
    const webhook = webhookInput.trim() || (import.meta as any).env?.VITE_ALERT_WEBHOOK_URL;
    if (webhook && webhook.startsWith('http')) {
      fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: alertMessage,
          text: alertMessage,
          event: 'DROP_ALERT',
          bottle: testBottle?.name,
          store: testStore.name,
          phone: targetPhone
        })
      }).then(() => {
        setStatusMessage({
          type: 'success',
          text: `Real alert webhook successfully dispatched to ${webhook} for ${targetPhone}!`
        });
      }).catch(err => {
        setStatusMessage({
          type: 'error',
          text: `Webhook delivery failed: ${err.message}`
        });
      });
      return;
    }

    setStatusMessage({
      type: 'info',
      text: `Test SMS simulation logged for ${targetPhone}. (To transmit live cellular texts to phone carriers, add VITE_TWILIO_ACCOUNT_SID and VITE_TWILIO_AUTH_TOKEN in .env or configure a webhook below).`
    });

    // Also trigger system notification if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Bourbon Alliance Drop Alert (SMS)', {
        body: `${testBottle?.name} spotted at ${testStore.name} ($65)`,
        icon: '/favicon.ico'
      });
    }
  };

  // Send Test Email
  const handleSendTestEmail = () => {
    const targetEmail = emailInput.trim() || userSession.email || userSession.notificationEmail;
    if (!targetEmail) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid notification email above before testing email digests.'
      });
      return;
    }

    const emailSubject = `[Bourbon Alliance] Daily Drop Briefing · DC, MD & VA`;
    const emailBody = `Good morning scout. 2 priority bottles were reported today across DC & Maryland retailers. 1) Blanton's at Schneider's ($65) · 2) E.H. Taylor Small Batch at Montgomery ABS Westbard ($49.99). Log in to view live inventory levels.`;

    const newLog: NotificationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'email',
      recipient: targetEmail,
      title: emailSubject,
      message: emailBody,
      status: 'delivered'
    };

    setNotificationLogs(prev => [newLog, ...prev]);

    setStatusMessage({
      type: 'success',
      text: `Test Morning Email Digest generated for ${targetEmail}: "${emailSubject}"`
    });
  };

  const handleResetDefaults = () => {
    onUpdateSession({
      ...userSession,
      alertPrefs: DEFAULT_ALERT_PREFS,
      watchPriorities: {
        'blantons-single-barrel': 'unicorn',
        'weller-antique-107': 'unicorn',
        'stagg-batch-barrel-proof': 'unicorn'
      }
    });
    setStatusMessage({
      type: 'info',
      text: 'Notification preferences reset to factory defaults.'
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
              <Bell className="w-4 h-4" />
              <span>Personal Hunting Radar</span>
            </div>
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
              SMS & Email Alert Engine
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mt-1">
              Configure your phone number and notification email for real-time drop pings across DC, MD, and VA. Control quiet hours, same-store cooldowns, and unicorn priorities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Status Toast Message */}
        {statusMessage && (
          <div className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-red-950/80 border-red-800 text-red-200'
              : 'bg-stone-800 border-stone-700 text-stone-200'
          }`}>
            {statusMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {statusMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 mt-4 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('channels')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeSubTab === 'channels'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>SMS & Email Channels</span>
          </button>
          <button
            onClick={() => setActiveSubTab('watchlist')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
              activeSubTab === 'watchlist'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            My Bottle Watchlist ({Object.keys(watch).length})
          </button>
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
              activeSubTab === 'feed'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            Active Matched Drops ({watchedAlerts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSubTab === 'logs'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Delivery Logs ({notificationLogs.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SMS & Email Notification Configuration */}
      {activeSubTab === 'channels' && (
        <div className="space-y-6">
          
          <form onSubmit={handleSaveContactDetails} className="bg-stone-900 border border-stone-800 rounded-xl p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div>
                <h2 className="font-serif-brand font-bold text-lg text-stone-100">
                  Notification Delivery Endpoints
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Enter your direct mobile phone and notification email to receive instantaneous drop alerts.
                </p>
              </div>

              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 self-start sm:self-auto transition-all shadow-md active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Channels</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Phone & SMS Card */}
              <div className="space-y-4 bg-stone-950 p-4 sm:p-5 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Mobile SMS Drop Alerts</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono-code font-semibold ${
                    prefs.sms 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-stone-900 text-stone-500 border border-stone-800'
                  }`}>
                    {prefs.sms ? '● Opted In' : '○ Not Opted In'}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1 font-medium">
                    Your Mobile Phone Number (for SMS)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+1 (202) 555-0199"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-100 font-mono-code focus:outline-none focus:border-amber-500 placeholder-stone-600"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Used exclusively for urgent Unicorn status bottle sightings (e.g. Stagg, Weller, Blanton's).
                  </p>
                </div>

                {/* VISIBLE OPT-IN CHECKBOX (Carrier / Twilio A2P 10DLC Vetting Compliant) */}
                <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-xl space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="sms-optin-visible-checkbox"
                      checked={prefs.sms}
                      onChange={(e) => handleUpdatePrefs({ ...prefs, sms: e.target.checked })}
                      className="mt-0.5 rounded border-stone-600 text-amber-600 focus:ring-amber-500 h-4 w-4 bg-stone-950 flex-shrink-0 cursor-pointer accent-amber-600"
                    />
                    <span className="text-xs text-stone-100 font-semibold leading-snug">
                      I agree to receive automated SMS text alerts from Bourbon Alliance at the mobile number provided above.
                    </span>
                  </label>

                  <div className="text-[10px] text-stone-400 pl-6 leading-relaxed space-y-1">
                    <p>
                      Message frequency varies based on regional sightings (capped at {prefs.smsDailyCap} msgs/day). Standard message & data rates may apply.
                    </p>
                    <p>
                      Reply <strong className="text-amber-400 font-mono-code font-bold">STOP</strong> to opt out at any time. Reply <strong className="text-amber-400 font-mono-code font-bold">HELP</strong> for support or email <a href="mailto:celeron.sec@proton.me" className="text-amber-400 underline font-mono-code">celeron.sec@proton.me</a>.
                    </p>
                    <div className="pt-1 flex items-center gap-3 text-[10px]">
                      <button
                        type="button"
                        onClick={onOpenPrivacy}
                        className="text-stone-300 underline hover:text-amber-400"
                      >
                        Privacy Policy
                      </button>
                      <span className="text-stone-600">·</span>
                      <button
                        type="button"
                        onClick={onOpenTerms}
                        className="text-stone-300 underline hover:text-amber-400"
                      >
                        Terms & Conditions
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSendTestSms}
                    className="w-full bg-stone-900 hover:bg-stone-800 border border-emerald-800/80 hover:border-emerald-600 text-emerald-300 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test SMS Drop Alert</span>
                  </button>
                </div>
              </div>

              {/* Email Card */}
              <div className="space-y-4 bg-stone-950 p-4 sm:p-5 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span>Email Morning Digest</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.email}
                      onChange={(e) => handleUpdatePrefs({ ...prefs, email: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1 font-medium">
                    Notification Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="hunter@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-100 font-mono-code focus:outline-none focus:border-amber-500 placeholder-stone-600"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Sent every morning at 8:00 AM with a summary of overnight restocks and distillery deliveries.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    className="w-full bg-stone-900 hover:bg-stone-800 border border-sky-800/80 hover:border-sky-600 text-sky-300 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Email Note</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Quiet Hours & Anti-Spam Throttling */}
            <div className="pt-4 border-t border-stone-800">
              <div className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-2 mb-4">
                <Moon className="w-4 h-4 text-amber-500" />
                <span>Anti-Spam & Quiet Hours Controls</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <label className="text-[11px] text-stone-300 font-medium block">Quiet Hours Window</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">Silence Starts</span>
                      <select
                        value={prefs.quietStart}
                        onChange={(e) => handleUpdatePrefs({ ...prefs, quietStart: Number(e.target.value) })}
                        className="w-full bg-stone-900 border border-stone-700 p-1.5 rounded text-stone-200 text-xs"
                      >
                        <option value={20}>8:00 PM</option>
                        <option value={21}>9:00 PM</option>
                        <option value={22}>10:00 PM</option>
                        <option value={23}>11:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">Resumes At</span>
                      <select
                        value={prefs.quietEnd}
                        onChange={(e) => handleUpdatePrefs({ ...prefs, quietEnd: Number(e.target.value) })}
                        className="w-full bg-stone-900 border border-stone-700 p-1.5 rounded text-stone-200 text-xs"
                      >
                        <option value={6}>6:00 AM</option>
                        <option value={7}>7:00 AM</option>
                        <option value={8}>8:00 AM</option>
                        <option value={9}>9:00 AM</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500">No audio or SMS alerts will ping during this window.</p>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-stone-300 font-medium">Daily SMS Cap</label>
                    <span className="font-mono-code text-amber-400 font-bold">{prefs.smsDailyCap} msgs / day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={prefs.smsDailyCap}
                    onChange={(e) => handleUpdatePrefs({ ...prefs, smsDailyCap: Number(e.target.value) })}
                    className="w-full accent-amber-500 mt-2"
                  />
                  <p className="text-[10px] text-stone-500">Limits maximum high-priority text alerts per calendar day.</p>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-stone-300 font-medium">Store Cooldown</label>
                    <span className="font-mono-code text-amber-400 font-bold">{prefs.cooldownHours} hours</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={prefs.cooldownHours}
                    onChange={(e) => handleUpdatePrefs({ ...prefs, cooldownHours: Number(e.target.value) })}
                    className="w-full accent-amber-500 mt-2"
                  />
                  <p className="text-[10px] text-stone-500">Suppresses duplicate alerts from the same store within {prefs.cooldownHours} hours.</p>
                </div>

              </div>
            </div>

            {/* Optional Custom Webhook */}
            <div className="pt-2 border-t border-stone-800/80">
              <details className="text-[11px] text-stone-400">
                <summary className="cursor-pointer hover:text-stone-200 font-medium py-1">
                  + Advanced: Custom Webhook or Discord/Slack/Pushover Gateway
                </summary>
                <div className="mt-2 space-y-2 pl-2">
                  <p className="text-[10px] text-stone-500">
                    If you use an external webhook service or Discord hunter channel, enter the POST URL below:
                  </p>
                  <input
                    type="url"
                    placeholder="https://hooks.slack.com/services/... or https://discord.com/api/webhooks/..."
                    value={webhookInput}
                    onChange={(e) => setWebhookInput(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 px-3 py-1.5 rounded text-xs text-stone-200 font-mono-code focus:outline-none focus:border-amber-500"
                  />
                </div>
              </details>
            </div>

          </form>

        </div>
      )}

      {/* SUB-TAB 2: Target Bottle Watchlist Priority Matrix */}
      {activeSubTab === 'watchlist' && (
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-brand font-bold text-lg text-stone-100">
                  Target Bottle Priority Matrix
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Set how Bourbon Alliance alerts your phone and email when each bottle is spotted.
                </p>
              </div>

              {/* Add Bottle to Watchlist */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedBottleToAdd}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSetPriority(e.target.value, 'want');
                      setSelectedBottleToAdd('');
                    }
                  }}
                  className="bg-stone-950 border border-stone-700 text-xs text-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                >
                  <option value="">+ Add Bottle to Watchlist...</option>
                  {bottles.filter(b => !watch[b.id]).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} (${b.msrp})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {bottles.map(bottle => {
                const currentPriority = watch[bottle.id];

                return (
                  <div
                    key={bottle.id}
                    className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-serif-brand font-bold text-stone-100">
                        {bottle.name}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        MSRP: <span className="font-mono-code text-stone-300">${bottle.msrp}</span> · 
                        Fair Ceiling: <span className="font-mono-code text-amber-400">${bottle.fairCeiling}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
                      <button
                        onClick={() => handleSetPriority(bottle.id, 'unicorn')}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                          currentPriority === 'unicorn'
                            ? 'bg-purple-600 text-white'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                        title="Instant SMS alert"
                      >
                        Unicorn
                      </button>
                      <button
                        onClick={() => handleSetPriority(bottle.id, 'want')}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                          currentPriority === 'want'
                            ? 'bg-amber-600 text-stone-950'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                        title="Morning digest note"
                      >
                        Want
                      </button>
                      <button
                        onClick={() => handleSetPriority(bottle.id, 'curious')}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                          currentPriority === 'curious'
                            ? 'bg-stone-700 text-white'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                        title="Board view only"
                      >
                        Curious
                      </button>
                      {currentPriority && (
                        <button
                          onClick={() => handleSetPriority(bottle.id, 'none')}
                          className="px-1.5 py-1 text-stone-500 hover:text-red-400 text-[10px]"
                          title="Remove from watchlist"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Live Matched Alerts */}
      {activeSubTab === 'feed' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
              <div className="text-stone-400 text-[11px]">Instant SMS Dispatched</div>
              <div className="text-xl font-bold font-mono-code text-emerald-400">{smsCount}</div>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
              <div className="text-stone-400 text-[11px]">Watched Sighting Matches</div>
              <div className="text-xl font-bold font-mono-code text-amber-400">{watchedAlerts.length}</div>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
              <div className="text-stone-400 text-[11px]">Filtered (Quiet/Cooldown)</div>
              <div className="text-xl font-bold font-mono-code text-stone-400">{heldCount}</div>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
              <div className="text-stone-400 text-[11px]">Quiet Hours Window</div>
              <div className="text-xs font-semibold text-stone-200 mt-1">
                {prefs.quietStart}:00 – {prefs.quietEnd}:00
              </div>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-200">Watchlist Trigger Stream</span>
              <span className="text-[11px] text-stone-400">Sightings matching your hunting priorities</span>
            </div>

            {plannedAlerts.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-stone-600 mx-auto" />
                <h4 className="font-serif-brand font-bold text-stone-300">Radar Active · No Matching Drops Yet</h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  0 sightings of your watched bottles have been reported in the last 90 minutes. When a bottle drops, your phone will receive an immediate SMS alert.
                </p>
                <button
                  onClick={handleSendTestSms}
                  className="mt-3 bg-stone-950 border border-stone-800 hover:border-amber-500/80 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test SMS Drop Notification</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-800/80">
                {plannedAlerts.map(({ tip, bottle, store, decision }) => {
                  const style = channelStyles[decision.channel];
                  const priority = watch[bottle.id];

                  return (
                    <div key={tip.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-800/30 transition-colors text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif-brand font-bold text-stone-100 text-sm">
                            {bottle.name}
                          </span>
                          {priority && (
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              priority === 'unicorn' 
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : priority === 'want'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-stone-800 text-stone-400'
                            }`}>
                              {priority}
                            </span>
                          )}
                          <span className="text-stone-500 font-mono-code text-[11px]">· {tip.minutesAgo}m ago</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-stone-400 text-[11px]">
                          <span className="text-amber-400 font-medium">{store.name}</span>
                          <span>({store.jurisdiction} · {store.countyOrWard})</span>
                          <span>·</span>
                          <span className="font-mono-code text-stone-200">${tip.priceSeen}</span>
                          <span>·</span>
                          <span>{tip.bottleLocation}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border ${style.badge}`}>
                            <span>{style.icon}</span>
                            <span>{style.label}</span>
                          </div>
                          <div className="text-[10px] text-stone-400 mt-1 max-w-[240px] text-right truncate" title={decision.reason}>
                            {decision.reason}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Delivery Activity & Verification Logs */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-brand font-bold text-lg text-stone-100">
                  Notification Delivery Activity Log
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Real-time record of all SMS text alerts and morning digests sent to your devices.
                </p>
              </div>

              {notificationLogs.length > 0 && (
                <button
                  onClick={() => {
                    setNotificationLogs([]);
                    localStorage.removeItem('bourbon_notification_logs');
                  }}
                  className="text-stone-400 hover:text-red-400 text-xs transition-colors"
                >
                  Clear Logs
                </button>
              )}
            </div>

            {notificationLogs.length === 0 ? (
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-8 text-center space-y-2">
                <History className="w-8 h-8 text-stone-600 mx-auto" />
                <div className="font-semibold text-stone-300 text-sm">No Notifications Dispatched Yet</div>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  When a verified bottle sighting is broadcast, or when you trigger a test notification, the delivery record and payload will show here.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={handleSendTestSms}
                    className="bg-stone-900 hover:bg-stone-800 text-emerald-300 border border-emerald-800/80 px-3 py-1.5 rounded-lg text-xs"
                  >
                    Test SMS Alert
                  </button>
                  <button
                    onClick={handleSendTestEmail}
                    className="bg-stone-900 hover:bg-stone-800 text-sky-300 border border-sky-800/80 px-3 py-1.5 rounded-lg text-xs"
                  >
                    Test Email Digest
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-stone-800/80 bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
                {notificationLogs.map(log => (
                  <div key={log.id} className="p-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.type === 'sms'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-sky-950 text-sky-300 border border-sky-800'
                        }`}>
                          {log.type}
                        </span>
                        <span className="font-semibold text-stone-200">{log.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono-code">
                        <span>{log.timestamp}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                          {log.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-400">
                      Recipient: <span className="text-stone-300 font-mono-code">{log.recipient}</span>
                    </div>

                    <div className="p-2.5 bg-stone-900 border border-stone-800 rounded font-mono-code text-[11px] text-stone-300 whitespace-pre-wrap">
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
