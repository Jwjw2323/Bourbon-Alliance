import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Plus, 
  Radio, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { Store, Jurisdiction, PricingReputation } from '../types';

interface StoreDirectoryProps {
  stores: Store[];
  onSelectStoreForTip: (store: Store) => void;
  onOpenDiscoveryGuide: () => void;
}

export const StoreDirectory: React.FC<StoreDirectoryProps> = ({
  stores,
  onSelectStoreForTip,
  onOpenDiscoveryGuide
}) => {
  const [jurisdictionFilter, setJurisdictionFilter] = useState<'ALL' | Jurisdiction>('ALL');
  const [pricingFilter, setPricingFilter] = useState<'ALL' | PricingReputation>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('ALL');

  // Extract unique counties/wards
  const counties = Array.from(new Set(stores.map(s => s.countyOrWard))).sort();

  const filteredStores = stores.filter(store => {
    if (jurisdictionFilter !== 'ALL' && store.jurisdiction !== jurisdictionFilter) return false;
    if (pricingFilter !== 'ALL' && store.pricingReputation !== pricingFilter) return false;
    if (selectedCounty !== 'ALL' && store.countyOrWard !== selectedCounty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = store.name.toLowerCase().includes(q);
      const matchAddress = store.address.toLowerCase().includes(q);
      const matchLicense = store.licenseNumber.toLowerCase().includes(q);
      const matchKnownFor = store.knownFor.toLowerCase().includes(q);
      if (!matchName && !matchAddress && !matchLicense && !matchKnownFor) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & DC/MD Discovery Explanation */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Retail & Distillery Directory · DC, MD & VA</span>
            </div>
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
              DMV Spirits Retail Directory
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mt-1">
              DC has 100% private Class A retail. Maryland features independent stores across 23 counties. Virginia features licensed independent Farm Distilleries alongside state ABC drop points.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenDiscoveryGuide}
              className="border border-amber-600/60 bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>How We Discover DC, MD & VA Locations</span>
            </button>
          </div>
        </div>

        {/* Statutory Fact Bar across 3 jurisdictions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-stone-800">
          <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800/80 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-200">District of Columbia:</span>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Zero state stores. ~260 active private ABCA Class A stores.
              </p>
            </div>
          </div>

          <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800/80 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-200">Maryland:</span>
              <p className="text-stone-400 text-[11px] mt-0.5">
                23 open counties with private Class A stores (Montgomery is county ABS).
              </p>
            </div>
          </div>

          <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800/80 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-200">Virginia:</span>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Independent Farm Distilleries (Bowman, Catoctin) + State ABC drop hubs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Query */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search store or distillery name, street, license number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700/80 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500 placeholder-stone-500"
            />
          </div>

          {/* Jurisdiction Filter */}
          <div>
            <select
              value={jurisdictionFilter}
              onChange={(e) => {
                setJurisdictionFilter(e.target.value as any);
                setSelectedCounty('ALL');
              }}
              className="w-full bg-stone-950 border border-stone-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All DMV (DC, MD, VA)</option>
              <option value="DC">Washington DC (Class A)</option>
              <option value="MD">Maryland (Independent)</option>
              <option value="VA">Virginia (Distilleries & ABC)</option>
            </select>
          </div>

          {/* Pricing Reputation */}
          <div>
            <select
              value={pricingFilter}
              onChange={(e) => setPricingFilter(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Pricing Reputations</option>
              <option value="MSRP Loyal">MSRP Loyal (Fair)</option>
              <option value="Slight Markup (+10-25%)">Slight Markup (+10-25%)</option>
              <option value="Secondary / Museum">Secondary / Museum</option>
              <option value="Mixed / Dynamic">Mixed / Dynamic</option>
            </select>
          </div>

        </div>

        {/* County / Ward Sub-filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-800 text-xs">
          <span className="text-stone-400 text-[11px] mr-1">County / Ward:</span>
          <button
            onClick={() => setSelectedCounty('ALL')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              selectedCounty === 'ALL'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 bg-stone-950 border border-stone-800 hover:text-stone-200'
            }`}
          >
            All
          </button>
          {counties.map(county => (
            <button
              key={county}
              onClick={() => setSelectedCounty(county)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                selectedCounty === county
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 bg-stone-950 border border-stone-800 hover:text-stone-200'
              }`}
            >
              {county}
            </button>
          ))}
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStores.map(store => (
          <div
            key={store.id}
            className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md"
          >
            <div className="space-y-3">
              
              {/* Header: Name, Non-State badge, Rating */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/80">
                      {store.jurisdiction} · Non-State
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {store.countyOrWard}
                    </span>
                  </div>
                  <h3 className="font-serif-brand text-xl font-bold text-stone-100 mt-1">
                    {store.name}
                  </h3>
                </div>

                {/* Pricing Reputation Tag */}
                <div className="text-right">
                  <div className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                    store.pricingReputation === 'MSRP Loyal'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      : store.pricingReputation === 'Slight Markup (+10-25%)'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                      : 'bg-stone-800 text-stone-300 border-stone-700'
                  }`}>
                    {store.pricingReputation}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1">
                    ★ {store.rating.toFixed(1)} Community
                  </div>
                </div>
              </div>

              {/* License Details & Verification */}
              <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-stone-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-amber-400" />
                    License: <span className="font-mono-code text-stone-200">{store.licenseNumber}</span>
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> State-Verified Independent
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 truncate">
                  Type: {store.licenseType}
                </div>
              </div>

              {/* Known For / Drop Method */}
              <p className="text-xs text-stone-300">
                {store.knownFor}
              </p>

              {/* Allocation Method */}
              <div className="text-xs flex items-center gap-2 text-stone-400">
                <span className="text-stone-500 font-medium">Allocation Routine:</span>
                <span className="text-amber-400 font-medium">{store.allocationMethod}</span>
              </div>

              {/* Address & Phone */}
              <div className="space-y-1 text-xs text-stone-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                  <span>{store.address}, {store.city}, {store.state} {store.zip}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                  <a href={`tel:${store.phone}`} className="hover:text-stone-200 font-mono-code">
                    {store.phone}
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.address)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1 underline"
              >
                Directions <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => onSelectStoreForTip(store)}
                className="bg-amber-600/20 hover:bg-amber-600 hover:text-stone-950 text-amber-300 border border-amber-600/40 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Radio className="w-3 h-3" />
                <span>Drop Tip for Store</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
