import { expect, test } from 'vitest';
import { isValidRelayToken } from '../src/relay-auth';

const SECRET = 'sekret';

test('accepts an exact token match', () => {
  expect(isValidRelayToken('sekret', SECRET)).toBe(true);
});

test('accepts a token offered among comma-separated subprotocols', () => {
  expect(isValidRelayToken('sekret, foo', SECRET)).toBe(true);
});

test('rejects a wrong token', () => {
  expect(isValidRelayToken('nope', SECRET)).toBe(false);
});

test('rejects a missing/undefined token', () => {
  expect(isValidRelayToken(undefined, SECRET)).toBe(false);
  expect(isValidRelayToken('', SECRET)).toBe(false);
});

test('rejects everything when no secret is configured', () => {
  expect(isValidRelayToken('anything', '')).toBe(false);
  expect(isValidRelayToken('anything', undefined)).toBe(false);
});
