interface RandomPlay {
  (): string;
}

export interface Response {
  listen: string | RegExp;
  play: string | RandomPlay;
  message?: string;
}
