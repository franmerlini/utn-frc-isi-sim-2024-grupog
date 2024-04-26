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
  // Tabla de numeros aleatorios
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

  // Tabla de probabilidades y frecuencias
  generateIntervals(parameters: Simulation, randomNumbers: number[]): Observable<Interval[]> {
    const orderedRandomNumbers = [...randomNumbers].sort((a, b) => a - b);
    const lowerBound = orderedRandomNumbers[0];
    const upperBound = orderedRandomNumbers[randomNumbers.length - 1];
    const { intervalQuantity, sampleSize } = parameters;
    const step = (upperBound - lowerBound) / intervalQuantity;

    let currentLowerBound = lowerBound;
    let currentUpperBound = lowerBound + step;

    return of(
      Array.from({ length: intervalQuantity }, () => {
        const classMark = (currentLowerBound + currentUpperBound) / 2;

        const interval: Interval = {
          lowerBound: truncateDecimals(currentLowerBound, 4),
          upperBound: truncateDecimals(currentUpperBound, 4),
          classMark: truncateDecimals(classMark, 4),
          expectedFrequency: truncateDecimals(
            this.calculateExpectedFrequency(parameters, classMark, currentLowerBound, currentUpperBound, sampleSize),
            4
          ),
          observedFrequency: truncateDecimals(
            this.calculateObservedFrequency(randomNumbers, currentLowerBound, currentUpperBound),
            4
          ),
        };

        currentLowerBound = truncateDecimals(currentUpperBound, 4);
        currentUpperBound = truncateDecimals(currentUpperBound + step + 0.0001, 4);

        return interval;
      })
    );
  }

  private calculateObservedFrequency(randomNumbers: number[], lowerBound: number, upperBound: number): number {
    return randomNumbers.filter((number) => number >= lowerBound && number < upperBound).length;
  }

  private calculateExpectedFrequency(
    parameters: Simulation,
    classMark: number,
    lowerBound: number,
    upperBound: number,
    sampleSize: number
  ): number {
    const { distribution, mean, standardDeviation, lambda, intervalQuantity } = parameters;

    switch (distribution) {
      case DistributionEnum.UNIFORM:
        return this.calculateUniformExpectedFrequency(sampleSize, intervalQuantity);
      case DistributionEnum.NORMAL:
        return this.calculateNormalExpectedFrequency(
          classMark,
          mean,
          standardDeviation,
          lowerBound,
          upperBound,
          sampleSize
        );
      case DistributionEnum.EXPONENTIAL:
        return this.calculateExponentialExpectedFrequency(sampleSize, lambda, classMark, lowerBound, upperBound);
      default:
        throw new Error('Invalid distribution.');
    }
  }

  private calculateUniformExpectedFrequency(sampleSize: number, intervalQuantity: number): number {
    return sampleSize / intervalQuantity;
  }

  private calculateNormalExpectedFrequency(
    classMark: number,
    mean: number,
    standardDeviation: number,
    lowerBound: number,
    upperBound: number,
    sampleSize: number
  ): number {
    const density =
      Math.exp(-0.5 * ((classMark - mean) / standardDeviation) ** 2) / (standardDeviation * Math.sqrt(2 * Math.PI));
    const width = upperBound - lowerBound;
    return density * width * sampleSize;
  }

  private calculateExponentialExpectedFrequency(
    sampleSize: number,
    lambda: number,
    classMark: number,
    lowerBound: number,
    upperBound: number
  ): number {
    const density = lambda * Math.exp(-lambda * classMark);
    const width = upperBound - lowerBound;
    return density * width * sampleSize;
  }
}
