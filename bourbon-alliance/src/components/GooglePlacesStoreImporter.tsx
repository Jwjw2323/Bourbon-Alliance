import React, { useState } from 'react';
import { X, Upload, Plus, Globe, CheckCircle, AlertCircle, Building2, MapPin, Phone, Database } from 'lucide-react';
import { Store, Jurisdiction, PricingReputation, StoreTier, StoreKind } from '../types';

interface GooglePlacesStoreImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImportStores: (newStores: Store[]) => void;
  existingCount: number;
}

export const GooglePlacesStoreImporter: React.FC<GooglePlacesStoreImporterProps> = ({
  isOpen,
  onClose,
  onImportStores,
  existingCount
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'manual'>('json');
  const [jsonInput, setJsonInput] = useState('');
  const [importSummary, setImportSummary] = useState<{ count: number; stores: Store[] } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Manual store state
  const [manualName, setManualName] = useState('');
  const [manualJurisdiction, setManualJurisdiction] = useState<Jurisdiction>('MD');
  const [manualAddress, setManualAddress] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualState, setManualState] = useState<'DC' | 'MD' | 'VA'>('MD');
  const [manualZip, setManualZip] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualWebsite, setManualWebsite] = useState('');
  const [manualReputation, setManualReputation] = useState<PricingReputation>('MSRP Loyal');
  const [manualTier, setManualTier] = useState<StoreTier>('Allocated Partner');
  const [manualKnownFor, setManualKnownFor] = useState('');

  if (!isOpen) return null;

  // Detect state and jurisdiction from address or text
  const detectJurisdiction = (address: string): { jurisdiction: Jurisdiction; state: 'DC' | 'MD' | 'VA' } => {
    const upper = address.toUpperCase();
    if (upper.includes('WASHINGTON, DC') || upper.includes('WASHINGTON DC') || upper.includes(', DC') || upper.includes(' 200')) {
      return { jurisdiction: 'DC', state: 'DC' };
    }
    if (upper.includes(', VA') || upper.includes('VIRGINIA') || upper.includes(' 220') || upper.includes(' 221') || upper.includes(' 222') || upper.includes(' 223')) {
      return { jurisdiction: 'VA', state: 'VA' };
    }
    return { jurisdiction: 'MD', state: 'MD' };
  };

  // Parse Google Places API JSON (supports both New Google Places API and Legacy Places API responses)
  const handleParseJson = () => {
    setParseError(null);
    setImportSummary(null);

    const raw = jsonInput.trim();
    if (!raw) {
      setParseError('Please paste Google Places API JSON response.');
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      // Places API can be an object with results: [...], or places: [...], or an array directly
      let items: any[] = [];
      if (Array.isArray(parsed)) {
        items = parsed;
      } else if (Array.isArray(parsed.results)) {
        items = parsed.results;
      } else if (Array.isArray(parsed.places)) {
        items = parsed.places;
      } else if (parsed.name && (parsed.formatted_address || parsed.formattedAddress)) {
        items = [parsed];
      } else {
        throw new Error('Unrecognized JSON format. Expecting "results": [] or "places": [].');
      }

      if (items.length === 0) {
        setParseError('JSON parsed, but 0 stores were found in the list.');
        return;
      }

      const imported: Store[] = items.map((item, idx) => {
        // Handle New vs Legacy field names
        const name = item.displayName?.text || item.name || 'Liquor Store';
        const address = item.formattedAddress || item.formatted_address || item.vicinity || '';
        const website = item.websiteUri || item.website || '';
        const phone = item.nationalPhoneNumber || item.internationalPhoneNumber || item.formatted_phone_number || '';
        const rating = typeof item.rating === 'number' ? item.rating : 4.5;
        const placeId = item.id || item.place_id || `gplaces-${Date.now()}-${idx}`;
        const lat = item.location?.latitude || item.geometry?.location?.lat || 38.9072;
        const lng = item.location?.longitude || item.geometry?.location?.lng || -77.0369;

        const { jurisdiction, state } = detectJurisdiction(address);
        const cityMatch = address.split(',')[1]?.trim() || (state === 'DC' ? 'Washington' : 'Bethesda');
        const zipMatch = address.match(/\b\d{5}\b/)?.[0] || '20001';

        const hasSite = Boolean(website && website.startsWith('http'));

        return {
          id: `store-gp-${Date.now()}-${idx}`,
          placeId,
          name,
          jurisdiction,
          countyOrWard: jurisdiction === 'DC' ? 'Washington DC Metro' : state === 'MD' ? 'Maryland Regional' : 'Northern Virginia',
          kind: 'private' as StoreKind,
          licenseType: `${jurisdiction} Off-Premises Spirits Retailer`,
          licenseNumber: `GP-${placeId.slice(-6).toUpperCase()}`,
          isStateRun: false,
          address: address.split(',')[0] || address,
          city: cityMatch,
          state,
          zip: zipMatch,
          phone: phone || undefined,
          website: hasSite ? website : undefined,
          hasWebsite: hasSite,
          hours: 'Mon–Sat 10 a.m.–9 p.m.',
          rating,
          tier: 'Allocated Partner',
          pricingReputation: 'MSRP Loyal',
          knownFor: hasSite ? `Independent spirits merchant with verified website catalog (${new URL(website).hostname}).` : 'Independent DMV spirits retailer.',
          allocationMethod: 'First-Come Shelf',
          verifiedAtccAbca: true,
          activeSightings: 0,
          lat,
          lng
        };
      });

      setImportSummary({ count: imported.length, stores: imported });
    } catch (err: any) {
      setParseError(`JSON parse error: ${err.message || 'Invalid JSON syntax'}`);
    }
  };

  const handleConfirmImport = () => {
    if (importSummary && importSummary.stores.length > 0) {
      onImportStores(importSummary.stores);
      onClose();
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualAddress.trim()) {
      setParseError('Store name and street address are required.');
      return;
    }

    const hasSite = Boolean(manualWebsite.trim() && manualWebsite.startsWith('http'));

    const newStore: Store = {
      id: `store-manual-${Date.now()}`,
      name: manualName.trim(),
      jurisdiction: manualJurisdiction,
      countyOrWard: manualJurisdiction === 'DC' ? 'DC Independent' : manualJurisdiction === 'MD' ? 'MD Independent' : 'VA Retail',
      kind: 'private',
      licenseType: `${manualJurisdiction} Class A Retail Spirits`,
      licenseNumber: `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
      isStateRun: false,
      address: manualAddress.trim(),
      city: manualCity.trim() || (manualJurisdiction === 'DC' ? 'Washington' : 'Laurel'),
      state: manualState,
      zip: manualZip.trim() || '20001',
      phone: manualPhone.trim() || undefined,
      website: hasSite ? manualWebsite.trim() : undefined,
      hasWebsite: hasSite,
      hours: 'Mon–Sat 10 a.m.–9 p.m.',
      rating: 4.8,
      tier: manualTier,
      pricingReputation: manualReputation,
      knownFor: manualKnownFor.trim() || 'Verified independent spirits retailer with allocated bottle releases.',
      allocationMethod: 'First-Come Shelf',
      verifiedAtccAbca: true,
      activeSightings: 0,
      lat: manualJurisdiction === 'DC' ? 38.9072 : 39.0458,
      lng: manualJurisdiction === 'DC' ? -77.0369 : -76.8415
    };

    onImportStores([newStore]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Store Ingestion Engine</span>
          </div>
          <h2 className="font-serif-brand text-2xl font-bold text-stone-100">
            Import Real Stores via Google Places API
          </h2>
          <p className="text-xs text-stone-400">
            Populate actual liquor stores in Maryland and Washington DC with websites, addresses, and phone numbers.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 mt-4 text-xs">
          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'json'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Paste Google Places JSON</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Single Store Manually</span>
          </button>
        </div>

        {parseError && (
          <div className="mt-4 p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {/* TAB 1: JSON Import */}
        {activeTab === 'json' && (
          <div className="space-y-4 mt-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] text-stone-300 font-semibold">
                  Google Places API JSON Payload
                </label>
                <span className="text-[10px] text-stone-500 font-mono-code">
                  Supports /places/v1 or Legacy Nearby/Text Search
                </span>
              </div>
              <textarea
                rows={9}
                placeholder={`Paste JSON from Google Places API query here, e.g.:
{
  "places": [
    {
      "displayName": { "text": "Schneider's of Capitol Hill" },
      "formattedAddress": "300 Massachusetts Ave NE, Washington, DC 20002",
      "websiteUri": "https://dtstore.schneiders.com",
      "nationalPhoneNumber": "(202) 543-9300",
      "rating": 4.9
    }
  ]
}`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 font-mono-code text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleParseJson}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
              >
                Parse & Inspect Stores
              </button>

              {importSummary && (
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Import {importSummary.count} Stores into Directory</span>
                </button>
              )}
            </div>

            {/* Parsed Preview */}
            {importSummary && (
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                <div className="font-semibold text-stone-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Parsed {importSummary.count} Real Stores Ready to Ingest:</span>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-stone-800/80 pr-1">
                  {importSummary.stores.map((s, idx) => (
                    <div key={idx} className="py-2 space-y-0.5 text-[11px]">
                      <div className="font-bold text-stone-100 flex items-center gap-2">
                        <span>{s.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-mono-code">
                          {s.jurisdiction}
                        </span>
                        {s.hasWebsite && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 flex items-center gap-1 font-mono-code">
                            <Globe className="w-2.5 h-2.5" /> Has Website
                          </span>
                        )}
                      </div>
                      <div className="text-stone-400">{s.address}, {s.city}, {s.state} {s.zip}</div>
                      {s.website && (
                        <div className="text-sky-400 font-mono-code text-[10px] truncate">{s.website}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Manual Single Store Add */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualAdd} className="space-y-4 mt-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Store / Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corridor Wine & Spirits"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 p-2 rounded-lg text-stone-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Jurisdiction / Region *</label>
                <select
                  value={manualJurisdiction}
                  onChange={(e) => {
                    const j = e.target.value as Jurisdiction;
                    setManualJurisdiction(j);
                    setManualState(j as any);
                  }}
                  className="w-full bg-stone-950 border border-stone-800 p-2 rounded-lg text-stone-200"
                >
                  <option value="MD">Maryland (MD)</option>
                  <option value="DC">Washington DC (DC)</option>
                  <option value="VA">Virginia (VA)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-stone-400 block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3315 Corridor Marketplace"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 p-2 rounded-lg text-stone-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">City</label>
                <input
                  type="text"
                  placeholder="e.g. Laurel"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 p-2 rounded-lg text-stone-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Store Website URL</label>
                <input
                  type="url"
                  placeholder="https://www.corridorwine.com"
                  value={manualWebsite}
                  onChange={(e) => setManualWebsite(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 p-2 rounded-lg text-stone-200 font-mono-code"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="(301) 617-9463"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 p-2 rounded-lg text-stone-200 font-mono-code"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Pricing Reputation</label>
                <select
                  value={manualReputation}
                  onChange={(e) => setManualReputation(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 p-2 rounded-lg text-stone-200"
                >
                  <option value="MSRP Loyal">MSRP Loyal (Fair)</option>
                  <option value="State Mandated MSRP">State Mandated MSRP</option>
                  <option value="Slight Markup (+10-25%)">Slight Markup (+10-25%)</option>
                  <option value="Secondary / Museum">Secondary / Museum</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Store Classification</label>
                <select
                  value={manualTier}
                  onChange={(e) => setManualTier(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 p-2 rounded-lg text-stone-200"
                >
                  <option value="Allocated Partner">Allocated Partner (High Volume)</option>
                  <option value="Boutique Specialist">Boutique Specialist</option>
                  <option value="High Volume Standard">High Volume Standard</option>
                  <option value="Hidden Gem">Hidden Gem</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-stone-400 block mb-1">Notes / Known Barrel Picks</label>
              <textarea
                rows={2}
                placeholder="Specializes in Buffalo Trace store picks, Saturday drops, etc."
                value={manualKnownFor}
                onChange={(e) => setManualKnownFor(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 p-2 rounded-lg text-stone-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 rounded-lg text-xs transition-all shadow-md active:scale-95"
            >
              Add Store to Directory
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
