import React from 'react';
import { PlusCircle, User, Compass, DollarSign, Bell, Sliders } from 'lucide-react';
import { UserSession } from '../types';

interface HeaderProps {
  activeTab: 'radar' | 'alerts' | 'stores' | 'ceilings';
  setActiveTab: (tab: 'radar' | 'alerts' | 'stores' | 'ceilings') => void;
  openTipModal: () => void;
  openAuthModal: () => void;
  userSession: UserSession;
  activeTipsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openTipModal,
  openAuthModal,
  userSession,
  activeTipsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5 sm:py-4 gap-3">
          
          {/* Brand & Domain (With generous padding to avoid any text cutoff) */}
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => setActiveTab('radar')}
              className="text-left group flex items-center gap-3 focus:outline-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-950 flex items-center justify-center border border-amber-500/40 shadow-inner group-hover:border-amber-400 transition-colors flex-shrink-0">
                <span className="font-serif-brand font-bold text-lg sm:text-xl text-amber-100 tracking-wider">BA</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif-brand text-lg sm:text-2xl font-bold tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors leading-tight">
                    Bourbon Alliance
                  </span>
                  <span className="hidden sm:inline-flex text-[11px] font-mono-code bg-amber-950/60 text-amber-400 border border-amber-800/60 px-2 py-0.5 rounded leading-normal">
                    bourbonalliance.net
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-stone-400 flex items-center gap-2 mt-0.5 whitespace-nowrap">
                  <span>DC, MD & VA Spirits Radar</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span className="text-amber-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{activeTipsCount} Live Sightings</span>
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Clean 4 Production Tabs) */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-900/80 p-1.5 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'radar'
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Drop Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Alerts & Watchlist</span>
            </button>

            <button
              onClick={() => setActiveTab('stores')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'stores'
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Store Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('ceilings')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ceilings'
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Price Ceilings</span>
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Drop Tip Button */}
            <button
              onClick={openTipModal}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Drop Tip</span>
            </button>

            {/* Google OAuth Login Button */}
            <button
              onClick={openAuthModal}
              className="border border-stone-700 hover:border-amber-500/60 bg-stone-900/90 text-stone-200 px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              {userSession.isSignedIn ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-600/30 border border-amber-500 flex items-center justify-center text-amber-300 font-bold text-xs">
                    {userSession.name ? userSession.name.charAt(0) : 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium text-xs max-w-[100px] truncate text-stone-300">
                    {userSession.name || 'Member'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
                  </svg>
                  <span className="hidden sm:inline">Sign in</span>
                  <span className="sm:hidden"><User className="w-4 h-4" /></span>
                </div>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 border-t border-stone-800/80 no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('radar')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium ${
              activeTab === 'radar' ? 'bg-amber-600 text-stone-950 font-semibold' : 'text-stone-300'
            }`}
          >
            Drop Radar
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium ${
              activeTab === 'alerts' ? 'bg-amber-600 text-stone-950 font-semibold' : 'text-stone-300'
            }`}
          >
            Alerts & Watchlist
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium ${
              activeTab === 'stores' ? 'bg-amber-600 text-stone-950 font-semibold' : 'text-stone-300'
            }`}
          >
            Store Directory
          </button>
          <button
            onClick={() => setActiveTab('ceilings')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium ${
              activeTab === 'ceilings' ? 'bg-amber-600 text-stone-950 font-semibold' : 'text-stone-300'
            }`}
          >
            Price Ceilings
          </button>
        </div>

      </div>
    </header>
  );
};
