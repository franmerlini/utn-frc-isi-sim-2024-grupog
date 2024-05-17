import { inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, exhaustMap, map, of } from 'rxjs';

import { MonteCarloSimulationService } from '@grupog/libs/shared/util';

import { MonteCarloSimulationActions } from './monte-carlo-simulation.actions';

const runMonteCarloSimulation$ = createEffect(
  (actions$ = inject(Actions), monteCarloSimulationService = inject(MonteCarloSimulationService)) =>
    actions$.pipe(
      ofType(MonteCarloSimulationActions.runMonteCarloSimulation),
      exhaustMap(({ parameters }) =>
        monteCarloSimulationService.simulate(parameters).pipe(
          map((monteCarloSimulationRows) =>
            MonteCarloSimulationActions.runMonteCarloSimulationSuccess({ monteCarloSimulationRows })
          ),
          catchError((error) => of(MonteCarloSimulationActions.runMonteCarloSimulationFailure({ error })))
        )
      )
    ),
  { functional: true }
);

export const MonteCarloSimulationEffects = { runMonteCarloSimulation$ };
