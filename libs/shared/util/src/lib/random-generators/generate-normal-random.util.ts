import { truncateDecimals } from './truncate-decimals.util';

export const generateNormalRandom = (mean: number, standardDeviation: number): [number, number] => {
  let u = 0;
  let v = 0;

  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  const rnd1 = mean + standardDeviation * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const rnd2 = mean + standardDeviation * Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);

  return [truncateDecimals(rnd1, 4), truncateDecimals(rnd2, 4)];
};
