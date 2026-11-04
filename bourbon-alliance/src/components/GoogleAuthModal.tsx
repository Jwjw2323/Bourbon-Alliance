import React, { useState } from 'react';
import { X, ShieldCheck, User, LogOut, CheckCircle, Lock, EyeOff } from 'lucide-react';
import { UserSession } from '../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession;
  onUpdateSession: (newSession: UserSession) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  userSession,
  onUpdateSession,
}) => {
  const [customEmail, setCustomEmail] = useState('jonathanwhitman907@gmail.com');
  const [customName, setCustomName] = useState('Jonathan Whitman');
  const [isClerk, setIsClerk] = useState(false);
  const [anonymousByDefault, setAnonymousByDefault] = useState(userSession.anonymousByDefault ?? true);

  if (!isOpen) return null;

  const handleSimulateGoogleLogin = () => {
    onUpdateSession({
      ...userSession,
      isSignedIn: true,
      email: customEmail,
      name: customName,
      isStoreWorker: isClerk,
      anonymousByDefault,
      role: isClerk ? 'verified_clerk' : 'whiskey_hunter',
      reputationScore: 120,
      savedStoreIds: ['dc-schneiders', 'md-corridor-wine-spirits'],
      savedBottleIds: ['blantons-single-barrel', 'weller-antique-107'],
      watchPriorities: userSession.watchPriorities || {
        'blantons-single-barrel': 'unicorn',
        'weller-antique-107': 'unicorn'
      },
      alertPrefs: userSession.alertPrefs || {
        regions: ['DC', 'MD', 'VA'],
        sms: true,
        email: true,
        quietStart: 22,
        quietEnd: 8,
        cooldownHours: 4,
        smsDailyCap: 3,
        corroborationForSms: true,
        freshWindowMin: 90
      }
    });
    onClose();
  };

  const handleSignOut = () => {
    onUpdateSession({
      ...userSession,
      isSignedIn: false,
      anonymousByDefault: true,
      role: 'member',
      reputationScore: 0,
      savedStoreIds: [],
      savedBottleIds: []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1 rounded-lg hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {userSession.isSignedIn ? (
          /* Signed In Profile State */
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-600/20 border-2 border-amber-500 flex items-center justify-center text-amber-300 font-bold text-lg">
                {userSession.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-serif-brand font-bold text-lg text-stone-100">
                  {userSession.name}
                </h3>
                <p className="text-xs text-stone-400 font-mono-code">{userSession.email}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Google Account Verified · {userSession.role === 'verified_clerk' ? 'Store Associate' : 'Alliance Hunter'}</span>
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
                When enabled, your public posts will never display your Google name or email. You will appear as an anonymous scout or clerk.
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
                Authenticate with your Google Account to bookmark favorite independent stores, receive drop push alerts, and build hunter credibility.
              </p>
            </div>

            {/* Official Google Button */}
            <div className="space-y-3">
              <button
                onClick={handleSimulateGoogleLogin}
                className="w-full bg-white hover:bg-stone-100 text-stone-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-2 p-3 bg-stone-950 border border-stone-800 rounded-lg text-[11px] text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Privacy First:</strong> You can always toggle full anonymity. We never expose your personal name on drop tips unless you choose to.
                </span>
              </div>
            </div>

            {/* Account Quick Settings */}
            <div className="space-y-3 pt-2 border-t border-stone-800 text-xs">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Your Google Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 px-3 py-1.5 rounded text-xs text-stone-200 font-mono-code focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-[11px] text-stone-300">I work at a liquor store / distributor</label>
                <input
                  type="checkbox"
                  checked={isClerk}
                  onChange={(e) => setIsClerk(e.target.checked)}
                  className="rounded border-stone-700 text-amber-600 focus:ring-amber-500 h-4 w-4 bg-stone-900"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-[11px] text-stone-300">Always post drop tips anonymously</label>
                <input
                  type="checkbox"
                  checked={anonymousByDefault}
                  onChange={(e) => setAnonymousByDefault(e.target.checked)}
                  className="rounded border-stone-700 text-amber-600 focus:ring-amber-500 h-4 w-4 bg-stone-900"
                />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
