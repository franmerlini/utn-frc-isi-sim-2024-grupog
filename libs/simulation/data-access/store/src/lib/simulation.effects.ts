import { inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, exhaustMap, map, of, withLatestFrom } from 'rxjs';

import { SimulationService } from '@grupog/libs/shared/util';

import { DistributionEnum } from '@grupog/libs/shared/models';
import { Store } from '@ngrx/store';
import { SimulationActions } from './simulation.actions';
import { SimulationFeature } from './simulation.state';

const runSimulation$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), simulationService = inject(SimulationService)) =>
    actions$.pipe(
      ofType(SimulationActions.runSimulation),
      withLatestFrom(
        store.select(SimulationFeature.selectIntervalQuantity),
        store.select(SimulationFeature.selectDistribution)
      ),
      exhaustMap(([{ parameters }, intervalQuantity, distribution]) =>
        simulationService.simulate(parameters).pipe(
          concatMap((randomNumbers) =>
            simulationService.generateIntervals(parameters, randomNumbers).pipe(
              map((intervals) => {
                const graph = {
                  data: [
                    {
                      x: randomNumbers,
                      type: 'histogram',
                      name: 'Frecuencia observada',
                      marker: {
                        color: 'rgb(45 212 191)',
                      },
                      opacity: 0.75,
                      xbins: {
                        start: intervals[0].lowerBound,
                        end: intervals[intervals.length - 1].upperBound,
                        size: (intervals[intervals.length - 1].upperBound - intervals[0].lowerBound) / intervalQuantity,
                      },
                    },
                  ],
                  layout: {
                    width: 800,
                    height: 600,
                    title: `Histograma de frecuencias para distribución ${
                      distribution === DistributionEnum.UNIFORM
                        ? 'uniforme'
                        : distribution === DistributionEnum.NORMAL
                        ? 'normal'
                        : 'exponencial'
                    }`,
                    barmode: 'overlay',
                    xaxis: { title: 'Intervalos' },
                    yaxis: { title: 'Frecuencia' },
                  },
                };

                return SimulationActions.runSimulationSuccess({ randomNumbers, intervals, graph });
              }),
              catchError(() =>
                of(
                  SimulationActions.runSimulationFailure({
                    error: 'Failed to simulate.',
                  })
                )
              )
            )
          )
        )
      )
    ),
  { functional: true }
);

export const SimulationEffects = { runSimulation$ };
