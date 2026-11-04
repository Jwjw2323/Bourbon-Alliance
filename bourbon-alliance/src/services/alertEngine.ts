import { DropTip, Store, BottleInfo, AlertPrefs, Priority, AlertDecision, PlannedAlert, Channel } from '../types';

export const PREVIEW_HOUR = 8; // 8:00 AM scored preview
export const DEFAULT_ALERT_PREFS: AlertPrefs = {
  regions: ['DC', 'MD', 'VA'],
  sms: true,
  email: true,
  quietStart: 22, // 10 PM
  quietEnd: 8,    // 8 AM
  cooldownHours: 4,
  smsDailyCap: 3,
  corroborationForSms: true,
  freshWindowMin: 90
};

export class AlertEngine {
  /**
   * Check if the current time falls inside quiet hours
   */
  static isQuiet(hour: number, start: number, end: number): boolean {
    if (start === end) return false;
    if (start < end) return hour >= start && hour < end;
    return hour >= start || hour < end;
  }

  /**
   * Evaluate a single sighting against a hunter's priority and alert preferences
   */
  static decideOne(args: {
    tip: DropTip;
    bottle: BottleInfo;
    store: Store;
    prefs: AlertPrefs;
    priority: Priority | undefined;
    hour: number;
  }): AlertDecision {
    const { tip, bottle, store, prefs, priority, hour } = args;

    if (!priority) {
      return { channel: 'drop', reason: 'Not on your personal watchlist' };
    }

    if (!prefs.regions.includes(store.jurisdiction)) {
      return { channel: 'drop', reason: `Outside your active hunting regions (${store.jurisdiction})` };
    }

    if (tip.isSoldOut) {
      return { channel: 'drop', reason: 'Marked sold out / gone by community' };
    }

    if (priority === 'curious') {
      return { channel: 'board', reason: 'Curious priority stays on board — no alert ping' };
    }

    const isFresh = tip.minutesAgo <= prefs.freshWindowMin;
    const inQuietHours = this.isQuiet(hour, prefs.quietStart, prefs.quietEnd);
    const isCorroborated = tip.upvotes >= 2 || tip.isVerified || tip.tipsterRole === 'anonymous_clerk';

    if (!isFresh && bottle.demandTier !== 'shelf') {
      if (prefs.email) {
        return {
          channel: 'digest',
          reason: `Older than ${prefs.freshWindowMin}m — included in morning note, not an instant ping`
        };
      }
      return { channel: 'drop', reason: `Older than ${prefs.freshWindowMin}m window` };
    }

    if (priority === 'want') {
      if (!prefs.email) {
        return { channel: 'board', reason: 'Want list with email off — board display only' };
      }
      return { channel: 'digest', reason: 'Want list rides the morning email digest' };
    }

    // Unicorn tier logic:
    if (prefs.corroborationForSms && !isCorroborated) {
      if (prefs.email) {
        return { channel: 'email', reason: 'Unverified single scout — sent via email, not SMS' };
      }
      return { channel: 'board', reason: 'Waiting on a 2nd hunter or clerk verification before SMS' };
    }

    if (!prefs.sms && prefs.email) {
      return inQuietHours
        ? { channel: 'digest', reason: 'Quiet hours active — held for morning note' }
        : { channel: 'email', reason: 'SMS alerts turned off — routed to email' };
    }

    if (!prefs.sms && !prefs.email) {
      return { channel: 'board', reason: 'Push & email alerts disabled — board only' };
    }

    if (inQuietHours) {
      return { channel: 'digest', reason: 'Quiet hours active — SMS held until morning' };
    }

    if (tip.tipsterRole === 'anonymous_clerk' || tip.isVerified) {
      return { channel: 'sms', reason: 'Fresh verified drop on your Unicorn watchlist!' };
    }

    return { channel: 'sms', reason: 'Fresh drop backed by community hunters on your Unicorn watchlist!' };
  }

  /**
   * Plan alerts across all sightings, applying cooldowns and daily SMS caps
   */
  static planAlerts(args: {
    tips: DropTip[];
    stores: Store[];
    bottles: BottleInfo[];
    prefs: AlertPrefs;
    watch: Record<string, Priority>;
    hour: number;
  }): PlannedAlert[] {
    const storesById = new Map(args.stores.map(s => [s.id, s]));
    const bottlesByName = new Map(args.bottles.map(b => [b.name.toLowerCase(), b]));

    const sorted = [...args.tips].sort((a, b) => a.minutesAgo - b.minutesAgo);
    const planned: PlannedAlert[] = [];
    const alertedPair = new Map<string, number>();
    let smsCount = 0;

    for (const tip of sorted) {
      const store = storesById.get(tip.storeId) || args.stores.find(s => s.name === tip.storeName);
      // match bottle by name or default
      let bottle = args.bottles.find(b => b.id === tip.bottleId) || 
        bottlesByName.get(tip.bottleName.toLowerCase()) || 
        args.bottles.find(b => tip.bottleName.toLowerCase().includes(b.name.toLowerCase())) ||
        args.bottles[0];

      if (!store || !bottle) continue;

      const priority = args.watch[bottle.id];
      let decision = this.decideOne({
        tip,
        bottle,
        store,
        prefs: args.prefs,
        priority,
        hour: args.hour
      });

      const pairKey = `${store.id}:${bottle.id}`;
      const isNoisy = decision.channel === 'sms' || decision.channel === 'email' || decision.channel === 'digest';

      if (isNoisy) {
        const prevAge = alertedPair.get(pairKey);
        if (prevAge != null && Math.abs(tip.minutesAgo - prevAge) / 60 < args.prefs.cooldownHours) {
          decision = { channel: 'drop', reason: 'Same bottle at same store inside cooldown window' };
        } else {
          alertedPair.set(pairKey, tip.minutesAgo);
        }
      }

      if (decision.channel === 'sms') {
        smsCount += 1;
        if (smsCount > args.prefs.smsDailyCap) {
          decision = {
            channel: 'digest',
            reason: `Daily SMS cap reached (${args.prefs.smsDailyCap}) — rolled into morning digest`
          };
        }
      }

      planned.push({ tip, bottle, store, decision });
    }

    return planned;
  }
}
