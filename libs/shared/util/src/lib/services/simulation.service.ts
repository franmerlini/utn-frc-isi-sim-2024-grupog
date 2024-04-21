import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { DistributionEnum, Interval, Simulation } from '@grupog/libs/shared/models';

import {
  generateExponentialRandom,
  generateNormalRandom,
  generateUniformRandom,
  truncateDecimals,
} from '../random-generators';

@Injectable()
export class SimulationService {
  simulate(parameters: Simulation): Observable<number[]> {
    const { distribution } = parameters;

    switch (distribution) {
      case DistributionEnum.UNIFORM:
        return of(this.simulateUniform(parameters.sampleSize, parameters.a, parameters.b));
      case DistributionEnum.NORMAL:
        return of(this.simulateNormal(parameters.sampleSize, parameters.mean, parameters.standardDeviation));
      case DistributionEnum.EXPONENTIAL:
        return of(this.simulateExponential(parameters.sampleSize, parameters.lambda));
      default:
        throw new Error('Invalid distribution.');
    }
  }

  private simulateUniform(sampleSize: number, a: number, b: number): number[] {
    return Array.from({ length: sampleSize }, () => generateUniformRandom(a, b));
  }

  private simulateNormal(sampleSize: number, mean: number, standardDeviation: number): number[] {
    return Array.from({ length: sampleSize }, () => generateNormalRandom(mean, standardDeviation));
  }

  private simulateExponential(sampleSize: number, lambda: number): number[] {
    return Array.from({ length: sampleSize }, () => generateExponentialRandom(lambda));
  }

  generateIntervals(parameters: Simulation, randomNumbers: number[]): Observable<Interval[]> {
    const orderedRandomNumbers = [...randomNumbers].sort((a, b) => a - b);
    const lowerBound = orderedRandomNumbers[0];
    const upperBound = orderedRandomNumbers[randomNumbers.length - 1];
    const { intervalQuantity } = parameters;
    const step = truncateDecimals((upperBound - lowerBound) / intervalQuantity, 4);

    let currentLowerBound = lowerBound;
    let currentUpperBound = lowerBound + step;

    return of(
      Array.from({ length: intervalQuantity }, () => {
        const classMark = truncateDecimals((currentLowerBound + currentUpperBound) / 2, 4);

        const interval: Interval = {
          lowerBound: currentLowerBound,
          upperBound: currentUpperBound,
          classMark,
          expectedFrequency: this.calculateExpectedFrequency(
            parameters,
            classMark,
            randomNumbers,
            currentLowerBound,
            currentUpperBound
          ),
          observedFrequency: this.calculateObservedFrequency(randomNumbers, currentLowerBound, currentUpperBound),
        };

        currentLowerBound = truncateDecimals(currentUpperBound, 4);
        currentUpperBound = truncateDecimals(currentUpperBound + step - 0.0001, 4);

        return interval;
      })
    );
  }

  private calculateExpectedFrequency(
    parameters: Simulation,
    classMark: number,
    randomNumbers: number[],
    lowerBound: number,
    upperBound: number
  ): number {
    const { distribution, mean, standardDeviation, lambda } = parameters;
    const intervalQuantity = 10;

    switch (distribution) {
      case DistributionEnum.UNIFORM:
        return this.calculateUniformExpectedFrequency(randomNumbers, intervalQuantity);
      case DistributionEnum.NORMAL:
        return this.calculateNormalExpectedFrequency(classMark, mean, standardDeviation, lowerBound, upperBound);
      case DistributionEnum.EXPONENTIAL:
        return this.calculateExponentialExpectedFrequency(randomNumbers, lambda, classMark, lowerBound, upperBound);
      default:
        throw new Error('Invalid distribution.');
    }
  }

  private calculateObservedFrequency(randomNumbers: number[], lowerBound: number, upperBound: number): number {
    return randomNumbers.filter((number) => number >= lowerBound && number < upperBound).length;
  }

  private calculateUniformExpectedFrequency(randomNumbers: number[], intervalQuantity: number): number {
    return randomNumbers.length / intervalQuantity;
  }

  private calculateNormalExpectedFrequency(
    classMark: number,
    mean: number,
    standardDeviation: number,
    lowerBound: number,
    upperBound: number
  ): number {
    return (
      (Math.exp(-0.5 * ((classMark - mean) / standardDeviation) ** 2) / (standardDeviation * Math.sqrt(2 * Math.PI))) *
      (lowerBound - upperBound)
    );
  }

  private calculateExponentialExpectedFrequency(
    randomNumbers: number[],
    lambda: number,
    classMark: number,
    lowerBound: number,
    upperBound: number
  ): number {
    const density = lambda * Math.exp(-lambda * classMark);
    const width = upperBound - lowerBound;
    return density * width * randomNumbers.length;
  }
}
