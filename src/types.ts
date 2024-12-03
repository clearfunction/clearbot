type RandomPlay = () => string;

export interface Response {
  keyword: string;
  description: string;
  listen: string | RegExp;
  play: string | RandomPlay;
  message?: string;
}
