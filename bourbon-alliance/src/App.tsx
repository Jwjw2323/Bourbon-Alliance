import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DropFeed } from './components/DropFeed';
import { StoreDirectory } from './components/StoreDirectory';
import { PriceCeilingIndex } from './components/PriceCeilingIndex';
import { AlertsManager } from './components/AlertsManager';
import { DropTipModal } from './components/DropTipModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { INITIAL_DROP_TIPS } from './data/mockTips';
import { DC_MD_VA_STORES } from './data/mockStores';
import { POPULAR_BOTTLES } from './data/bottles';
import { DropTip, Store, UserSession } from './types';
import { DEFAULT_ALERT_PREFS } from './services/alertEngine';
import { ShieldCheck, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'alerts' | 'stores' | 'ceilings' | 'privacy' | 'terms'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/privacy') return 'privacy';
      if (path === '/terms') return 'terms';
    }
    return 'radar';
  });

  // Handle URL history state synchronization
  const handleNavigateTab = (tab: 'radar' | 'alerts' | 'stores' | 'ceilings' | 'privacy' | 'terms') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      if (tab === 'privacy') {
        window.history.pushState(null, '', '/privacy');
      } else if (tab === 'terms') {
        window.history.pushState(null, '', '/terms');
      } else {
        window.history.pushState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/privacy') {
        setActiveTab('privacy');
      } else if (path === '/terms') {
        setActiveTab('terms');
      } else {
        setActiveTab('radar');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Persisted or clean tips (automatically purges any leftover fake 'tip-101' mock data)
  const [tips, setTips] = useState<DropTip[]>(() => {
    const saved = localStorage.getItem('bourbon_alliance_tips');
    if (saved) {
      try {
        const parsed: DropTip[] = JSON.parse(saved);
        // If saved tips contain old fabricated mock IDs (tip-101 through tip-114), purge them!
        if (Array.isArray(parsed) && parsed.some(t => t.id === 'tip-101' || t.id === 'tip-102')) {
          localStorage.removeItem('bourbon_alliance_tips');
          return INITIAL_DROP_TIPS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_DROP_TIPS;
      }
    }
    return INITIAL_DROP_TIPS;
  });

  // Stores: Loaded from localStorage or verified baseline DC/MD/VA stores
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('bourbon_alliance_stores');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        return DC_MD_VA_STORES;
      }
    }
    return DC_MD_VA_STORES;
  });

  const [bottles] = useState(POPULAR_BOTTLES);

  // User Session (Dynamic Google OAuth Profile + SMS/Email endpoints)
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('bourbon_alliance_user');
    if (saved) {
      try {
        const parsed: UserSession = JSON.parse(saved);
        return {
          ...parsed,
          watchPriorities: parsed.watchPriorities || {
            'blantons-single-barrel': 'unicorn',
            'weller-antique-107': 'unicorn',
            'stagg-batch-barrel-proof': 'unicorn',
            'eh-taylor-small-batch': 'want',
            'eagle-rare-10': 'want'
          },
          alertPrefs: {
            ...DEFAULT_ALERT_PREFS,
            ...(parsed.alertPrefs || {}),
            phoneNumber: parsed.phoneNumber || parsed.alertPrefs?.phoneNumber || '',
            notificationEmail: parsed.notificationEmail || parsed.email || parsed.alertPrefs?.notificationEmail || ''
          }
        };
      } catch (e) {
        // Fallback below
      }
    }
    return {
      isSignedIn: false,
      anonymousByDefault: true,
      role: 'member',
      reputationScore: 0,
      savedStoreIds: [],
      savedBottleIds: [],
      watchPriorities: {
        'blantons-single-barrel': 'unicorn',
        'weller-antique-107': 'unicorn',
        'stagg-batch-barrel-proof': 'unicorn',
        'eh-taylor-small-batch': 'want',
        'eagle-rare-10': 'want'
      },
      alertPrefs: DEFAULT_ALERT_PREFS
    };
  });

  // Modals
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Save tips to localStorage
  useEffect(() => {
    localStorage.setItem('bourbon_alliance_tips', JSON.stringify(tips));
  }, [tips]);

  // Save stores to localStorage
  useEffect(() => {
    localStorage.setItem('bourbon_alliance_stores', JSON.stringify(stores));
  }, [stores]);

  // Save session to localStorage
  const handleUpdateSession = (newSession: UserSession) => {
    setUserSession(newSession);
    localStorage.setItem('bourbon_alliance_user', JSON.stringify(newSession));
  };

  // Import stores from Google Places API
  const handleImportStores = (newStores: Store[]) => {
    setStores(prev => {
      // Avoid duplicate stores by name or address
      const existingNames = new Set(prev.map(s => s.name.toLowerCase()));
      const filtered = newStores.filter(ns => !existingNames.has(ns.name.toLowerCase()));
      return [...filtered, ...prev];
    });
  };

  // Delete store
  const handleDeleteStore = (storeId: string) => {
    setStores(prev => prev.filter(s => s.id !== storeId));
  };

  // Reset stores to verified baseline
  const handleResetStores = () => {
    setStores(DC_MD_VA_STORES);
    localStorage.removeItem('bourbon_alliance_stores');
  };

  // Upvote / downvote tips
  const handleVote = (tipId: string, direction: 'up' | 'down') => {
    setTips(prevTips =>
      prevTips.map(tip => {
        if (tip.id !== tipId) return tip;
        const currentVote = tip.userVote;

        if (currentVote === direction) {
          return {
            ...tip,
            userVote: undefined,
            upvotes: direction === 'up' ? tip.upvotes - 1 : tip.upvotes,
            downvotes: direction === 'down' ? tip.downvotes - 1 : tip.downvotes
          };
        }

        let newUp = tip.upvotes;
        let newDown = tip.downvotes;

        if (currentVote === 'up') newUp -= 1;
        if (currentVote === 'down') newDown -= 1;

        if (direction === 'up') newUp += 1;
        if (direction === 'down') newDown += 1;

        return {
          ...tip,
          userVote: direction,
          upvotes: newUp,
          downvotes: newDown
        };
      })
    );
  };

  // Mark Sold Out
  const handleMarkSoldOut = (tipId: string) => {
    setTips(prevTips =>
      prevTips.map(tip => {
        if (tip.id === tipId) {
          return { ...tip, isSoldOut: true };
        }
        return tip;
      })
    );
  };

  // Submit new tip
  const handleSubmitTip = (newTip: DropTip) => {
    setTips(prev => [newTip, ...prev]);
  };

  // Select store from directory to drop tip
  const handleSelectStoreForTip = (_store: Store) => {
    setIsTipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
      
      {/* Primary Header with Fixed Height & Accurate Live Sightings Count */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        openTipModal={() => setIsTipModalOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
        userSession={userSession}
        activeTipsCount={tips.filter(t => !t.isSoldOut).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeTab === 'radar' && (
          <DropFeed
            tips={tips}
            onVote={handleVote}
            onMarkSoldOut={handleMarkSoldOut}
            onOpenTipModal={() => setIsTipModalOpen(true)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsManager
            tips={tips}
            stores={stores}
            bottles={bottles}
            userSession={userSession}
            onUpdateSession={handleUpdateSession}
            onOpenPrivacy={() => handleNavigateTab('privacy')}
            onOpenTerms={() => handleNavigateTab('terms')}
          />
        )}

        {activeTab === 'stores' && (
          <StoreDirectory
            stores={stores}
            tips={tips}
            onSelectStoreForTip={handleSelectStoreForTip}
            onImportStores={handleImportStores}
            onDeleteStore={handleDeleteStore}
            onResetStores={handleResetStores}
          />
        )}

        {activeTab === 'ceilings' && (
          <PriceCeilingIndex bottles={bottles} />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPolicy
            onBack={() => handleNavigateTab('radar')}
            onNavigateTerms={() => handleNavigateTab('terms')}
          />
        )}

        {activeTab === 'terms' && (
          <TermsAndConditions
            onBack={() => handleNavigateTab('radar')}
            onNavigatePrivacy={() => handleNavigateTab('privacy')}
          />
        )}

      </main>

      {/* Clean Production Footer */}
      <footer className="bg-stone-950 border-t border-stone-800/80 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 font-serif-brand font-bold text-stone-300 text-sm">
              <span>Bourbon Alliance</span>
              <span className="font-mono-code text-xs text-amber-500/80">bourbonalliance.net</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Community radar tracking independent retailers, farm distilleries, MSRP price ceilings, and verified drops in Washington DC, Maryland, and Virginia.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => handleNavigateTab('radar')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              Drop Radar
            </button>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => handleNavigateTab('alerts')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              SMS Alerts
            </button>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => handleNavigateTab('stores')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              Store Directory
            </button>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => handleNavigateTab('ceilings')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              Price Ceilings
            </button>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => handleNavigateTab('privacy')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => handleNavigateTab('terms')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              Terms & Conditions
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-stone-900 text-[10px] text-stone-600 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Built for independent bottle hunters, clerks, and transparent retailers. 100% independent.
          </div>
          <div>
            Not affiliated with state ABC agencies, Montgomery County ABS, or distilled spirits conglomerates.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DropTipModal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        onSubmitTip={handleSubmitTip}
        stores={stores}
        bottles={bottles}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userSession={userSession}
        onUpdateSession={handleUpdateSession}
        onOpenPrivacy={() => handleNavigateTab('privacy')}
        onOpenTerms={() => handleNavigateTab('terms')}
      />

    </div>
  );
}
