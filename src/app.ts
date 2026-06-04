import { App } from '@slack/bolt';
import { attachResponses } from './responses';
import Sonos from './sonos';

const sonos = new Sonos();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

attachResponses(app, sonos);

(async () => {
  await app.start();
  const relay = sonos.initialize(app);
  console.log(
    `⚡️ Bolt app running (Socket Mode); relay server on ${relay.port}!`
  );
})();
