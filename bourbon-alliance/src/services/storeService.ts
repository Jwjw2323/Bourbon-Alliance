import { Store, Jurisdiction, PricingReputation } from '../types';

export interface StoreFilterOptions {
  jurisdiction?: 'ALL' | Jurisdiction;
  pricingReputation?: 'ALL' | PricingReputation;
  countyOrWard?: string;
  searchQuery?: string;
  nonStateOnly?: boolean;
}

export class StoreService {
  /**
   * Filter stores based on modular criteria
   */
  static filterStores(stores: Store[], options: StoreFilterOptions): Store[] {
    return stores.filter(store => {
      if (options.jurisdiction && options.jurisdiction !== 'ALL' && store.jurisdiction !== options.jurisdiction) {
        return false;
      }

      if (options.pricingReputation && options.pricingReputation !== 'ALL' && store.pricingReputation !== options.pricingReputation) {
        return false;
      }

      if (options.countyOrWard && options.countyOrWard !== 'ALL' && store.countyOrWard !== options.countyOrWard) {
        return false;
      }

      if (options.nonStateOnly && store.isStateRun) {
        return false;
      }

      if (options.searchQuery && options.searchQuery.trim()) {
        const query = options.searchQuery.toLowerCase();
        const matchesName = store.name.toLowerCase().includes(query);
        const matchesAddress = store.address.toLowerCase().includes(query);
        const matchesLicense = store.licenseNumber.toLowerCase().includes(query);
        const matchesCity = store.city.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesLicense && !matchesCity) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Group stores by jurisdiction (DC, MD, VA)
   */
  static groupByJurisdiction(stores: Store[]): Record<Jurisdiction, Store[]> {
    return {
      DC: stores.filter(s => s.jurisdiction === 'DC'),
      MD: stores.filter(s => s.jurisdiction === 'MD'),
      VA: stores.filter(s => s.jurisdiction === 'VA')
    };
  }

  /**
   * Extract unique sorted counties/wards across active stores
   */
  static getCountiesByJurisdiction(stores: Store[], jurisdiction?: Jurisdiction): string[] {
    const targetStores = jurisdiction ? stores.filter(s => s.jurisdiction === jurisdiction) : stores;
    return Array.from(new Set(targetStores.map(s => s.countyOrWard))).sort();
  }
}
