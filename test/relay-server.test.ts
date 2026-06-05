import { expect, test, afterEach } from 'vitest';
import { startRelayServer, type RelayServer } from '../src/sonos';

const RUN = typeof Bun !== 'undefined';
const TOKEN = 'test-token';

let server: RelayServer | undefined;
afterEach(() => server?.stop());

test.skipIf(!RUN)('valid token upgrades and receives a play_url command', async () => {
  server = startRelayServer({ port: 0, token: TOKEN });
  const url = `ws://localhost:${server.port}`;

  const ws = new WebSocket(url, TOKEN); // token as subprotocol
  const opened = new Promise<void>((res) => (ws.onopen = () => res()));
  await opened;

  const got = new Promise<string>((res) => (ws.onmessage = (e) => res(String(e.data))));
  // server should now see exactly one relay
  expect(server.relayCount()).toBe(1);
  server.broadcastTest({ type: 'play_url', url: 'https://x/clip.mp3' });

  const msg = JSON.parse(await got);
  expect(msg).toEqual({ type: 'play_url', url: 'https://x/clip.mp3' });
  ws.close();
});

test.skipIf(!RUN)('rejects an upgrade with a bad token', async () => {
  server = startRelayServer({ port: 0, token: TOKEN });
  const ws = new WebSocket(`ws://localhost:${server.port}`, 'wrong-token');
  const closed = new Promise<number>((res) => {
    ws.onclose = (e) => res(e.code);
    ws.onerror = () => res(-1);
  });
  await closed; // never opens
  expect(server.relayCount()).toBe(0);
});
