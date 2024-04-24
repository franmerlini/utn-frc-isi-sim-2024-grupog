import { Interval } from './interval.model';

export type ChiSquareTestInterval = Omit<Interval, 'classMark'> & {
  c: number;
  accumulatedC: number;
};
