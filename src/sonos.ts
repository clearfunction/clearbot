import { App, SayFn } from '@slack/bolt';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { getHelpText } from './responses';
import { randomFromArray } from './utils';

interface PlayUrl {
  url: string;
}

interface PlayText {
  text: string;
  volume: number;
}

interface ServerToClientEvents {
  play_url: (data: PlayUrl) => void;
  play_text: (data: PlayText) => void;
  close: () => void;
}

interface ClientToServerEvents {}

export default class Sonos {
  sockets: Socket<ClientToServerEvents, ServerToClientEvents>[] = [];

  initialize(server: HttpServer, app: App): void {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

    io.on(
      'connection',
      (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
        this.onConnection(socket);
      }
    );

    io.listen(server);

    app.message(/sonos (.+)/, async ({ context, say }) => {
      const match = context.matches[0];
      this.playOnSonos(match, say);
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
      this.getSocket().emit('play_url', { url });
    }
  }

  textToSpeech(text: string, say: SayFn): void {
    if (this.clientCount() < 1) {
      Sonos.alertNoClients(say);
    } else {
      this.getSocket().emit('play_text', { text, volume: 60 });
    }
  }

  private getSocket(): Socket<ClientToServerEvents, ServerToClientEvents> {
    console.log('Sonosing a message to a random client...');
    let socket = null;
    try {
      socket = randomFromArray(this.sockets);
    } catch (error) {
      console.error(error);
      [socket] = this.sockets;
    }
    return socket;
  }

  private clientCount(): number {
    return this.sockets.length;
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

  private onConnection(
    socket: Socket<ClientToServerEvents, ServerToClientEvents>
  ): void {
    this.sockets.unshift(socket);
    this.logClientStats('New clients connected to Sonos relay!');

    socket.on('disconnect', () => {
      this.sockets = this.sockets.filter((x) => x !== socket);
      this.logClientStats('Client disconnected from Sonos relay.');
    });
  }
}
