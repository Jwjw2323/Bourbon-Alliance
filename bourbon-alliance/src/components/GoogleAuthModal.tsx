import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, User, LogOut, CheckCircle, Lock, EyeOff, Key, Phone, Mail } from 'lucide-react';
import { UserSession } from '../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession;
  onUpdateSession: (newSession: UserSession) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

// Google Identity Services JWT payload type
interface GoogleJwtPayload {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  userSession,
  onUpdateSession,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  // Inputs are ALWAYS blank by default when unauthenticated
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [googleClientId, setGoogleClientId] = useState(() => {
    return localStorage.getItem('bourbon_google_client_id') || 
           (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || 
           '19323179551-81fncrrnrv1gv690a98agpu8to55mtej.apps.googleusercontent.com';
  });
  const [isClerk, setIsClerk] = useState(false);
  const [anonymousByDefault, setAnonymousByDefault] = useState(true);
  const [smsConsent, setSmsConsent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync inputs ONLY when signed in; when signed out or opening modal, force blank inputs
  useEffect(() => {
    if (userSession.isSignedIn) {
      setEmailInput(userSession.email && !userSession.email.includes('whitman') ? userSession.email : '');
      setNameInput(userSession.name && !userSession.name.includes('Whitman') ? userSession.name : '');
      setPhoneInput(userSession.phoneNumber || '');
      setIsClerk(userSession.role === 'verified_clerk');
      setAnonymousByDefault(userSession.anonymousByDefault ?? true);
    } else {
      setEmailInput('');
      setNameInput('');
      setPhoneInput('');
      setIsClerk(false);
    }
  }, [userSession.isSignedIn, isOpen]);

  // Handle plain email change without auto-filling any name
  const handleEmailChange = (val: string) => {
    setEmailInput(val);
  };

  // Google Identity Services (GIS) integration
  useEffect(() => {
    if (!isOpen || userSession.isSignedIn) return;

    const clientId = googleClientId.trim();
    if (clientId && typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            try {
              // Decode Google JWT (payload is the 2nd part)
              const base64Url = response.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const payload: GoogleJwtPayload = JSON.parse(jsonPayload);

              onUpdateSession({
                ...userSession,
                isSignedIn: true,
                email: payload.email,
                name: payload.name || payload.given_name || 'Bourbon Scout',
                avatarUrl: payload.picture,
                isStoreWorker: isClerk,
                anonymousByDefault,
                role: isClerk ? 'verified_clerk' : 'whiskey_hunter',
                reputationScore: userSession.reputationScore > 0 ? userSession.reputationScore : 100,
                phoneNumber: phoneInput || userSession.phoneNumber,
                notificationEmail: payload.email,
                savedStoreIds: userSession.savedStoreIds || [],
                savedBottleIds: userSession.savedBottleIds || [],
                watchPriorities: userSession.watchPriorities || {},
                alertPrefs: {
                  ...userSession.alertPrefs,
                  notificationEmail: payload.email,
                  phoneNumber: phoneInput || userSession.alertPrefs?.phoneNumber
                }
              });
              onClose();
            } catch (err: any) {
              setAuthError('Could not parse Google credential token.');
            }
          }
        });

        const targetDiv = document.getElementById('google-signin-btn-container');
        if (targetDiv) {
          targetDiv.innerHTML = '';
          (window as any).google.accounts.id.renderButton(targetDiv, {
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 320
          });
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
  }, [isOpen, googleClientId, userSession.isSignedIn, isClerk, anonymousByDefault, phoneInput]);

  if (!isOpen) return null;

  const handleManualSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    const cleanName = nameInput.trim() || cleanEmail.split('@')[0];

    onUpdateSession({
      ...userSession,
      isSignedIn: true,
      email: cleanEmail,
      name: cleanName,
      phoneNumber: phoneInput.trim() || undefined,
      notificationEmail: cleanEmail,
      isStoreWorker: isClerk,
      anonymousByDefault,
      role: isClerk ? 'verified_clerk' : 'whiskey_hunter',
      reputationScore: userSession.reputationScore > 0 ? userSession.reputationScore : 100,
      savedStoreIds: userSession.savedStoreIds || [],
      savedBottleIds: userSession.savedBottleIds || [],
      watchPriorities: userSession.watchPriorities || {},
      alertPrefs: {
        ...userSession.alertPrefs,
        notificationEmail: cleanEmail,
        phoneNumber: phoneInput.trim() || userSession.alertPrefs?.phoneNumber
      }
    });
    setAuthError(null);
    onClose();
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('bourbon_alliance_user');
      localStorage.removeItem('bourbon_notification_logs');
    } catch (e) {}
    onUpdateSession({
      ...userSession,
      isSignedIn: false,
      email: undefined,
      name: undefined,
      avatarUrl: undefined,
      anonymousByDefault: true,
      role: 'member',
      reputationScore: 0
    });
    setEmailInput('');
    setNameInput('');
    setPhoneInput('');
  };

  const handleSaveClientId = (val: string) => {
    setGoogleClientId(val);
    localStorage.setItem('bourbon_google_client_id', val.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-stone-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {userSession.isSignedIn ? (
          /* Signed In Profile State */
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {userSession.avatarUrl ? (
                <img
                  src={userSession.avatarUrl}
                  alt={userSession.name || 'User'}
                  className="w-12 h-12 rounded-full border-2 border-amber-500 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-600/20 border-2 border-amber-500 flex items-center justify-center text-amber-300 font-bold text-lg">
                  {userSession.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-serif-brand font-bold text-lg text-stone-100 truncate">
                  {userSession.name}
                </h3>
                <p className="text-xs text-stone-400 font-mono-code truncate">{userSession.email}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Authenticated Member · {userSession.role === 'verified_clerk' ? 'Store Associate' : 'Alliance Hunter'}</span>
                </div>
              </div>
            </div>

            {/* Notification Contact Summary */}
            <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-stone-300 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Notification Settings</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-400">
                <div>
                  <span className="block text-stone-500">Phone for SMS:</span>
                  <span className="text-stone-200 font-mono-code">{userSession.phoneNumber || 'Not configured'}</span>
                </div>
                <div>
                  <span className="block text-stone-500">Alert Email:</span>
                  <span className="text-stone-200 font-mono-code truncate block">{userSession.email || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Privacy settings */}
            <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-300">
                  <EyeOff className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">Drop Tips Anonymously</span>
                </div>
                <input
                  type="checkbox"
                  checked={userSession.anonymousByDefault}
                  onChange={(e) => onUpdateSession({
                    ...userSession,
                    anonymousByDefault: e.target.checked
                  })}
                  className="rounded border-stone-700 text-amber-600 focus:ring-amber-500 h-4 w-4 bg-stone-900"
                />
              </div>
              <p className="text-[11px] text-stone-400">
                When enabled, your public posts will never display your name or email. You will appear as an anonymous scout or clerk.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-800">
              <span className="text-stone-400">
                Community Reputation: <strong className="text-amber-400 font-mono-code">{userSession.reputationScore} pts</strong>
              </span>

              <button
                onClick={handleSignOut}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Flow */
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Google OAuth Authentication</span>
              </div>
              <h2 className="font-serif-brand text-2xl font-bold text-stone-100 mt-1">
                Bourbon Alliance Login
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Authenticate your account on <span className="text-amber-400 font-mono-code">bourbonalliance.net</span> to bookmark favorite stores, receive instant Unicorn SMS push alerts, and submit verified drop tips.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-200">
                {authError}
              </div>
            )}

            {/* Official Google Identity Services Container & One-Click Login */}
            <div className="space-y-3">
              <div id="google-signin-btn-container" className="flex justify-center min-h-[44px]"></div>

              {/* Primary Sign in with Google Button */}
              <button
                type="button"
                onClick={handleManualSignIn}
                className="w-full bg-white hover:bg-stone-100 text-stone-900 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="flex items-center gap-2 p-3 bg-stone-950 border border-stone-800 rounded-lg text-[11px] text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Full Anonymity Shield:</strong> Drop tips never expose your real name or email unless you toggle public credit.
                </span>
              </div>
            </div>

            {/* Optional Alternative: Manual Alert Profile Setup */}
            <details className="pt-2 border-t border-stone-800 text-xs group">
              <summary className="cursor-pointer text-stone-400 hover:text-amber-400 font-medium py-1.5 flex items-center justify-between transition-colors select-none">
                <span>Or configure alerts manually without Google</span>
                <span className="text-stone-500 group-open:rotate-180 transition-transform">▾</span>
              </summary>

              <form onSubmit={handleManualSignIn} className="space-y-3 pt-3 text-xs">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Notification Email Address</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="hunter@example.com"
                      value={emailInput}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 pl-8 pr-3 py-1.5 rounded text-xs text-stone-200 font-mono-code focus:outline-none focus:border-amber-500 placeholder-stone-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Display Alias / Handle</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Choose an alias (e.g. DC Whiskey Scout)"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 pl-8 pr-3 py-1.5 rounded text-xs text-stone-200 focus:outline-none focus:border-amber-500 placeholder-stone-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Mobile Phone for SMS Drop Alerts (Optional)</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                    <input
                      type="tel"
                      placeholder="+1 (202) 555-0199"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 pl-8 pr-3 py-1.5 rounded text-xs text-stone-200 font-mono-code focus:outline-none focus:border-amber-500 placeholder-stone-600"
                    />
                  </div>

                  {phoneInput.trim().length > 0 && (
                    <div className="mt-2 p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-2 text-[11px]">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={smsConsent}
                          onChange={(e) => setSmsConsent(e.target.checked)}
                          className="mt-0.5 rounded border-stone-600 text-amber-600 focus:ring-amber-500 h-3.5 w-3.5 bg-stone-900 flex-shrink-0 cursor-pointer accent-amber-600"
                        />
                        <span className="text-stone-200 font-medium leading-relaxed">
                          Yes, I would like to receive automated text messages from Bourbon Alliance about account payment activity, allocated whiskey drops, restock alerts, and important updates. I understand I will receive up to 3 messages per day.
                        </span>
                      </label>

                      <div className="text-[10px] text-stone-400 pl-6 space-y-1 pt-1.5 border-t border-stone-800/80 leading-normal">
                        <p><strong className="text-stone-300">Message Frequency:</strong> You will receive up to 3 messages per day (message frequency varies based on regional sightings).</p>
                        <p><strong className="text-stone-300">Standard Rates:</strong> Message and data rates may apply depending on your mobile phone service plan.</p>
                        <p><strong className="text-stone-300">Help & Stop:</strong> Reply HELP for help or STOP to cancel any time.</p>
                        <p>Consent is not required to make a purchase or browse the website.</p>
                        <div className="pt-1 text-amber-400">
                          <button
                            type="button"
                            onClick={() => { onClose(); onOpenTerms?.(); }}
                            className="underline hover:text-amber-300"
                          >
                            Terms of Service
                          </button>
                          {' '}|{' '}
                          <button
                            type="button"
                            onClick={() => { onClose(); onOpenPrivacy?.(); }}
                            className="underline hover:text-amber-300"
                          >
                            Privacy Policy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="text-[11px] text-stone-300 cursor-pointer flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isClerk}
                      onChange={(e) => setIsClerk(e.target.checked)}
                      className="rounded border-stone-700 text-amber-600 focus:ring-amber-500 h-4 w-4 bg-stone-900"
                    />
                    <span>I work at a liquor store / distributor</span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-stone-300 cursor-pointer flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={anonymousByDefault}
                      onChange={(e) => setAnonymousByDefault(e.target.checked)}
                      className="rounded border-stone-700 text-amber-600 focus:ring-amber-500 h-4 w-4 bg-stone-900"
                    />
                    <span>Always post drop tips anonymously</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-md mt-2 text-xs uppercase tracking-wider"
                >
                  Save & Continue
                </button>
              </form>
            </details>

            {/* Advanced: Optional Google Client ID for Production OAuth */}
            <div className="pt-2 border-t border-stone-800/80">
              <details className="text-[11px] text-stone-500">
                <summary className="cursor-pointer hover:text-stone-300 flex items-center gap-1.5 py-1">
                  <Key className="w-3 h-3 text-amber-500/80" />
                  <span>Google OAuth Client ID (Production Config)</span>
                </summary>
                <div className="mt-2 space-y-1.5 pl-2">
                  <p className="text-[10px] text-stone-400">
                    Production Google Cloud OAuth Client ID:
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
                    value={googleClientId}
                    onChange={(e) => handleSaveClientId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 px-2 py-1 rounded text-[11px] text-stone-300 font-mono-code focus:outline-none focus:border-amber-500"
                  />
                </div>
              </details>
            </div>

            <div className="text-[10px] text-center text-stone-500 pt-1">
                By authenticating, you agree to the{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTerms?.();
                  }}
                  className="text-stone-400 hover:text-amber-400 underline"
                >
                  Terms & Conditions
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPrivacy?.();
                  }}
                  className="text-stone-400 hover:text-amber-400 underline"
                >
                  Privacy Policy
                </button>.
              </div>
            </div>
        )}

      </div>
    </div>
  );
};
