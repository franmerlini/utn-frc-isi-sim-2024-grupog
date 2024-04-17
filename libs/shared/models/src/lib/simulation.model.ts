import { Distribution } from './distribution.model';

export type Simulation = {
  distribution: Distribution;
  sampleSize: number;
  a: number;
  b: number;
  mean: number;
  standardDeviation: number;
  lambda: number;
};
