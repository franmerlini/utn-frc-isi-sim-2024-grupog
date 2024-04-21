import { truncateDecimals } from './truncate-decimals.util';

export const generateNormalRandom = (mean: number, standardDeviation: number): number => {
  let u = 0;
  let v = 0;

  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  const rnd = mean + standardDeviation * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  return truncateDecimals(rnd, 4);
};
