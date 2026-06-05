import { randomFromArray } from './utils';

/** Minimal shape we need from a relay socket (real: Bun ServerWebSocket). */
export interface RelaySocket {
  send(data: string): void;
}

interface Entry {
  lastPongAt: number;
}

export class RelayRegistry<T extends RelaySocket = RelaySocket> {
  private entries = new Map<T, Entry>();

  add(ws: T, now: number): void {
    this.entries.set(ws, { lastPongAt: now });
  }

  remove(ws: T): void {
    this.entries.delete(ws);
  }

  markPong(ws: T, now: number): void {
    const entry = this.entries.get(ws);
    if (entry) entry.lastPongAt = now;
  }

  count(): number {
    return this.entries.size;
  }

  all(): T[] {
    return [...this.entries.keys()];
  }

  pickRandom(): T | undefined {
    const all = this.all();
    return all.length ? randomFromArray(all) : undefined;
  }

  /**
   * Returns relays that have not ponged within two intervals (the grace
   * window). Caller is responsible for terminating + removing them.
   */
  sweep(now: number, intervalMs: number): T[] {
    const grace = intervalMs * 2;
    return this.all().filter((ws) => {
      const entry = this.entries.get(ws);
      return !!entry && now - entry.lastPongAt > grace;
    });
  }
}
