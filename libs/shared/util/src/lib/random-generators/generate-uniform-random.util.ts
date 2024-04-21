import { truncateDecimals } from './truncate-decimals.util';

export const generateUniformRandom = (a: number, b: number): number => {
  const rnd = Math.random() * (b - a) + a;
  return truncateDecimals(rnd, 4);
};
