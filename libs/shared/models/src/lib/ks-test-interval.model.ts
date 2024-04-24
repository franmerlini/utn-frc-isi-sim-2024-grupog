import { Interval } from './interval.model';

export type KsTestInterval = Omit<Interval, 'classMark'> & {
  expectedProbability: number;
  observedProbability: number;
  accumulatedExpectedProbability: number;
  accumulatedObservedProbability: number;
  deviation: number;
  maxDeviation: number;
};
