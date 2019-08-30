export function randomFromArray<T>(responses: T[]) {
  return responses[Math.floor(Math.random() * responses.length)];
}
