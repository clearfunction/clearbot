import { expect, test } from 'vitest';
import { burnResponses } from '../src/responses';

test('no duplicate keywords', () => {
  const keywords = burnResponses.map((r) => r.keyword);
  expect(new Set(keywords).size).toBe(burnResponses.length);
});

test('no duplicate listen handlers', () => {
  const listenHandlers = burnResponses.map((r) => r.listen);
  expect(new Set(listenHandlers).size).toBe(burnResponses.length);
});

test('no duplicate descriptions', () => {
  const descriptions = burnResponses.map((r) => r.description);
  expect(new Set(descriptions).size).toBe(burnResponses.length);
});

test('no duplicate mp3s', () => {
  const mp3s = burnResponses.map((r) => r.play);
  expect(new Set(mp3s).size).toBe(burnResponses.length);
});
