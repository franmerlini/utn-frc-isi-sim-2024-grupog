import { createFeature, createReducer, on } from '@ngrx/store';

import { QueueSimulation, QueueSimulationRow } from '@grupog/libs/shared/models';

import { QueueSimulationActions } from './queue-simulation.actions';

const queueSimulationFeatureKey = 'queueSimulation';

type State = QueueSimulation & {
  queueSimulationRows: QueueSimulationRow[];
};

const initialState: State = {
  n: 0,
  from: 0,
  to: 0,
  counterArrivalFrecuency: 0,
  selfserviceArrivalFrecuency: 0,
  onlineArrivalFrecuency: 0,
  takewayArrivalFrecuency: 0,
  deliveryArrivalFrecuency: 0,
  counterEndOfServiceFrecuency: 0,
  selfserviceEndOfServiceFrecuency: 0,
  onlineEndOfServiceFrecuency: 0,
  takeawayEndOfServiceFrecuency: 0,
  deliveryEndOfServiceFrecuency: 0,
  queueSimulationRows: [],
};

export const reducer = createReducer(
  initialState,

  on(QueueSimulationActions.runQueueSimulationSuccess, (state, { queueSimulationRows }) => ({
    ...state,
    queueSimulationRows,
  })),
  on(QueueSimulationActions.runQueueSimulationFailure, (state) => ({
    ...state,
    queueSimulationRows: [],
  })),

  on(QueueSimulationActions.resetQueueSimulation, () => ({
    ...initialState,
  }))
);

export const QueueSimulationFeature = createFeature({
  name: queueSimulationFeatureKey,
  reducer,
});
