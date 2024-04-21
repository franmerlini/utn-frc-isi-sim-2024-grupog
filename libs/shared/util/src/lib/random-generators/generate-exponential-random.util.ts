import { truncateDecimals } from './truncate-decimals.util';

export const generateExponentialRandom = (lambda: number): number => {
  let u = 0;

  while (u === 0) u = Math.random();

  const rnd = -Math.log(u) / lambda;

  return truncateDecimals(rnd, 4);
};
