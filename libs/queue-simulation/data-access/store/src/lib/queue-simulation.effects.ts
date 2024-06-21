import { inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, exhaustMap, map, of } from 'rxjs';

import { QueueSimulationService } from '@grupog/libs/shared/util';

import { QueueSimulationActions } from './queue-simulation.actions';

const runQueueSimulation$ = createEffect(
  (actions$ = inject(Actions), queueSimulationService = inject(QueueSimulationService)) =>
    actions$.pipe(
      ofType(QueueSimulationActions.runQueueSimulation),
      exhaustMap(({ parameters }) =>
        queueSimulationService.simulate(parameters).pipe(
          map((queueSimulationRows) => QueueSimulationActions.runQueueSimulationSuccess({ queueSimulationRows })),
          catchError((error) => of(QueueSimulationActions.runQueueSimulationFailure({ error })))
        )
      )
    ),
  { functional: true }
);

export const QueueSimulationEffects = { runQueueSimulation$ };
