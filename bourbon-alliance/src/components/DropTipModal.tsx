import React, { useState } from 'react';
import { X, Shield, Lock, Eye, AlertCircle, CheckCircle2, Store as StoreIcon, Sparkles } from 'lucide-react';
import { DropTip, TipsterRole, BottleLocation, Store, BottleInfo, Jurisdiction } from '../types';

interface DropTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTip: (tip: DropTip) => void;
  stores: Store[];
  bottles: BottleInfo[];
}

export const DropTipModal: React.FC<DropTipModalProps> = ({
  isOpen,
  onClose,
  onSubmitTip,
  stores,
  bottles
}) => {
  const [role, setRole] = useState<TipsterRole>('anonymous_clerk');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id || '');
  const [customStoreName, setCustomStoreName] = useState('');
  const [customJurisdiction, setCustomJurisdiction] = useState<Jurisdiction>('DC');
  const [customAddress, setCustomAddress] = useState('');
  
  const [selectedBottleId, setSelectedBottleId] = useState<string>(bottles[0]?.id || '');
  const [priceSeen, setPriceSeen] = useState<number>(bottles[0]?.fairCeiling || 65);
  const [bottleLocation, setBottleLocation] = useState<BottleLocation>('Behind Counter (Ask)');
  const [quantityEstimate, setQuantityEstimate] = useState<string>('3-5 bottles');
  const [alias, setAlias] = useState<string>('Anonymous Store Clerk');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  if (!isOpen) return null;

  const selectedBottle = bottles.find(b => b.id === selectedBottleId);
  const selectedStore = stores.find(s => s.id === selectedStoreId);

  const msrp = selectedBottle?.msrp || 50;
  const ceiling = selectedBottle?.fairCeiling || 75;
  const isOverCeiling = priceSeen > ceiling;
  const markupPercent = Math.round(((priceSeen - msrp) / msrp) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate anonymous tip reference code
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const tipCode = `BA-${randomHex}`;
    setGeneratedCode(tipCode);

    const storeName = selectedStoreId === 'custom' 
      ? customStoreName 
      : (selectedStore?.name || 'Independent Store');
    
    const storeAddress = selectedStoreId === 'custom'
      ? customAddress
      : (selectedStore?.address || '');

    const jurisdiction = selectedStoreId === 'custom'
      ? customJurisdiction
      : (selectedStore?.jurisdiction || 'DC');

    const county = selectedStoreId === 'custom'
      ? (customJurisdiction === 'DC' ? 'DC Independent' : 'MD Independent')
      : (selectedStore?.countyOrWard || 'DC/MD');

    const newTip: DropTip = {
      id: `tip-${Date.now()}`,
      tipCode,
      storeId: selectedStoreId,
      storeName,
      jurisdiction,
      countyOrWard: county,
      address: storeAddress,
      bottleName: selectedBottle?.name || 'Allocated Bourbon',
      distillery: selectedBottle?.distillery || 'Kentucky Distillery',
      bottleProof: selectedBottle?.proof,
      priceSeen: Number(priceSeen),
      msrp,
      ceilingPrice: ceiling,
      tipsterRole: role,
      tipsterAlias: alias.trim() || 'Anonymous Tipster',
      bottleLocation,
      quantityEstimate,
      notes: notes.trim() || 'Spotted on site. First come first served.',
      createdAt: new Date().toISOString(),
      minutesAgo: 0,
      upvotes: 1,
      downvotes: 0,
      isSoldOut: false,
      isVerified: role === 'anonymous_clerk' || role === 'anonymous_driver'
    };

    onSubmitTip(newTip);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-100 p-1 rounded-lg hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-brand text-2xl font-bold text-stone-100">
              Anonymous Tip Broadcasted!
            </h3>
            <p className="text-stone-300 text-sm max-w-md mx-auto">
              Your drop intelligence has been dispatched to fellow Bourbon Alliance hunters across DC & MD.
            </p>

            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl inline-block text-left my-4">
              <div className="text-xs text-stone-400">Anonymous Tip Receipt Code</div>
              <div className="font-mono-code text-amber-400 font-bold text-xl tracking-wider">{generatedCode}</div>
              <div className="text-[11px] text-stone-400 mt-1">
                Save this code if you wish to later report "Sold Out" or edit the quantity without logging in.
              </div>
            </div>

            <div>
              <button
                onClick={handleResetAndClose}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
              >
                Back to Drop Radar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Modal Title & Privacy Banner */}
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Logging Whistleblower Hotline</span>
              </div>
              <h2 className="font-serif-brand text-2xl font-bold text-stone-100 mt-1">
                Drop an Anonymous Whiskey Tip
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Store employees, delivery drivers, distributors, and street scouts: submit allocations safely. No personal logs or IP addresses stored.
              </p>
            </div>

            {/* Tipster Persona Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                I am reporting as:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('anonymous_clerk');
                    setAlias('Liquor Store Associate');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'anonymous_clerk'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                    <StoreIcon className="w-3.5 h-3.5 text-amber-400" />
                    Store Employee
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Clerk, manager, or state/private worker</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('anonymous_driver');
                    setAlias('Route Distributor Rep');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'anonymous_driver'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Distributor / Driver
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Delivery rep, warehouse, wholesale</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('anonymous_hunter');
                    setAlias('DC/MD Whiskey Scout');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'anonymous_hunter'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    Shopper / Hunter
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Customer currently browsing store</div>
                </button>
              </div>
            </div>

            {/* Store Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Store Location (DC & MD Non-State / Independent)
              </label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <optgroup label="Washington DC (ABCA Class A - Independent)">
                  {stores.filter(s => s.jurisdiction === 'DC').map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.countyOrWard}) - {s.pricingReputation}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Maryland Independent Stores (Non-County)">
                  {stores.filter(s => s.jurisdiction === 'MD').map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city}, {s.countyOrWard})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Virginia (Farm Distilleries & State ABC Drops)">
                  {stores.filter(s => s.jurisdiction === 'VA').map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city}, {s.countyOrWard})
                    </option>
                  ))}
                </optgroup>
                <option value="custom">+ Other / Custom Store (Add New)</option>
              </select>

              {selectedStoreId === 'custom' && (
                <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg space-y-3 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Store / Distillery Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Bowman Distillery or Arlington ABC"
                        value={customStoreName}
                        onChange={(e) => setCustomStoreName(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 px-3 py-1.5 text-xs rounded text-stone-100 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Jurisdiction</label>
                      <select
                        value={customJurisdiction}
                        onChange={(e) => setCustomJurisdiction(e.target.value as Jurisdiction)}
                        className="w-full bg-stone-900 border border-stone-700 px-3 py-1.5 text-xs rounded text-stone-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="DC">Washington DC (Class A)</option>
                        <option value="MD">Maryland (Independent)</option>
                        <option value="VA">Virginia (Distillery or ABC)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Street Address & City</label>
                    <input
                      type="text"
                      placeholder="e.g. 1200 M St NW, Washington, DC or Annapolis, MD"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 px-3 py-1.5 text-xs rounded text-stone-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottle Selection & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Allocated Bottle
                </label>
                <select
                  value={selectedBottleId}
                  onChange={(e) => {
                    const bId = e.target.value;
                    setSelectedBottleId(bId);
                    const b = bottles.find(item => item.id === bId);
                    if (b) setPriceSeen(b.fairCeiling);
                  }}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {bottles.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.proof})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Price Seen on Shelf ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-mono-code">$</span>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={priceSeen}
                    onChange={(e) => setPriceSeen(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-7 pr-3 py-2 text-sm text-stone-100 font-mono-code focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Price Ceiling & Gouge Radar Card */}
            {selectedBottle && (
              <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                isOverCeiling 
                  ? 'bg-red-950/30 border-red-800/80 text-red-200' 
                  : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  {isOverCeiling ? (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold">
                      {isOverCeiling ? 'Markup Warning: Above Alliance Ceiling' : 'Within Fair Alliance Ceiling'}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      MSRP: <span className="font-mono-code text-stone-300">${msrp}</span> · 
                      Alliance Ceiling: <span className="font-mono-code text-stone-300">${ceiling}</span> · 
                      Markup: <span className="font-mono-code text-amber-400">{markupPercent >= 0 ? `+${markupPercent}%` : `${markupPercent}%`}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono-code text-xs font-bold">
                    {priceSeen <= msrp ? 'MSRP DEAL' : isOverCeiling ? 'SECONDARY' : 'FAIR PRICE'}
                  </div>
                  <div className="text-[10px] text-stone-400">Secondary Avg: ${selectedBottle.secondaryAvg}</div>
                </div>
              </div>
            )}

            {/* Location in Store & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Bottle Location in Store
                </label>
                <select
                  value={bottleLocation}
                  onChange={(e) => setBottleLocation(e.target.value as BottleLocation)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Behind Counter (Ask)">Behind Counter (Must ask clerk)</option>
                  <option value="On Shelf">On Regular Shelf (Visible)</option>
                  <option value="In Glass Case">In Glass Display Case</option>
                  <option value="Store Raffle / Lottery">Store Raffle / Lottery Sign-up</option>
                  <option value="Bundle Deal Required">Bundle Deal Required</option>
                  <option value="Unloading from Truck">Unloading from Pallet / Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Quantity / Inventory Status
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 bottles left, 1 case in back, limit 1"
                  value={quantityEstimate}
                  onChange={(e) => setQuantityEstimate(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* Tipster Public Alias & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Anonymous Alias (Displayed)
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="e.g. Capitol Hill Scout, Anonymous Clerk"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">Your real identity remains hidden</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Field Notes / Condition
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cash only, limit 1 per person, ask for Dave"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-2 flex items-center justify-between border-t border-stone-800">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Zero telemetry · Encrypted transmission</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-md hover:scale-[1.01]"
                >
                  Broadcast Anonymous Tip
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
