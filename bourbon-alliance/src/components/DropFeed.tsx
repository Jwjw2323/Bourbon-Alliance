import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MapPin, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  Filter, 
  Share2, 
  Radio, 
  Search, 
  PackageX,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { DropTip } from '../types';

interface DropFeedProps {
  tips: DropTip[];
  onVote: (tipId: string, direction: 'up' | 'down') => void;
  onMarkSoldOut: (tipId: string) => void;
  onOpenTipModal: () => void;
}

export const DropFeed: React.FC<DropFeedProps> = ({
  tips,
  onVote,
  onMarkSoldOut,
  onOpenTipModal
}) => {
  const [jurisdictionFilter, setJurisdictionFilter] = useState<'ALL' | 'DC' | 'MD' | 'VA'>('ALL');
  const [ceilingFilter, setCeilingFilter] = useState<'ALL' | 'UNDER_CEILING' | 'MSRP_ONLY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTips = tips.filter(tip => {
    if (jurisdictionFilter !== 'ALL' && tip.jurisdiction !== jurisdictionFilter) return false;
    if (ceilingFilter === 'UNDER_CEILING' && tip.priceSeen > tip.ceilingPrice) return false;
    if (ceilingFilter === 'MSRP_ONLY' && tip.priceSeen > tip.msrp + 5) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tip.bottleName.toLowerCase().includes(q);
      const matchStore = tip.storeName.toLowerCase().includes(q);
      const matchCounty = tip.countyOrWard.toLowerCase().includes(q);
      if (!matchName && !matchStore && !matchCounty) return false;
    }
    return true;
  });

  const handleShare = (tip: DropTip) => {
    const text = `🚨 Bourbon Alliance Drop Alert: ${tip.bottleName} spotted at ${tip.storeName} (${tip.jurisdiction}) for $${tip.priceSeen}! Tracked on https://bourbonalliance.net`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(tip.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Pulse */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono-code font-semibold tracking-wider text-emerald-400 uppercase">
                DC, MD & VA Live Allocation Radar
              </span>
            </div>
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-100">
              Community Drop Stream
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
              Crowdsourced by independent clerks, farm distillery tasting rooms, Virginia ABC insiders, delivery drivers, and local scouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTipModal}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-md"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Broadcast a Sighting</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="bg-stone-900/90 border border-stone-800/80 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search bottle name (e.g. Blanton's, Bowman, Weller) or store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700/80 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500 placeholder-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Segmented Buttons */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setJurisdictionFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                jurisdictionFilter === 'ALL'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              All DMV
            </button>
            <button
              onClick={() => setJurisdictionFilter('DC')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                jurisdictionFilter === 'DC'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Washington DC
            </button>
            <button
              onClick={() => setJurisdictionFilter('MD')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                jurisdictionFilter === 'MD'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Maryland
            </button>
            <button
              onClick={() => setJurisdictionFilter('VA')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                jurisdictionFilter === 'VA'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Virginia
            </button>
          </div>

        </div>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/60 text-xs">
          <span className="text-stone-400 flex items-center gap-1 text-[11px]">
            <Filter className="w-3 h-3" /> Filter Ceilings:
          </span>
          <button
            onClick={() => setCeilingFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              ceilingFilter === 'ALL'
                ? 'bg-stone-800 text-stone-100'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Show All
          </button>
          <button
            onClick={() => setCeilingFilter('UNDER_CEILING')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              ceilingFilter === 'UNDER_CEILING'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Fair Price Only (≤ Ceiling)
          </button>
          <button
            onClick={() => setCeilingFilter('MSRP_ONLY')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              ceilingFilter === 'MSRP_ONLY'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Strict MSRP Hunter
          </button>

          <span className="ml-auto text-[11px] text-stone-400">
            Showing {filteredTips.length} drop tips
          </span>
        </div>
      </div>

      {/* Drop Tips Stream Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTips.length === 0 ? (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-600/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-brand text-xl text-stone-100 font-bold">
                {tips.length === 0 ? 'Radar Active · No Live Drops Reported' : 'No Sightings Match Your Filter'}
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm max-w-md mx-auto">
                {tips.length === 0 
                  ? 'All placeholder mock sightings have been purged. The feed reflects only real community reports. Spotted an allocated bottle on a shelf or behind the counter?'
                  : 'Try resetting your jurisdiction or price ceiling filter to inspect other regions.'}
              </p>
            </div>
            
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenTipModal}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Radio className="w-4 h-4" />
                <span>Broadcast First Community Sighting</span>
              </button>
              {filteredTips.length !== tips.length && (
                <button
                  onClick={() => {
                    setJurisdictionFilter('ALL');
                    setCeilingFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-xs px-3.5 py-2 rounded-xl transition-colors font-medium"
                >
                  Reset Active Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredTips.map((tip) => {
            const isOverCeiling = tip.priceSeen > tip.ceilingPrice;
            const isAtMsrp = tip.priceSeen <= tip.msrp + 5;
            const markupAmount = tip.priceSeen - tip.msrp;

            return (
              <div
                key={tip.id}
                className={`bg-stone-900 border rounded-xl p-4 sm:p-5 transition-all shadow-md ${
                  tip.isSoldOut 
                    ? 'border-stone-800 opacity-60 bg-stone-950/60'
                    : isOverCeiling
                    ? 'border-stone-800 hover:border-amber-700/60'
                    : 'border-stone-800 hover:border-amber-500/60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left Column: Bottle & Store details */}
                  <div className="space-y-2 flex-1">
                    
                    {/* Header line: Role badge & time */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {tip.tipsterRole === 'anonymous_clerk' && (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          {tip.tipsterAlias} (Verified Store Clerk)
                        </span>
                      )}
                      {tip.tipsterRole === 'anonymous_driver' && (
                        <span className="text-sky-400 font-semibold flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 text-sky-400" />
                          {tip.tipsterAlias} (Route Delivery Rep)
                        </span>
                      )}
                      {tip.tipsterRole === 'anonymous_hunter' && (
                        <span className="text-stone-300 font-medium">
                          {tip.tipsterAlias} (Scout)
                        </span>
                      )}
                      {tip.tipsterRole === 'verified_member' && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          {tip.tipsterAlias}
                        </span>
                      )}

                      <span aria-hidden="true" className="text-stone-600">·</span>
                      <span className="text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tip.minutesAgo < 60 
                          ? `${tip.minutesAgo}m ago` 
                          : `${Math.floor(tip.minutesAgo / 60)}h ${tip.minutesAgo % 60}m ago`}
                      </span>

                      <span aria-hidden="true" className="text-stone-600">·</span>
                      <span className="font-mono-code text-[11px] text-stone-500">
                        Ref: {tip.tipCode}
                      </span>

                      {tip.isSoldOut && (
                        <span className="text-red-400 bg-red-950/60 border border-red-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                          Reported Sold Out
                        </span>
                      )}
                    </div>

                    {/* Bottle Title */}
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-serif-brand text-lg sm:text-xl font-bold text-stone-100">
                        {tip.bottleName}
                      </h3>
                      {tip.bottleProof && (
                        <span className="text-xs text-stone-400 font-mono-code">
                          {tip.bottleProof}
                        </span>
                      )}
                    </div>

                    {/* Store location & Jurisdictions */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-300">
                      <div className="flex items-center gap-1 font-medium text-amber-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{tip.storeName}</span>
                      </div>
                      <span className="text-stone-500">·</span>
                      <span className="text-stone-400">{tip.countyOrWard}</span>
                      <span className="text-stone-500">·</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tip.storeName + ' ' + tip.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-400 hover:text-amber-400 flex items-center gap-1 text-[11px] underline"
                      >
                        Directions <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Location in store & inventory status */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 bg-stone-950/70 p-2.5 rounded-lg border border-stone-800/80">
                      <div>
                        <span className="text-stone-500 text-[11px] block">Placement:</span>
                        <span className="font-medium text-stone-200">{tip.bottleLocation}</span>
                      </div>
                      <span className="text-stone-700">|</span>
                      <div>
                        <span className="text-stone-500 text-[11px] block">Quantity:</span>
                        <span className="font-medium text-amber-300 font-mono-code">{tip.quantityEstimate}</span>
                      </div>
                      <span className="text-stone-700">|</span>
                      <div className="flex-1 min-w-[180px]">
                        <span className="text-stone-500 text-[11px] block">Tipster Field Notes:</span>
                        <span className="italic text-stone-300">"{tip.notes}"</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Price breakdown & Ceiling comparison */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-stone-800 pt-3 md:pt-0 gap-3 min-w-[200px]">
                    <div className="text-left md:text-right">
                      <div className="text-[11px] text-stone-400 uppercase tracking-wider">Reported Price</div>
                      <div className="text-2xl font-bold font-mono-code text-stone-100">
                        ${tip.priceSeen}
                      </div>

                      {/* Ceiling status label */}
                      <div className="mt-1">
                        {isAtMsrp ? (
                          <span className="text-[11px] text-emerald-400 font-semibold flex md:justify-end items-center gap-1">
                            <Tag className="w-3 h-3" /> True MSRP Sighting
                          </span>
                        ) : !isOverCeiling ? (
                          <span className="text-[11px] text-amber-400 font-semibold flex md:justify-end items-center gap-1">
                            Within Fair Ceiling (+$ {markupAmount})
                          </span>
                        ) : (
                          <span className="text-[11px] text-red-400 font-semibold flex md:justify-end items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Above Ceiling (+${markupAmount})
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-stone-400 mt-0.5">
                        MSRP: ${tip.msrp} · Ceiling: ${tip.ceilingPrice}
                      </div>
                    </div>

                    {/* Community verification & actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onVote(tip.id, 'up')}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono-code border transition-colors ${
                          tip.userVote === 'up'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                        }`}
                        title="Confirm in stock / valid tip"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{tip.upvotes}</span>
                      </button>

                      <button
                        onClick={() => onVote(tip.id, 'down')}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-mono-code border transition-colors ${
                          tip.userVote === 'down'
                            ? 'bg-red-950 text-red-300 border-red-700'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                        }`}
                        title="Mark inaccurate"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleShare(tip)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 bg-stone-950 border border-stone-800"
                        title="Copy drop alert"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {!tip.isSoldOut && (
                        <button
                          onClick={() => onMarkSoldOut(tip.id)}
                          className="text-[11px] text-stone-400 hover:text-red-400 underline ml-1"
                        >
                          Sold out?
                        </button>
                      )}
                    </div>

                    {copiedId === tip.id && (
                      <div className="text-[11px] text-emerald-400 font-medium">
                        Alert copied to clipboard!
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
