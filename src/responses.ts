import { App } from '@slack/bolt';
import { Response } from './types';
import { randomFromArray as randomResponse } from './utils';
import Sonos from './sonos';

const burns = ['sick-burn.mp3', 'thats-gotta-hurt.mp3'];

const burnResponses: Response[] = [
  {
    keyword: 'burn',
    description: 'A random sick burn! (with emoji)',
    listen: /burn/i,
    play: () => randomResponse(burns),
    message: ':fire: Burn! :fire:',
  },
  {
    keyword: 'sickburn | fire',
    description: 'A random sick burn!',
    listen: /!sickburn|:fire:/i,
    play: () => randomResponse(burns),
  },
  {
    keyword: 'yakety',
    description: 'Yakety sax!',
    listen: /yakety/i,
    play: 'yakkety.mp3',
  },
  {
    keyword: 'fight',
    description: 'The SF2 Guile theme',
    listen: /fight/i,
    play: 'sf2-guile-theme.mp3',
  },
  {
    keyword: 'rick roll | rickroll',
    description: 'You know what this is',
    listen: /rick roll|rickroll/i,
    play: 'rick-roll.mp3',
  },
  {
    keyword: 'boom',
    description: 'An explosive sound',
    listen: /boom/i,
    play: 'bomb.mp3',
  },
  {
    keyword: 'rekt | horn',
    description: 'Air horn... you got rekt',
    listen: /rekt|\bhorn\b/i,
    play: 'air-horns.mp3',
  },
  {
    keyword: 'brutal',
    description: 'Really really brutal rekt',
    listen: /brutal/i,
    play: 'brutal-savage-rekt.mp3',
  },
  {
    keyword: 'it depends',
    description: 'The It Depends theme song',
    listen: /:?it\s?depends:?/i,
    play: 'it-depends.mp3',
  },
  {
    keyword: 'chewie',
    description: 'The Chewie yell',
    listen: /chewie/i,
    play: 'chewbacca.mp3',
  },
  {
    keyword: ':dollar:',
    description: 'Cha ching!',
    listen: /:dollar:/i,
    play: 'cash-register.mp3',
    message: '💵 Chaching! 💵',
  },
  {
    keyword: ':bell: | :bellhop_bell:',
    description: 'Ding ding!',
    listen: /:bell:|:bellhop_bell:/i,
    play: 'desk-bell.mp3',
  },
  {
    keyword: 'ham',
    description: 'HAM BUTTON',
    listen: /\bham\b/i,
    play: 'ham.mp3',
    message: ':piggy:\nhambutton.com',
  },
  {
    keyword: 'sad | trombone',
    description: 'Wha wha whaaaa',
    listen: /\bsad\b|trombone/i,
    play: 'sad-trombone.mp3',
  },
  {
    keyword: 'cookie',
    description: 'Cookie monster!',
    listen: /cookie/i,
    play: 'is-it-cookie.mp3',
  },
  {
    keyword: 'shoryuken',
    description: 'SF2 Ken Theme',
    listen: /shoryuken/i,
    play: 'sf2-ken-theme.mp3',
  },
  {
    keyword: 'flea',
    description: 'The Spanish Flea song',
    listen: /flea/i,
    play: 'spanish-flea.mp3',
  },
  {
    keyword: 'jeopardy',
    description: 'The Jeopardy song',
    listen: /jeopardy/i,
    play: 'jeopardy.mp3',
  },
  {
    keyword: 'hey',
    description: '"HEY!"',
    listen: /hey/i,
    play: 'harry-caray-hey.mp3',
  },
  {
    keyword: 'yeah',
    description: '"YEAH!"',
    listen: /yeah/i,
    play: 'yeah.mp3',
  },
  {
    keyword: 'wilhelm',
    description: 'The famous Wilhelm scream',
    listen: /wilhelm/i,
    play: 'wilhelm-scream.mp3',
  },
  {
    keyword: 'howard',
    description: 'The famous Howard Dean scream',
    listen: /howard/i,
    play: 'howard-dean-scream.mp3',
  },
];

export function attachResponses(app: App, sonos: Sonos): void {
  burnResponses.forEach((resp) => {
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

export function getHelpText(): string {
  return burnResponses
    .map((resp) => `Keyword: ${resp.keyword}\nDescription: ${resp.description}`)
    .join('\n\n');
}
