import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { DistributionEnum, Simulation } from '@grupog/libs/shared/models';

import { generateExponentialRandom, generateNormalRandom, generateUniformRandom } from '../random-generators';

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
}
