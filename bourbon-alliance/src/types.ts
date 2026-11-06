export type Jurisdiction = 'DC' | 'MD' | 'VA';

export type StoreKind = 'private' | 'abs' | 'abc' | 'farm_distillery';

export type StoreTier = 
  | 'Allocated Partner' 
  | 'Boutique Specialist' 
  | 'High Volume Standard' 
  | 'Hidden Gem' 
  | 'Mom & Pop' 
  | 'Farm Distillery / Artisan Producer'
  | 'State ABC Store (Controlled Drop Point)'
  | 'County ABS Store (MoCo Controlled)';

export type PricingReputation = 
  | 'MSRP Loyal' 
  | 'Slight Markup (+10-25%)' 
  | 'Secondary / Museum' 
  | 'Mixed / Dynamic' 
  | 'State Mandated MSRP';

export interface Store {
  id: string;
  name: string;
  jurisdiction: Jurisdiction;
  countyOrWard: string; // e.g. "DC Ward 2 (Georgetown)", "Montgomery County (MoCo ABS)", "Fairfax County", etc.
  kind: StoreKind;
  number?: string; // Store number for ABC / ABS
  licenseType: string;
  licenseNumber: string;
  isStateRun: boolean; // false for DC/MD independent & VA Farm Distilleries, true for VA ABC & MoCo ABS
  address: string;
  city: string;
  state: 'DC' | 'MD' | 'VA';
  zip: string;
  phone?: string;
  website?: string;
  delivery?: string; // e.g. "Tue", "Thu"
  hours: string;
  rating: number;
  tier: StoreTier;
  pricingReputation: PricingReputation;
  knownFor: string;
  allocationMethod: 'First-Come Shelf' | 'Behind Counter (Ask)' | 'Store Raffle' | 'Loyalty Points' | 'Surprise Drop' | 'VA ABC Random Drop Alert';
  verifiedAtccAbca: boolean;
  activeSightings: number;
  lat: number;
  lng: number;
  placeId?: string;
  hasWebsite?: boolean;
}

export type TipsterRole = 
  | 'anonymous_clerk' 
  | 'anonymous_driver' 
  | 'anonymous_hunter' 
  | 'verified_member'
  | 'va_abc'
  | 'moco';

export type BottleLocation = 
  | 'Behind Counter (Ask)' 
  | 'On Shelf' 
  | 'In Glass Case' 
  | 'Store Raffle / Lottery' 
  | 'Bundle Deal Required' 
  | 'Unloading from Truck';

export interface DropTip {
  id: string;
  tipCode: string; // e.g. "BA-7391X"
  storeId: string;
  storeName: string;
  jurisdiction: Jurisdiction;
  countyOrWard: string;
  address: string;
  bottleId?: string;
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
  createdAt: string;
  minutesAgo: number;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  isSoldOut: boolean;
  isVerified: boolean;
}

export type DemandTier = 
  | 'unicorn' 
  | 'limited' 
  | 'shelf' 
  | 'Unicorn' 
  | 'Highly Allocated' 
  | 'Allocated Seasonal' 
  | 'Huntable Standard';
export type Priority = 'unicorn' | 'want' | 'curious';
export type Channel = 'sms' | 'email' | 'digest' | 'board' | 'drop';

export interface BottleInfo {
  id: string;
  name: string;
  distillery: string;
  proof: string;
  msrp: number;
  fairCeiling: number;
  secondaryAvg: number;
  category: 'Bourbon' | 'Rye' | 'Wheated' | 'Single Barrel' | 'Cask Strength';
  demandTier: DemandTier;
  description: string;
}

export interface AlertPrefs {
  regions: Jurisdiction[];
  sms: boolean;
  email: boolean;
  phoneNumber?: string;
  notificationEmail?: string;
  smsDailyCap: number;
  quietStart: number; // e.g. 22 (10pm)
  quietEnd: number;   // e.g. 8 (8am)
  cooldownHours: number;
  corroborationForSms: boolean;
  freshWindowMin: number;
  twilioSid?: string;
  twilioToken?: string;
  twilioFromNumber?: string;
  webhookUrl?: string;
}

export interface AlertDecision {
  channel: Channel;
  reason: string;
}

export interface PlannedAlert {
  tip: DropTip;
  bottle: BottleInfo;
  store: Store;
  decision: AlertDecision;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  type: 'sms' | 'email';
  recipient: string;
  title: string;
  message: string;
  status: 'delivered' | 'simulated' | 'failed' | 'quiet_hours_blocked';
}

export interface UserSession {
  isSignedIn: boolean;
  email?: string;
  name?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  notificationEmail?: string;
  isStoreWorker?: boolean;
  anonymousByDefault: boolean;
  role: 'member' | 'verified_clerk' | 'whiskey_hunter';
  reputationScore: number;
  savedStoreIds: string[];
  savedBottleIds: string[];
  watchPriorities: Record<string, Priority>;
  alertPrefs: AlertPrefs;
}
