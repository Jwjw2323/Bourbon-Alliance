import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DropFeed } from './components/DropFeed';
import { StoreDirectory } from './components/StoreDirectory';
import { PriceCeilingIndex } from './components/PriceCeilingIndex';
import { StoreDiscoveryEngine } from './components/StoreDiscoveryEngine';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { DropTipModal } from './components/DropTipModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { INITIAL_DROP_TIPS } from './data/mockTips';
import { DC_MD_INDEPENDENT_STORES } from './data/mockStores';
import { POPULAR_BOTTLES } from './data/bottles';
import { DropTip, Store, UserSession } from './types';
import { GitBranch, Shield, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'stores' | 'ceilings' | 'discovery' | 'architecture'>('radar');
  
  // Persisted or default tips
  const [tips, setTips] = useState<DropTip[]>(() => {
    const saved = localStorage.getItem('bourbon_alliance_tips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DROP_TIPS;
      }
    }
    return INITIAL_DROP_TIPS;
  });

  const [stores] = useState<Store[]>(DC_MD_INDEPENDENT_STORES);
  const [bottles] = useState(POPULAR_BOTTLES);

  // User Google Session
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('bourbon_alliance_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {
          isSignedIn: false,
          anonymousByDefault: true,
          role: 'member',
          reputationScore: 0,
          savedStoreIds: [],
          savedBottleIds: []
        };
      }
    }
    return {
      isSignedIn: false,
      anonymousByDefault: true,
      role: 'member',
      reputationScore: 0,
      savedStoreIds: [],
      savedBottleIds: []
    };
  });

  // Modals
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Save tips to localStorage
  useEffect(() => {
    localStorage.setItem('bourbon_alliance_tips', JSON.stringify(tips));
  }, [tips]);

  // Save session to localStorage
  const handleUpdateSession = (newSession: UserSession) => {
    setUserSession(newSession);
    localStorage.setItem('bourbon_alliance_user', JSON.stringify(newSession));
  };

  // Upvote / downvote tips
  const handleVote = (tipId: string, direction: 'up' | 'down') => {
    setTips(prevTips =>
      prevTips.map(tip => {
        if (tip.id !== tipId) return tip;
        const currentVote = tip.userVote;

        if (currentVote === direction) {
          // undo vote
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
      
      {/* Primary Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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

        {activeTab === 'stores' && (
          <StoreDirectory
            stores={stores}
            onSelectStoreForTip={handleSelectStoreForTip}
            onOpenDiscoveryGuide={() => setActiveTab('discovery')}
          />
        )}

        {activeTab === 'ceilings' && (
          <PriceCeilingIndex bottles={bottles} />
        )}

        {activeTab === 'discovery' && (
          <StoreDiscoveryEngine />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureGuide />
        )}

      </main>

      {/* Footer */}
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
              onClick={() => setActiveTab('discovery')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              DC, MD & VA Store Discovery
            </button>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => setActiveTab('ceilings')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              Price Ceilings
            </button>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              VPS Specs & National Blueprint
            </button>
            <span className="text-stone-700">·</span>
            <a
              href="https://github.com/Jwjw2323/Bourbon-Alliance"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-stone-900 text-[10px] text-stone-600 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Built for independent bottle hunters and honest retailers. 100% independent.
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
      />

    </div>
  );
}
