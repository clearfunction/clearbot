import { App } from '@slack/bolt';
import dotenv from 'dotenv';
import { attachResponses } from './responses';
import Sonos from './sonos';

dotenv.config();

const sonos = new Sonos();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

attachResponses(app, sonos);

(async () => {
  const port = Number(process.env.PORT) || 3000;
  const server = await app.start(port);
  sonos.initialize(server, app);

  console.log(`⚡️ Bolt app is running on ${port}!`);
})();
