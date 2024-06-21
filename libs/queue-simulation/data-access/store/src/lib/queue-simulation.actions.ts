import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { QueueSimulation, QueueSimulationRow } from '@grupog/libs/shared/models';

export const QueueSimulationActions = createActionGroup({
  source: 'Queue Simulation',
  events: {
    'Run queue simulation': props<{ parameters: QueueSimulation }>(),
    'Run queue simulation success': props<{ queueSimulationRows: QueueSimulationRow[] }>(),
    'Run queue simulation failure': props<{ error: string }>(),

    'Reset queue simulation': emptyProps(),
  },
});
