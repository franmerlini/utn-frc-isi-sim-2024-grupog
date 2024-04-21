import { createActionGroup, props } from '@ngrx/store';

import { Distribution, Simulation } from '@grupog/libs/shared/models';

export const SimulationActions = createActionGroup({
  source: 'Simulation',
  events: {
    'Run simulation': props<{ parameters: Simulation }>(),
    'Run simulation success': props<{ randomNumbers: number[] }>(),
    'Run simulation failure': props<{ error: string }>(),

    'Reset simulation': props<{ distribution: Distribution }>(),
  },
});
