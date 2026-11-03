export type Jurisdiction = 'DC' | 'MD' | 'VA';

export type StoreTier = 
  | 'Allocated Partner' 
  | 'Boutique Specialist' 
  | 'High Volume Standard' 
  | 'Hidden Gem' 
  | 'Mom & Pop' 
  | 'Farm Distillery / Artisan Producer'
  | 'State ABC Store (Controlled Drop Point)';

export type PricingReputation = 'MSRP Loyal' | 'Slight Markup (+10-25%)' | 'Secondary / Museum' | 'Mixed / Dynamic' | 'State Mandated MSRP';

export interface Store {
  id: string;
  name: string;
  jurisdiction: Jurisdiction;
  countyOrWard: string; // e.g. "DC Ward 2 (Georgetown)", "Prince George's County", "Fairfax County (VA)", "Spotsylvania (Fredericksburg)"
  licenseType: string; // e.g. "DC ABCA Class A", "MD Class A", "VA Limited Distillery", "VA ABC State Store"
  licenseNumber: string;
  isStateRun: boolean; // false for DC/MD independent & VA Farm Distilleries, true for VA ABC
  address: string;
  city: string;
  state: 'DC' | 'MD' | 'VA';
  zip: string;
  phone: string;
  rating: number;
  tier: StoreTier;
  pricingReputation: PricingReputation;
  knownFor: string;
  allocationMethod: 'First-Come Shelf' | 'Behind Counter (Ask)' | 'Store Raffle' | 'Loyalty Points' | 'Surprise Drop' | 'VA ABC Random Drop Alert';
  verifiedAtccAbca: boolean;
  activeSightings: number;
  lat: number;
  lng: number;
}

export type TipsterRole = 'anonymous_clerk' | 'anonymous_driver' | 'anonymous_hunter' | 'verified_member';

export type BottleLocation = 
  | 'Behind Counter (Ask)' 
  | 'On Shelf' 
  | 'In Glass Case' 
  | 'Store Raffle / Lottery' 
  | 'Bundle Deal Required' 
  | 'Unloading from Truck';

export interface DropTip {
  id: string;
  tipCode: string; // e.g. "BA-7391X" for anonymous tracking
  storeId: string;
  storeName: string;
  jurisdiction: Jurisdiction;
  countyOrWard: string;
  address: string;
  bottleName: string;
  distillery: string;
  bottleProof?: string;
  priceSeen: number;
  msrp: number;
  ceilingPrice: number;
  tipsterRole: TipsterRole;
  tipsterAlias: string;
  bottleLocation: BottleLocation;
  quantityEstimate: string;
  notes: string;
  createdAt: string; // ISO date
  minutesAgo: number;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  isSoldOut: boolean;
  isVerified: boolean;
  photoUrl?: string;
}

export interface BottleInfo {
  id: string;
  name: string;
  distillery: string;
  proof: string;
  msrp: number;
  fairCeiling: number;
  secondaryAvg: number;
  category: 'Bourbon' | 'Rye' | 'Wheated' | 'Single Barrel' | 'Cask Strength';
  demandTier: 'Unicorn' | 'Highly Allocated' | 'Allocated Seasonal' | 'Huntable Standard';
  description: string;
}

export interface UserSession {
  isSignedIn: boolean;
  email?: string;
  name?: string;
  avatarUrl?: string;
  isStoreWorker?: boolean;
  anonymousByDefault: boolean;
  role: 'member' | 'verified_clerk' | 'whiskey_hunter';
  reputationScore: number;
  savedStoreIds: string[];
  savedBottleIds: string[];
}
