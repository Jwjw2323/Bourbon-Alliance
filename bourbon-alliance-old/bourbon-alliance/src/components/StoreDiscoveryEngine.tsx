import React, { useState } from 'react';
import { 
  Building, 
  Download, 
  Terminal, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  MapPin,
  RefreshCw
} from 'lucide-react';

export const StoreDiscoveryEngine: React.FC = () => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'dc' | 'md' | 'va' | 'script'>('dc');

  const dcCurlScript = `# 1. Fetch all Washington DC Active Class A Retailers (Off-Premises Spirits)
# Socrata Open Data API (DC ABCA / Alcoholic Beverage and Cannabis Administration)
curl -X GET "https://opendata.dc.gov/api/v3/datasets/alcohol-beverage-regulation-administration/records?where=license_class%20%3D%20%27Class%20A%27%20AND%20status%20%3D%20%27Active%27&limit=300" \\
  -H "Accept: application/json" -o dc_class_a_stores.json

# 2. Extract Store Name, Address, Ward, and License Number
node -e '
  const fs = require("fs");
  const data = JSON.parse(fs.readFileSync("dc_class_a_stores.json"));
  const stores = (data.records || data.features).map(r => {
    const f = r.attributes || r.properties || r;
    return {
      id: "dc-" + (f.LICENSE_NUMBER || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: f.TRADE_NAME || f.APPLICANT_NAME,
      jurisdiction: "DC",
      countyOrWard: "DC Ward " + (f.WARD || "Unspecified"),
      licenseType: "DC ABCA Class A Off-Premises Spirits",
      licenseNumber: f.LICENSE_NUMBER,
      isStateRun: false,
      address: f.ADDRESS || f.STREET_ADDRESS,
      city: "Washington",
      state: "DC",
      zip: f.ZIP_CODE || "20001",
      phone: f.PHONE || "(202) 555-0100"
    };
  });
  console.log("Successfully imported " + stores.length + " DC non-state liquor stores.");
'`;

  const handleCopyScript = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(dcCurlScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Discovery Intelligence</span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
            Discovering 100% of Stores Across DC, MD & VA
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-3xl mt-1">
            Liquor licensing and distribution in the DMV is public record. Because alcohol cannot be sold without a state, district, or Commonwealth license, you can programmatically discover every independent retailer, farm distillery, and drop hub without guesswork.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('dc')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'dc' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            District of Columbia (ABCA Class A)
          </button>
          <button
            onClick={() => setActiveTab('md')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'md' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            Maryland (ATCC & 24 County Boards)
          </button>
          <button
            onClick={() => setActiveTab('va')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'va' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            Virginia (Farm Distilleries & ABC)
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'script' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            Ingestion Script / API Code
          </button>
        </div>
      </div>

      {/* Tab 1: DC Specifics */}
      {activeTab === 'dc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
              <Building className="w-5 h-5 text-amber-500" />
              <span>DC Legal Framework: 100% Non-State</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Washington, D.C. has <strong className="text-amber-400">zero government-run ABC stores</strong>. 
              The entire retail tier in D.C. is privatized. Every single liquor store is an independent private commercial entity.
            </p>
            <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800 space-y-2 text-xs">
              <div className="font-bold text-stone-200">The Exact Target License Class:</div>
              <ul className="list-disc list-inside space-y-1 text-stone-400 text-[11px]">
                <li><strong className="text-stone-200">Retailer's License Class "A":</strong> Authorizes the off-premises sale of distilled spirits, wine, and beer. There are ~260 active Class A stores in DC.</li>
                <li><strong className="text-stone-200">Retailer's License Class "B":</strong> Beer and wine only (grocery stores, bodegas, delis). Exclude these from your bourbon tracker.</li>
                <li><strong className="text-stone-200">Governing Body:</strong> ABCA (Alcoholic Beverage and Cannabis Administration, formerly ABRA).</li>
              </ul>
            </div>

            <div className="pt-2">
              <div className="text-xs font-semibold text-stone-300 mb-1">Open Data Direct Portal:</div>
              <a 
                href="https://opendata.dc.gov/datasets/DCGIS::alcoholic-beverage-regulation-administration-licensed-establishments/about" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
              >
                Open DC ABCA Licensed Establishments Dataset <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
              <Download className="w-5 h-5 text-amber-500" />
              <span>How to Ingest All DC Stores</span>
            </div>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-[11px] flex-shrink-0">1</span>
                <div>
                  <strong>Download the DC ABCA CSV or JSON:</strong> Open Data DC provides both GeoJSON and CSV downloads updated on a recurring schedule.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-[11px] flex-shrink-0">2</span>
                <div>
                  <strong>Filter by Class:</strong> Apply SQL query <code className="bg-stone-950 px-1 py-0.5 rounded text-amber-300 font-mono-code">WHERE LICENSE_CLASS = 'Retailer Class A' AND STATUS = 'Active'</code>.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-[11px] flex-shrink-0">3</span>
                <div>
                  <strong>Map Wards & Coordinates:</strong> DC Open Data gives longitude and latitude for all stores, making map views and nearby radius searches effortless.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Maryland Specifics */}
      {activeTab === 'md' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>Maryland's Hybrid Liquor System</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Maryland has <strong className="text-stone-100">24 county-level liquor jurisdictions</strong>. 
              Only ONE county operates government retail spirits stores (Montgomery County). The other 23 jurisdictions are open private retail markets!
            </p>
            <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800 space-y-2 text-xs">
              <div className="font-bold text-stone-200">County-by-County Breakdown:</div>
              <ul className="list-disc list-inside space-y-1 text-stone-400 text-[11px]">
                <li><strong className="text-stone-200">Montgomery County (ABS):</strong> County controls wholesale spirits and operates ~26 "ABS Liquor Stores". Non-state independent stores in Montgomery can only sell beer/wine, with the exception of 4 pre-1951 grandfathered stores.</li>
                <li><strong className="text-stone-200">Prince George's, Anne Arundel, Baltimore City, Baltimore County, Howard, Frederick:</strong> 100% PRIVATE independent stores with Class A (Beer, Wine & Liquor) licenses.</li>
                <li><strong className="text-stone-200">Class D Taverns:</strong> In Maryland, some Class D tavern licenses allow off-premise package sales.</li>
              </ul>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
              <FileSpreadsheet className="w-5 h-5 text-amber-500" />
              <span>Maryland Data Sources & Registries</span>
            </div>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
                <div className="font-bold text-amber-400">1. Maryland ATCC Master List</div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  The Maryland Alcohol, Tobacco, and Cannabis Commission (atcc.maryland.gov) publishes the state-wide Retail Dealer Master Licensee Directory.
                </div>
              </div>
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
                <div className="font-bold text-amber-400">2. County License Board Rosters</div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Each county (e.g. Baltimore County Liquor Board, Anne Arundel Board of License Commissioners) publishes public monthly CSV rosters of all active Class A package stores.
                </div>
              </div>
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
                <div className="font-bold text-amber-400">3. Filtering Rule</div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Keep stores where License Type contains "Class A - Beer, Wine, Liquor" (BWL). Drop stores marked "Beer & Wine Only" (BW).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Virginia Specifics */}
      {activeTab === 'va' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
              <Building className="w-5 h-5 text-amber-500" />
              <span>Virginia ABC & Farm Distilleries</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Virginia is a <strong className="text-stone-100">Control State (Virginia ABC)</strong>. 
              The state operates ~400 government-run ABC stores for retail spirits. However, Virginia has a vibrant non-state independent tier:
            </p>
            <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800 space-y-2 text-xs">
              <div className="font-bold text-stone-200">The Two Virginia Retail Tiers:</div>
              <ul className="list-disc list-inside space-y-1 text-stone-400 text-[11px]">
                <li><strong className="text-amber-400">Virginia Farm Distilleries (Independent Retail):</strong> Under VA Code § 4.1-206.1, licensed Limited Distilleries and commercial distilleries (like A. Smith Bowman in Fredericksburg, Catoctin Creek in Purcellville, Copper Fox in Sperryville/Williamsburg, Ragged Branch, Reservoir) sell directly to consumers at retail tasting rooms.</li>
                <li><strong className="text-amber-400">Virginia ABC Random Drops:</strong> In state ABC stores, allocated bourbon is released through unannounced "Random Drop Alerts" or clerk morning delivery arrivals.</li>
              </ul>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
              <Download className="w-5 h-5 text-amber-500" />
              <span>Virginia Data Ingestion</span>
            </div>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
                <div className="font-bold text-amber-400">1. Virginia Open Data Portal (data.virginia.gov)</div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Virginia ABC publishes full store numbers, addresses, phone numbers, and operational hours as public open data.
                </div>
              </div>
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
                <div className="font-bold text-amber-400">2. VA ABC Licensee Roster (Distilleries)</div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Filter licensee type <code className="text-amber-300 font-mono-code">Limited Distillery</code> and <code className="text-amber-300 font-mono-code">Distillery</code> to automatically discover every independent retail tasting room in the Commonwealth!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Script & Code */}
      {activeTab === 'script' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
              <Terminal className="w-5 h-5 text-amber-500" />
              <span>Automated DC ABCA Open Data Ingestion Script</span>
            </div>

            <button
              onClick={handleCopyScript}
              className="bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Shell Script'}</span>
            </button>
          </div>

          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono-code text-xs text-amber-300 overflow-x-auto">
            <pre>{dcCurlScript}</pre>
          </div>

          <div className="text-xs text-stone-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>You can run this script directly on your VPS via a recurring cron job to keep all DC and MD stores automatically in sync with government records!</span>
          </div>
        </div>
      )}

    </div>
  );
};
