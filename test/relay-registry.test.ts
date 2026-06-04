import { expect, test } from 'vitest';
import { RelayRegistry } from '../src/relay-registry';

interface FakeWs {
  sent: string[];
  send: (s: string) => void;
}
const fakeWs = (): FakeWs => {
  const sent: string[] = [];
  return { sent, send: (s) => sent.push(s) };
};

test('add increases count, remove decreases it', () => {
  const r = new RelayRegistry();
  const a = fakeWs();
  r.add(a, 0);
  expect(r.count()).toBe(1);
  r.remove(a);
  expect(r.count()).toBe(0);
});

test('pickRandom returns a connected relay or undefined when empty', () => {
  const r = new RelayRegistry();
  expect(r.pickRandom()).toBeUndefined();
  const a = fakeWs();
  r.add(a, 0);
  expect(r.pickRandom()).toBe(a);
});

test('sweep returns relays that missed two intervals and keeps fresh ones', () => {
  const r = new RelayRegistry();
  const stale = fakeWs();
  const fresh = fakeWs();
  r.add(stale, 0); // last pong at t=0
  r.add(fresh, 0);
  r.markPong(fresh, 50_000); // fresh ponged recently

  // interval 30s; stale at t=70s has missed > 2 intervals (60s)
  const dropped = r.sweep(70_000, 30_000);
  expect(dropped).toContain(stale);
  expect(dropped).not.toContain(fresh);
});

test('sweep does not drop a relay within the grace window', () => {
  const r = new RelayRegistry();
  const ws = fakeWs();
  r.add(ws, 0);
  r.markPong(ws, 0);
  expect(r.sweep(59_000, 30_000)).toHaveLength(0); // < 60s
});
