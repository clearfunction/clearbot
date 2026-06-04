/**
 * Validates a relay's offered WebSocket subprotocol(s) against the configured
 * shared secret. The client offers the token as the WebSocket subprotocol
 * (Sec-WebSocket-Protocol), which may arrive as a comma-separated list.
 *
 * Returns false unless a non-empty secret is configured AND one of the offered
 * values matches it exactly. Never throws.
 */
export function isValidRelayToken(
  offered: string | undefined | null,
  secret: string | undefined | null
): boolean {
  if (!secret) return false;
  if (!offered) return false;
  return offered
    .split(',')
    .map((p) => p.trim())
    .includes(secret);
}
