import { DropTip, Store, BottleInfo, Channel } from '../types';

export interface NotificationPayload {
  toPhone?: string;
  toEmail?: string;
  channel: Channel;
  bottle: BottleInfo;
  tip: DropTip;
  store: Store;
  messageText: string;
  subjectLine?: string;
}

export class NotificationService {
  /**
   * Format SMS message for allocated drop alerts (under 160 chars for 1 SMS segment)
   */
  static formatSmsAlert(tip: DropTip, bottle: BottleInfo, store: Store): string {
    const markup = tip.priceSeen <= tip.msrp 
      ? 'MSRP' 
      : `$${tip.priceSeen} (+$${tip.priceSeen - tip.msrp})`;

    return `🚨 BOURBON ALLIANCE: ${bottle.name} spotted at ${store.name} (${store.countyOrWard})! Price: ${markup}. Loc: ${tip.bottleLocation}. Track: https://bourbonalliance.net`;
  }

  /**
   * Format Email Morning Digest or Alert
   */
  static formatEmailAlert(tip: DropTip, bottle: BottleInfo, store: Store) {
    const subject = `[Bourbon Alliance Drop] ${bottle.name} spotted at ${store.name}`;
    const html = `
      <div style="font-family: sans-serif; background: #0c0a09; color: #f5f5f4; padding: 24px; border-radius: 12px;">
        <h2 style="color: #d97706; margin-top: 0;">Bourbon Alliance Drop Alert</h2>
        <p>A sought-after allocated bottle on your watchlist has been verified in the DMV radar:</p>
        
        <div style="background: #1c1917; border: 1px solid #292524; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0; color: #fafaf9;">${bottle.name} (${bottle.proof})</h3>
          <p style="margin: 4px 0; color: #a8a29e;"><strong>Store:</strong> ${store.name} (${store.address}, ${store.city})</p>
          <p style="margin: 4px 0; color: #a8a29e;"><strong>Price Spotted:</strong> <span style="color: #34d399; font-weight: bold;">$${tip.priceSeen}</span> (MSRP: $${tip.msrp} · Ceiling: $${tip.ceilingPrice})</p>
          <p style="margin: 4px 0; color: #a8a29e;"><strong>Placement in Store:</strong> ${tip.bottleLocation} (${tip.quantityEstimate})</p>
          <p style="margin: 4px 0; color: #a8a29e;"><strong>Notes:</strong> <em>"${tip.notes}"</em></p>
          <p style="margin: 4px 0; color: #78716c; font-size: 12px;">Reported by ${tip.tipsterAlias} · Ref: ${tip.tipCode}</p>
        </div>

        <p><a href="https://bourbonalliance.net" style="background: #d97706; color: #0c0a09; font-weight: bold; padding: 10px 18px; text-decoration: none; border-radius: 6px; display: inline-block;">View Live Drop Radar</a></p>
      </div>
    `;

    return { subject, html };
  }
}
