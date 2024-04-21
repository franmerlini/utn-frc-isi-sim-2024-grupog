import { inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, exhaustMap, map, of } from 'rxjs';

import { SimulationService } from '@grupog/libs/shared/util';

import { SimulationActions } from './simulation.actions';

const runSimulation$ = createEffect(
  (actions$ = inject(Actions), simulationService = inject(SimulationService)) =>
    actions$.pipe(
      ofType(SimulationActions.runSimulation),
      exhaustMap(({ parameters }) =>
        simulationService.simulate(parameters).pipe(
          map((randomNumbers) => SimulationActions.runSimulationSuccess({ randomNumbers })),
          catchError(() =>
            of(
              SimulationActions.runSimulationFailure({
                error: 'Failed to simulate.',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const SimulationEffects = { runSimulation$ };
