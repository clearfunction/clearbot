import { App } from '@slack/bolt';
import { Response } from './types';
import { randomFromArray as randomResponse } from './utils';
import Sonos from './sonos';

const burns = ['sick-burn.mp3', 'thats-gotta-hurt.mp3'];

const burnReponses: Response[] = [
  {
    listen: /burn/,
    play: () => randomResponse(burns),
    message: ':fire: Burn! :fire:',
  },
  {
    listen: /!sickburn|:fire:/i,
    play: () => randomResponse(burns),
  },
  { listen: /yakety/, play: 'yakkety.mp3' },
  { listen: /fight/, play: 'sf2-guile-theme.mp3' },
  { listen: /rick roll|rickroll/, play: 'rick-roll.m4a' },
  { listen: /boom/, play: 'bomb.mp3' },
  { listen: /rekt/, play: 'air-horns.mp3' },
  { listen: /brutal/, play: 'brutal-savage-rekt.mp3' },
  { listen: /:?it\s?depends:?/i, play: 'it-depends.mp3' },
  { listen: /chewie/i, play: 'chewbacca.mp3' },
  {
    listen: /:dollar:/i,
    play: 'cash-register.mp3',
    message: '💵 Chaching! 💵',
  },
  { listen: /:bell:|:bellhop_bell:/i, play: 'desk-bell.mp3' },
  { listen: /\bham\b/i, play: 'ham.mp3', message: ':piggy:\nhambutton.com' },
  { listen: /\bsad\b|trombone/i, play: 'sad-trombone.mp3' },
  { listen: /cookie/i, play: 'is-it-cookie.mp3' },
  { listen: /shoryuken/i, play: 'sf2-ken-theme.mp3' },
];

export default function attachResponses(app: App, sonos: Sonos) {
  burnReponses.forEach(resp => {
    app.message(resp.listen, async ({ say }) => {
      if (resp.message) {
        say(resp.message);
      }

      if (typeof resp.play === 'function') {
        sonos.playOnSonos(resp.play(), say);
      } else if (typeof resp.play === 'string') {
        sonos.playOnSonos(resp.play, say);
      }
    });
  });
}