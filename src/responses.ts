import { App } from '@slack/bolt';
import { Response } from './types';
import { randomFromArray as randomResponse } from './utils';
import Sonos from './sonos';

const burns = ['sick-burn.mp3', 'thats-gotta-hurt.mp3'];
const seinfeldTransitions = ['seinfeld-1.mp3', 'seinfeld-2.mp3'];
const laughTracks = [
  'laugh-track-1.mp3',
  'laugh-track-2.mp3',
  'laugh-track-3.mp3',
  'laugh-track-4.mp3',
];

export const burnResponses: Response[] = [
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
    keyword: 'startup',
    description: 'Windows XP startup sound',
    listen: /startup/i,
    play: 'startup.mp3',
  },
  {
    keyword: 'howard',
    description: 'The famous Howard Dean scream',
    listen: /howard/i,
    play: 'howard-dean-scream.mp3',
  },
  {
    keyword: 'seinfeld',
    description: 'When a Seinfeld transition seems appropriate',
    listen: /seinfeld/i,
    play: randomResponse(seinfeldTransitions),
  },
  {
    keyword: 'laugh',
    description: 'When a good laugh track seems appropriate',
    listen: /laugh/i,
    play: randomResponse(laughTracks),
  },
  {
    keyword: 'sax',
    description: 'Careless Whisper Saxophone',
    listen: /sax/i,
    play: 'saxophone.mp3',
  },
  {
    keyword: 'price is (right|wrong)',
    description: 'Price is Right Fail Sound',
    listen: /price is (right|wrong)/i,
    play: 'price-is-right-fail.mp3',
  },
  {
    keyword: 'kevin',
    description: 'Uh oh, Kevin is home alone!',
    listen: /kevin/i,
    play: 'kevin.mp3',
  },
  {
    keyword: 'idiot',
    description: 'Thanks a lot your idiot',
    listen: /idiot/i,
    play: 'thanks-a-lot-you-idiot.mp3',
  },
  {
    keyword: 'rachel',
    description: 'Thanks a lot Rachel',
    listen: /rachel/i,
    play: 'thanks-a-lot-rachel.mp3',
  },
  {
    keyword: 'fault',
    description: 'And it is all your fault!',
    listen: /fault/i,
    play: 'all-your-fault.mp3',
  },
  {
    keyword: 'jurassic',
    description: 'A wondrous performance of the Jurassic Park theme song',
    listen: /jurassic/i,
    play: 'jurassic_park_flute.mp3',
  },
  {
    keyword: 'dynamite',
    description: 'And boom goes the dynamite',
    listen: /dynamite/i,
    play: 'boom-goes-the-dynamite.mp3',
  },
  {
    keyword: 'developers',
    description: ':developers: :developers: :developers:',
    listen: /developers/i,
    play: 'developers-developers-developers.mp3',
  },
  {
    keyword: 'boring',
    description: 'Homer yelling "Boring!"',
    listen: /boring/i,
    play: 'boring.mp3',
  },
  {
    keyword: 'past',
    description: 'IT Crowd - Are You From the Past?',
    listen: /past/i,
    play: 'it-crowd-are-you-from-the-past.mp3',
  },
  {
    keyword: 'stress',
    description: 'IT Crowd - Over 80 million people have died of stress',
    listen: /stress/i,
    play: 'it-crowd-died-of-stress.mp3',
  },
  {
    keyword: 'pants',
    description: 'IT Crowd - Fix My Pants',
    listen: /pants/i,
    play: 'it-crowd-fix-my-pants.mp3',
  },
  {
    keyword: 'hello',
    description: 'IT Crowd - Hello, IT',
    listen: /hello/i,
    play: 'it-crowd-hello-it.mp3',
  },
  {
    keyword: 'war',
    description: 'IT Crowd - I am declaring war',
    listen: /war/i,
    play: 'it-crowd-i-am-declaring-war.mp3',
  },
  {
    keyword: 'crazy',
    description: "IT Crowd - It can't be done, you're crazy!",
    listen: /crazy/i,
    play: 'it-crowd-it-cant-be-done-youre-crazy.mp3',
  },
  {
    keyword: 'easy',
    description: "IT Crowd - It's easy to remember",
    listen: /easy/i,
    play: 'it-crowd-its-easy-to-remember.mp3',
  },
  {
    keyword: 'turn',
    description: 'IT Crowd - Have you tried turning it off and on again?',
    listen: /turn/i,
    play: 'it-crowd-turn-it-off-and-on-again.mp3',
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
