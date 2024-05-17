import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { MonteCarloSimulation, MonteCarloSimulationRow } from '@grupog/libs/shared/models';

export const MonteCarloSimulationActions = createActionGroup({
  source: 'Monte Carlo Simulation',
  events: {
    'Run monte carlo simulation': props<{ parameters: MonteCarloSimulation }>(),
    'Run monte carlo simulation success': props<{ monteCarloSimulationRows: MonteCarloSimulationRow[] }>(),
    'Run monte carlo simulation failure': props<{ error: string }>(),

    'Reset monte carlo simulation': emptyProps(),
  },
});
