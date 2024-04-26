import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Interval, KsTestInterval } from '@grupog/libs/shared/models';

@Injectable()
export class KsTestService {
  generateIntervals(intervals: Interval[]): Observable<KsTestInterval[]> {
    const ksTestIntervals: KsTestInterval[] = [];
    const n = intervals.reduce((acc, interval) => acc + interval.observedFrequency, 0);
    let accumulatedObservedProbability = 0;
    let accumulatedExpectedProbability = 0;
    let maxDeviation = 0;

    for (const interval of intervals) {
      const expectedProbability = interval.expectedFrequency / n;
      const observedProbability = interval.observedFrequency / n;
      const deviation = Math.abs(expectedProbability - observedProbability);

      accumulatedExpectedProbability += expectedProbability;
      accumulatedObservedProbability += observedProbability;
      maxDeviation = Math.max(maxDeviation, deviation);

      const ksTestInterval: KsTestInterval = {
        lowerBound: interval.lowerBound,
        upperBound: interval.upperBound,
        expectedFrequency: interval.expectedFrequency,
        observedFrequency: interval.observedFrequency,
        expectedProbability,
        observedProbability,
        accumulatedExpectedProbability,
        accumulatedObservedProbability,
        deviation,
        maxDeviation,
      };

      ksTestIntervals.push(ksTestInterval);
    }

    return of(ksTestIntervals);
  }
}
