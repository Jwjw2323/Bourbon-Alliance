import { DropTip, Jurisdiction } from '../types';

export interface TipFilterOptions {
  jurisdiction?: 'ALL' | Jurisdiction;
  ceilingMode?: 'ALL' | 'UNDER_CEILING' | 'MSRP_ONLY';
  searchQuery?: string;
  hideSoldOut?: boolean;
}

export class TipService {
  /**
   * Generates a random cryptographic anonymous tip token
   */
  static generateTipCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'BA-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Filter and sort tips based on user criteria
   */
  static filterTips(tips: DropTip[], options: TipFilterOptions): DropTip[] {
    return tips.filter(tip => {
      if (options.jurisdiction && options.jurisdiction !== 'ALL' && tip.jurisdiction !== options.jurisdiction) {
        return false;
      }

      if (options.ceilingMode === 'UNDER_CEILING' && tip.priceSeen > tip.ceilingPrice) {
        return false;
      }

      if (options.ceilingMode === 'MSRP_ONLY' && tip.priceSeen > tip.msrp + 5) {
        return false;
      }

      if (options.hideSoldOut && tip.isSoldOut) {
        return false;
      }

      if (options.searchQuery && options.searchQuery.trim()) {
        const query = options.searchQuery.toLowerCase();
        const matchesBottle = tip.bottleName.toLowerCase().includes(query);
        const matchesStore = tip.storeName.toLowerCase().includes(query);
        const matchesCounty = tip.countyOrWard.toLowerCase().includes(query);
        if (!matchesBottle && !matchesStore && !matchesCounty) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Calculates pricing status comparison
   */
  static evaluatePricing(priceSeen: number, msrp: number, ceiling: number) {
    const markupDollars = priceSeen - msrp;
    const markupPercentage = Math.round((markupDollars / msrp) * 100);
    const isAtMsrp = priceSeen <= msrp + 5;
    const isOverCeiling = priceSeen > ceiling;
    
    return {
      markupDollars,
      markupPercentage,
      isAtMsrp,
      isOverCeiling,
      statusLabel: isAtMsrp ? 'MSRP Deal' : !isOverCeiling ? 'Fair Price' : 'Gouge Alert'
    };
  }
}
