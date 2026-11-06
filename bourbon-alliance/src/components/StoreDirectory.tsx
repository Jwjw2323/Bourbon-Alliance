import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Search, 
  ExternalLink, 
  Radio, 
  Clock,
  Globe,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  Filter
} from 'lucide-react';
import { Store, Jurisdiction, PricingReputation, DropTip } from '../types';
import { GooglePlacesStoreImporter } from './GooglePlacesStoreImporter';

interface StoreDirectoryProps {
  stores: Store[];
  tips?: DropTip[];
  onSelectStoreForTip: (store: Store) => void;
  onImportStores?: (newStores: Store[]) => void;
  onDeleteStore?: (storeId: string) => void;
  onResetStores?: () => void;
}

export const StoreDirectory: React.FC<StoreDirectoryProps> = ({
  stores,
  tips = [],
  onSelectStoreForTip,
  onImportStores,
  onDeleteStore,
  onResetStores
}) => {
  const [jurisdictionFilter, setJurisdictionFilter] = useState<'ALL' | Jurisdiction>('ALL');
  const [pricingFilter, setPricingFilter] = useState<'ALL' | PricingReputation>('ALL');
  const [websiteOnly, setWebsiteOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('ALL');
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  // Extract unique counties/wards
  const counties = Array.from(new Set(stores.map(s => s.countyOrWard))).sort();

  const filteredStores = stores.filter(store => {
    if (jurisdictionFilter !== 'ALL' && store.jurisdiction !== jurisdictionFilter) return false;
    if (pricingFilter !== 'ALL' && store.pricingReputation !== pricingFilter) return false;
    if (websiteOnly && !store.website) return false;
    if (selectedCounty !== 'ALL' && store.countyOrWard !== selectedCounty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = store.name.toLowerCase().includes(q);
      const matchAddress = store.address.toLowerCase().includes(q);
      const matchCity = store.city.toLowerCase().includes(q);
      const matchLicense = store.licenseNumber?.toLowerCase().includes(q);
      const matchKnownFor = store.knownFor?.toLowerCase().includes(q);
      if (!matchName && !matchAddress && !matchCity && !matchLicense && !matchKnownFor) return false;
    }
    return true;
  });

  const storesWithWebsitesCount = stores.filter(s => Boolean(s.website)).length;

  const handleExportJson = () => {
    const jsonString = JSON.stringify(stores, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(jsonString);
      setCopiedExport(true);
      setTimeout(() => setCopiedExport(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>DMV Retail Roster</span>
            </div>
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
              Store & Retailer Directory
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mt-1">
              Verified independent spirits merchants, Maryland county ABS locations, and Virginia ABC drop points across DC, MD, and VA.
            </p>
          </div>

          {/* Action cluster: Google Places Ingestion & Export */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {onImportStores && (
              <button
                onClick={() => setIsImporterOpen(true)}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import via Google Places API</span>
              </button>
            )}

            <button
              onClick={handleExportJson}
              className="bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Copy store catalog JSON to clipboard"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{copiedExport ? 'JSON Copied!' : 'Export JSON'}</span>
            </button>
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
              placeholder="Search store name, street address, city, or specialty..."
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
              <option value="ALL">All Regions (DC, MD, VA)</option>
              <option value="DC">Washington DC</option>
              <option value="MD">Maryland</option>
              <option value="VA">Virginia</option>
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
              <option value="State Mandated MSRP">State Mandated MSRP</option>
              <option value="Slight Markup (+10-25%)">Slight Markup (+10-25%)</option>
              <option value="Secondary / Museum">Secondary / Museum</option>
            </select>
          </div>

        </div>

        {/* Quick Toggles: Website Only & County Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-xs">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWebsiteOnly(!websiteOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                websiteOnly
                  ? 'bg-sky-950 text-sky-300 border-sky-700 font-bold'
                  : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>With Websites Only ({storesWithWebsitesCount})</span>
            </button>

            <span className="text-stone-500">|</span>

            <span className="text-stone-400 text-[11px]">Area:</span>
            <button
              onClick={() => setSelectedCounty('ALL')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                selectedCounty === 'ALL'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 bg-stone-950 border border-stone-800 hover:text-stone-200'
              }`}
            >
              All Areas ({stores.length})
            </button>
            {counties.slice(0, 5).map(county => (
              <button
                key={county}
                onClick={() => setSelectedCounty(county)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors hidden sm:inline-block ${
                  selectedCounty === county
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'text-stone-400 bg-stone-950 border border-stone-800 hover:text-stone-200'
                }`}
              >
                {county}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-stone-400">
            Showing <strong className="text-stone-200">{filteredStores.length}</strong> stores
          </div>

        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStores.map(store => {
          // Dynamic active sightings count from tips array
          const activeDrops = tips.filter(t => t.storeId === store.id && !t.isSoldOut).length;

          return (
            <div
              key={store.id}
              className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md relative group"
            >
              <div className="space-y-3">
                
                {/* Header: Name, Tag, Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono-code text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/80">
                        {store.jurisdiction} · {store.tier}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {store.countyOrWard}
                      </span>
                      {activeDrops > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{activeDrops} Active Drop{activeDrops > 1 ? 's' : ''}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif-brand text-xl font-bold text-stone-100 mt-1">
                      {store.name}
                    </h3>
                  </div>

                  {/* Pricing Reputation Tag */}
                  <div className="text-right flex-shrink-0">
                    <div className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      store.pricingReputation === 'MSRP Loyal' || store.pricingReputation === 'State Mandated MSRP'
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

                {/* Known For / Notes */}
                <p className="text-xs text-stone-300 leading-relaxed">
                  {store.knownFor}
                </p>

                {/* Allocation Routine & Delivery Day */}
                <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-stone-400">
                    <span className="text-stone-500 font-medium">Allocation Routine:</span>
                    <span className="text-amber-400 font-medium">{store.allocationMethod}</span>
                  </div>
                  {store.delivery && (
                    <div className="text-emerald-400 text-[11px] font-mono-code flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Delivery: {store.delivery} Mornings
                    </div>
                  )}
                </div>

                {/* Hours, Address, Phone & Website */}
                <div className="space-y-1.5 text-xs text-stone-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                    <span>{store.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                    <span>{store.address}, {store.city}, {store.state} {store.zip}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 pt-0.5">
                    {store.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                        <a href={`tel:${store.phone}`} className="hover:text-amber-400 font-mono-code">
                          {store.phone}
                        </a>
                      </div>
                    )}

                    {store.website && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                        <a
                          href={store.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-400 hover:text-sky-300 underline font-mono-code flex items-center gap-1 text-[11px]"
                        >
                          <span>Store Website</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-400 hover:text-amber-400 flex items-center gap-1 underline"
                  >
                    Maps <ExternalLink className="w-3 h-3" />
                  </a>

                  {onDeleteStore && store.id.startsWith('store-') && (
                    <button
                      onClick={() => onDeleteStore(store.id)}
                      className="text-stone-600 hover:text-red-400 transition-colors p-1"
                      title="Remove store from directory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onSelectStoreForTip(store)}
                  className="bg-amber-600/20 hover:bg-amber-600 hover:text-stone-950 text-amber-300 border border-amber-600/40 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-xs"
                >
                  <Radio className="w-3 h-3" />
                  <span>Report Drop at Store</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Google Places Store Importer Modal */}
      {onImportStores && (
        <GooglePlacesStoreImporter
          isOpen={isImporterOpen}
          onClose={() => setIsImporterOpen(false)}
          onImportStores={onImportStores}
          existingCount={stores.length}
        />
      )}

    </div>
  );
};
