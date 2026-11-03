export type RegionId = "dc" | "md" | "va";

export type StoreKind = "abc" | "abs" | "private";

export type Source = "hunter" | "va_abc" | "moco";

export type Tier = "unicorn" | "limited" | "shelf";

export type Priority = "unicorn" | "want" | "curious";

export type Placement = "shelf" | "counter" | "case";

export type Channel = "sms" | "email" | "digest" | "board" | "drop";

export type Store = {
  id: string;
  region: RegionId;
  kind: StoreKind;
  name: string;
  number?: string;
  address: string;
  city: string;
  abbr: string;
  district?: string;
  delivery?: string;
  hours: string;
  phone?: string;
};

export type Bottle = {
  id: string;
  name: string;
  maker: string;
  tier: Tier;
  typical: number;
};

export type Sighting = {
  id: string;
  storeId: string;
  bottleId: string;
  qty: number;
  price: number | null;
  placement: Placement;
  source: Source;
  ageMin: number;
  seenAt?: string;
  confirms: number;
  note?: string;
  reporter: string;
};

export type AlertPrefs = {
  regions: RegionId[];
  sms: boolean;
  email: boolean;
  quietStart: number;
  quietEnd: number;
  cooldownHours: number;
  smsDailyCap: number;
  corroborationForSms: boolean;
  freshWindowMin: number;
};

export type Decision = {
  channel: Channel;
  reason: string;
};
