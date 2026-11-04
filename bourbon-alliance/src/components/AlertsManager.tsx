import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Moon, 
  Sliders, 
  Clock, 
  RotateCcw
} from 'lucide-react';
import { DropTip, Store, BottleInfo, AlertPrefs, Priority, Channel, UserSession } from '../types';
import { AlertEngine, PREVIEW_HOUR, DEFAULT_ALERT_PREFS } from '../services/alertEngine';

interface AlertsManagerProps {
  tips: DropTip[];
  stores: Store[];
  bottles: BottleInfo[];
  userSession: UserSession;
  onUpdateSession: (session: UserSession) => void;
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
  onUpdateSession
}) => {
  const [selectedBottleToAdd, setSelectedBottleToAdd] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'watchlist' | 'rules'>('feed');

  // Watch priorities from userSession
  const watch = userSession.watchPriorities || {
    'blantons-single-barrel': 'unicorn',
    'weller-antique-107': 'unicorn',
    'stagg-batch-barrel-proof': 'unicorn',
    'eh-taylor-small-batch': 'want',
    'eagle-rare-10': 'want',
    'john-j-bowman-single-barrel': 'want'
  };

  const prefs = userSession.alertPrefs || DEFAULT_ALERT_PREFS;

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
      alertPrefs: newPrefs
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
              Alerts & Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mt-1">
              Set priority alerts for high-demand bottles across DC, MD & VA. Manage notification frequency, quiet hours, and personal hunting thresholds.
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

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 mt-4 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
              activeSubTab === 'feed'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            Live Matched Alerts ({watchedAlerts.length})
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
            onClick={() => setActiveSubTab('rules')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
              activeSubTab === 'rules'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            Quiet Hours & Limits
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Live Matched Alerts */}
      {activeSubTab === 'feed' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
              <div className="text-stone-400 text-[11px]">Instant Alerts Dispatched</div>
              <div className="text-xl font-bold font-mono-code text-emerald-400">{smsCount}</div>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
              <div className="text-stone-400 text-[11px]">Watched Sighting Matches</div>
              <div className="text-xl font-bold font-mono-code text-amber-400">{watchedAlerts.length}</div>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
              <div className="text-stone-400 text-[11px]">Filtered (Sold Out / Outside Rules)</div>
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
          </div>
        </div>
      )}

      {/* SUB-TAB 2: My Watchlist Manager */}
      {activeSubTab === 'watchlist' && (
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-brand font-bold text-lg text-stone-100">
                  Target Bottle Priority Matrix
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Set how Bourbon Alliance alerts you when each bottle is spotted.
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
                        Ceiling: <span className="font-mono-code text-amber-400">${bottle.fairCeiling}</span>
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
                        title="Instant notification"
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

      {/* SUB-TAB 3: Notification & Quiet Hours Preferences */}
      {activeSubTab === 'rules' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div>
            <h3 className="font-serif-brand font-bold text-lg text-stone-100">
              Notification & Quiet Hours
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Prevent notification burnout with cooldowns, quiet hours, and daily message caps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* Communication channels */}
            <div className="space-y-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                Active Alert Channels
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-200">SMS Drop Alerts</div>
                  <div className="text-[11px] text-stone-400">Immediate text message when a Unicorn bottle drops</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.sms}
                  onChange={(e) => handleUpdatePrefs({ ...prefs, sms: e.target.checked })}
                  className="rounded border-stone-700 text-amber-600 focus:ring-amber-500 h-4 w-4 bg-stone-900"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-200">Email Morning Note</div>
                  <div className="text-[11px] text-stone-400">Batched digest sent every morning at 8:00 AM</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.email}
                  onChange={(e) => handleUpdatePrefs({ ...prefs, email: e.target.checked })}
                  className="rounded border-stone-700 text-amber-600 focus:ring-amber-500 h-4 w-4 bg-stone-900"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-200">Require Corroboration for SMS</div>
                  <div className="text-[11px] text-stone-400">Wait until a clerk or 2nd scout confirms before texting</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.corroborationForSms}
                  onChange={(e) => handleUpdatePrefs({ ...prefs, corroborationForSms: e.target.checked })}
                  className="rounded border-stone-700 text-amber-600 focus:ring-amber-500 h-4 w-4 bg-stone-900"
                />
              </div>
            </div>

            {/* Quiet Hours & Caps */}
            <div className="space-y-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-amber-500" />
                Quiet Hours & Anti-Spam
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Quiet Hours Start</label>
                  <select
                    value={prefs.quietStart}
                    onChange={(e) => handleUpdatePrefs({ ...prefs, quietStart: Number(e.target.value) })}
                    className="w-full bg-stone-900 border border-stone-700 p-2 rounded text-stone-200"
                  >
                    <option value={20}>8:00 PM</option>
                    <option value={21}>9:00 PM</option>
                    <option value={22}>10:00 PM</option>
                    <option value={23}>11:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Quiet Hours End</label>
                  <select
                    value={prefs.quietEnd}
                    onChange={(e) => handleUpdatePrefs({ ...prefs, quietEnd: Number(e.target.value) })}
                    className="w-full bg-stone-900 border border-stone-700 p-2 rounded text-stone-200"
                  >
                    <option value={6}>6:00 AM</option>
                    <option value={7}>7:00 AM</option>
                    <option value={8}>8:00 AM</option>
                    <option value={9}>9:00 AM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  Daily SMS Cap ({prefs.smsDailyCap} messages / day)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={prefs.smsDailyCap}
                  onChange={(e) => handleUpdatePrefs({ ...prefs, smsDailyCap: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  Same-Store Cooldown ({prefs.cooldownHours} hours)
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={prefs.cooldownHours}
                  onChange={(e) => handleUpdatePrefs({ ...prefs, cooldownHours: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
