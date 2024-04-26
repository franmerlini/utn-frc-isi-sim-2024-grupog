import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ChiSquareTestInterval, Interval } from '@grupog/libs/shared/models';
import { truncateDecimals } from '../random-generators';

@Injectable()
export class ChiSquareTestService {
  private MIN_OBSERVED_FREQUENCY = 5;

  generateIntervals(intervals: Interval[]): Observable<ChiSquareTestInterval[]> {
    const groupedIntervals: ChiSquareTestInterval[] = [];
    let currentGroup: Interval[] = [];
    let currentExpectedFrequency = 0;
    let currentObservedFrequency = 0;
    let lowerBound = 0;
    let accumulatedC = 0;

    for (const interval of intervals) {
      if (currentGroup.length === 0) {
        lowerBound = interval.lowerBound;
      }

      currentGroup.push(interval);

      currentExpectedFrequency += interval.expectedFrequency;
      currentObservedFrequency += interval.observedFrequency;

      if (currentExpectedFrequency >= this.MIN_OBSERVED_FREQUENCY) {
        const upperBound = currentGroup[currentGroup.length - 1].upperBound;

        const c = (currentExpectedFrequency - currentObservedFrequency) ** 2 / currentExpectedFrequency;

        accumulatedC += c;

        const chiSquareTestInterval: ChiSquareTestInterval = {
          lowerBound,
          upperBound,
          expectedFrequency: truncateDecimals(currentExpectedFrequency, 4),
          observedFrequency: truncateDecimals(currentObservedFrequency, 4),
          c: truncateDecimals(c, 4),
          accumulatedC: truncateDecimals(accumulatedC, 4),
        };

        groupedIntervals.push(chiSquareTestInterval);

        currentGroup = [];
        currentExpectedFrequency = 0;
        currentObservedFrequency = 0;
      }
    }

    if (currentGroup.length > 0) {
      if (groupedIntervals.length > 0) {
        const lastGroup = groupedIntervals[groupedIntervals.length - 1];
        lastGroup.upperBound = currentGroup[currentGroup.length - 1].upperBound;
        lastGroup.expectedFrequency = truncateDecimals(lastGroup.expectedFrequency + currentExpectedFrequency, 4);
        lastGroup.observedFrequency = truncateDecimals(lastGroup.observedFrequency + currentObservedFrequency, 4);

        const c = (lastGroup.expectedFrequency - lastGroup.observedFrequency) ** 2 / lastGroup.expectedFrequency;
        accumulatedC += c;

        lastGroup.c = truncateDecimals(c, 4);
        lastGroup.accumulatedC = truncateDecimals(accumulatedC, 4);
      } else {
        const upperBound = currentGroup[currentGroup.length - 1].upperBound;

        const c = (currentExpectedFrequency - currentObservedFrequency) ** 2 / currentExpectedFrequency;
        accumulatedC += c;

        const chiSquareTestInterval: ChiSquareTestInterval = {
          lowerBound,
          upperBound,
          expectedFrequency: truncateDecimals(currentExpectedFrequency, 4),
          observedFrequency: truncateDecimals(currentObservedFrequency, 4),
          c: truncateDecimals(c, 4),
          accumulatedC: truncateDecimals(accumulatedC, 4),
        };

        groupedIntervals.push(chiSquareTestInterval);
      }
    }

    return of(groupedIntervals);
  }
}
