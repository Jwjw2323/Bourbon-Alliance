import React, { useState } from 'react';
import { DollarSign, ShieldAlert, CheckCircle2, Search, Calculator, Flame } from 'lucide-react';
import { BottleInfo } from '../types';

interface PriceCeilingIndexProps {
  bottles: BottleInfo[];
}

export const PriceCeilingIndex: React.FC<PriceCeilingIndexProps> = ({ bottles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Interactive Gouge Calculator State
  const [calcBottleId, setCalcBottleId] = useState<string>(bottles[0]?.id || '');
  const [calcPrice, setCalcPrice] = useState<number>(bottles[0]?.fairCeiling || 65);

  const selectedCalcBottle = bottles.find(b => b.id === calcBottleId);
  const calcMsrp = selectedCalcBottle?.msrp || 50;
  const calcCeiling = selectedCalcBottle?.fairCeiling || 80;
  const calcSecondary = selectedCalcBottle?.secondaryAvg || 120;
  const calcDiff = calcPrice - calcCeiling;
  const calcMarkup = Math.round(((calcPrice - calcMsrp) / calcMsrp) * 100);

  const categories = ['ALL', 'Bourbon', 'Wheated', 'Single Barrel', 'Rye', 'Cask Strength'];

  const filteredBottles = bottles.filter(b => {
    if (categoryFilter !== 'ALL' && b.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!b.name.toLowerCase().includes(q) && !b.distillery.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>Bourbon Alliance Market Standard</span>
            </div>
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
              DC & MD Price Ceiling Index
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mt-1">
              Ceilings represent the maximum acceptable retail price before a purchase is classified as secondary gouging. Stores adhering to these ceilings earn verified community status.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800">
            <Flame className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div className="text-stone-300">
              <span className="font-bold text-stone-100">Alliance Motto:</span> Never pay secondary in a retail store.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Calculator Card */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
          <Calculator className="w-4 h-4" />
          <span>Quick Retail Gouge Checker</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] text-stone-400 block mb-1">Select Bottle</label>
            <select
              value={calcBottleId}
              onChange={(e) => {
                setCalcBottleId(e.target.value);
                const b = bottles.find(item => item.id === e.target.value);
                if (b) setCalcPrice(b.fairCeiling);
              }}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            >
              {bottles.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-stone-400 block mb-1">Store Price ($ USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-stone-400 font-mono-code text-xs">$</span>
              <input
                type="number"
                min="1"
                value={calcPrice}
                onChange={(e) => setCalcPrice(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-stone-100 font-mono-code focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            {calcPrice <= calcMsrp ? (
              <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-700/80 text-emerald-200 text-xs w-full flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="font-bold">MSRP Steal ({calcMarkup}%)</div>
                  <div className="text-[10px] text-stone-300">Buy immediately! At or below distillery MSRP.</div>
                </div>
              </div>
            ) : calcPrice <= calcCeiling ? (
              <div className="p-2.5 rounded-lg bg-amber-950/70 border border-amber-700/80 text-amber-200 text-xs w-full flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="font-bold">Fair Retail (+{calcMarkup}%)</div>
                  <div className="text-[10px] text-stone-300">Within alliance ceiling. Acceptable support for independent store.</div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-700/80 text-red-200 text-xs w-full flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <div className="font-bold">Gouge Alert (+${calcDiff} over ceiling)</div>
                  <div className="text-[10px] text-stone-300">Museum pricing (+{calcMarkup}%). Secondary average is ${calcSecondary}.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search bottle or distillery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500 placeholder-stone-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 bg-stone-950 hover:text-stone-100 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ceiling Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-950 border-b border-stone-800 text-[11px] font-mono-code uppercase text-stone-400">
              <tr>
                <th className="px-4 py-3.5">Bottle Name & Proof</th>
                <th className="px-4 py-3.5">Distillery</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5 text-right">Official MSRP</th>
                <th className="px-4 py-3.5 text-right text-amber-400 font-bold">Alliance Ceiling</th>
                <th className="px-4 py-3.5 text-right text-stone-400">Secondary Avg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredBottles.map((bottle) => (
                <tr key={bottle.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-serif-brand font-bold text-stone-100 sm:text-base">
                      {bottle.name}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono-code">
                      {bottle.proof}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-stone-300">
                    {bottle.distillery}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] font-medium text-stone-300 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                      {bottle.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono-code text-stone-300">
                    ${bottle.msrp}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono-code font-bold text-amber-400">
                    ${bottle.fairCeiling}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono-code text-stone-400">
                    ${bottle.secondaryAvg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
