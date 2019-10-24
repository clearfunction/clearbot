import { App } from '@slack/bolt';
import { Response } from './types';
import { randomFromArray as randomResponse } from './utils';
import Sonos from './sonos';

const burns = ['sick-burn.mp3', 'thats-gotta-hurt.mp3'];

const burnReponses: Response[] = [
  {
    listen: /burn/i,
    play: () => randomResponse(burns),
    message: ':fire: Burn! :fire:',
  },
  {
    listen: /!sickburn|:fire:/i,
    play: () => randomResponse(burns),
  },
  { listen: /yakety/i, play: 'yakkety.mp3' },
  { listen: /fight/i, play: 'sf2-guile-theme.mp3' },
  { listen: /rick roll|rickroll/i, play: 'rick-roll.m4a' },
  { listen: /boom/i, play: 'bomb.mp3' },
  { listen: /rekt/i, play: 'air-horns.mp3' },
  { listen: /brutal/i, play: 'brutal-savage-rekt.mp3' },
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
  { listen: /flea/i, play: 'spanish-flea.mp3' },
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
