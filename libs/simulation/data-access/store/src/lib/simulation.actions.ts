import { createActionGroup, props } from '@ngrx/store';

import { Distribution, Interval, Simulation } from '@grupog/libs/shared/models';

export const SimulationActions = createActionGroup({
  source: 'Simulation',
  events: {
    'Run simulation': props<{ parameters: Simulation }>(),
    'Run simulation success': props<{
      randomNumbers: number[];
      intervals: Interval[];
      graph: any;
    }>(),
    'Run simulation failure': props<{ error: string }>(),

    'Reset simulation': props<{ distribution: Distribution }>(),
  },
});
