import { App, SayFn } from '@slack/bolt';
import type { ServerWebSocket, Server } from 'bun';
import { getHelpText } from './responses';
import { RelayRegistry } from './relay-registry';
import { isValidRelayToken } from './relay-auth';

interface PlayUrl {
  type: 'play_url';
  url: string;
}
interface PlayText {
  type: 'play_text';
  text: string;
  volume: number;
}
interface CloseCmd {
  type: 'close';
}
export type RelayCommand = PlayUrl | PlayText | CloseCmd;

const HEARTBEAT_MS = 30_000;
const IDLE_TIMEOUT_S = 120;

interface RelayData {
  authedAt: number;
}

export interface RelayServer {
  port: number;
  relayCount(): number;
  /** test seam: push a command to a random relay */
  broadcastTest(cmd: RelayCommand): void;
  stop(): void;
}

export interface StartOptions {
  port: number;
  token: string | undefined;
}

export default class Sonos {
  private registry = new RelayRegistry<ServerWebSocket<RelayData>>();
  private server?: Server;
  private heartbeat?: ReturnType<typeof setInterval>;
  private token: string | undefined;

  initialize(app: App): RelayServer {
    this.token = process.env.RELAY_TOKEN;
    const port = Number(process.env.PORT) || 3000;
    const handle = this.startServer({ port, token: this.token });
    this.registerSlackHandlers(app);
    return handle;
  }

  startServer(opts: StartOptions): RelayServer {
    this.token = opts.token;
    const registry = this.registry;
    const token = this.token;

    this.server = Bun.serve<RelayData, undefined>({
      port: opts.port,
      fetch(req, server) {
        // Non-WebSocket requests are Azure's health/warmup probes.
        if (req.headers.get('upgrade')?.toLowerCase() !== 'websocket') {
          return new Response('OK');
        }
        const offered = req.headers.get('sec-websocket-protocol');
        if (!isValidRelayToken(offered, token)) {
          return new Response('Unauthorized', { status: 401 });
        }
        const matched = (offered ?? '').split(',')[0].trim();
        const ok = server.upgrade(req, {
          data: { authedAt: Date.now() },
          // Echo the selected subprotocol back per the WS spec.
          headers: { 'Sec-WebSocket-Protocol': matched },
        });
        return ok ? undefined : new Response('Upgrade failed', { status: 500 });
      },
      websocket: {
        idleTimeout: IDLE_TIMEOUT_S,
        sendPings: false, // we ping explicitly in the heartbeat
        open: (ws) => {
          registry.add(ws, Date.now());
          this.logClientStats('New relay connected to Sonos!');
        },
        message: (_ws, message) => {
          console.log(
            'Ignoring unexpected relay message:',
            String(message).slice(0, 200)
          );
        },
        pong: (ws) => registry.markPong(ws, Date.now()),
        close: (ws) => {
          registry.remove(ws);
          this.logClientStats('Relay disconnected from Sonos.');
        },
      },
    });

    this.heartbeat = setInterval(() => this.runHeartbeat(), HEARTBEAT_MS);

    return {
      port: this.server.port,
      relayCount: () => registry.count(),
      broadcastTest: (cmd) => this.sendToRandom(cmd),
      stop: () => this.stop(),
    };
  }

  private runHeartbeat(): void {
    const now = Date.now();
    for (const ws of this.registry.sweep(now, HEARTBEAT_MS)) {
      try {
        ws.terminate();
      } catch {
        /* already gone */
      }
      this.registry.remove(ws);
    }
    for (const ws of this.registry.all()) {
      try {
        ws.ping();
      } catch {
        /* will be swept next round */
      }
    }
  }

  stop(): void {
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.heartbeat = undefined;
    this.server?.stop(true);
    this.server = undefined;
  }

  private registerSlackHandlers(app: App): void {
    app.message(/sonos (.+)/, async ({ context, say }) => {
      // matches[1] = the captured URL (matches[0] would include the "sonos " prefix)
      this.playOnSonos(context.matches[1], say);
    });
    app.message(/health/, async ({ say }) => {
      const count = this.clientCount();
      if (count > 0) {
        say(`I'm cool, I've got ${count} Sonos relay(s) connected.`);
      } else {
        Sonos.alertNoClients(say);
      }
    });
    app.message(/help/, async ({ say }) => {
      say(getHelpText());
    });
    app.message(/say (.+)/, async ({ context, say }) => {
      this.textToSpeech(context.matches[1], say);
    });
    app.message(/^Reminder: announcement (.+)/, async ({ context, say }) => {
      this.textToSpeech(context.matches[1], say);
    });
  }

  playOnSonos(url: string, say: SayFn): void {
    if (this.clientCount() < 1) {
      Sonos.alertNoClients(say);
    } else {
      this.sendToRandom({ type: 'play_url', url });
    }
  }

  textToSpeech(text: string, say: SayFn): void {
    if (this.clientCount() < 1) {
      Sonos.alertNoClients(say);
    } else {
      this.sendToRandom({ type: 'play_text', text, volume: 60 });
    }
  }

  private sendToRandom(cmd: RelayCommand): void {
    const ws = this.registry.pickRandom();
    if (!ws) {
      console.error('No relay available to receive command', cmd.type);
      return;
    }
    ws.send(JSON.stringify(cmd));
  }

  private clientCount(): number {
    return this.registry.count();
  }

  private logClientStats(message: string): void {
    console.log(message);
    console.log(
      `${this.clientCount()} Sonos relay clients currently connected.`
    );
  }

  private static alertNoClients(say: SayFn) {
    const RELAY_CLIENT_DOWNLOAD_URL =
      'https://github.com/clearfunction/sonos_proxy_nodejs';
    say(
      `Sorry, I don't have any Sonos relay clients connected right now. You can download one here... ${RELAY_CLIENT_DOWNLOAD_URL}`
    );
    setTimeout(() => {
      say('... Burn! :fire: http://i.imgur.com/4lhFLpO.gif');
    }, 3 * 1000);
  }
}

export function startRelayServer(opts: StartOptions): RelayServer {
  return new Sonos().startServer(opts);
}
