import { App } from '@slack/bolt';
import dotenv from 'dotenv';
import attachResponses from './responses';
import Sonos from './sonos';

dotenv.config();

const sonos = new Sonos();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

attachResponses(app, sonos);

(async () => {
  const server = await app.start(process.env.PORT || 3000);
  sonos.initialize(server, app);

  console.log('⚡️ Bolt app is running!');
})();
