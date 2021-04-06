export function randomFromArray<T>(responses: T[]): T {
  return responses[Math.floor(Math.random() * responses.length)];
}
