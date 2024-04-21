import { createFeature, createReducer, on } from '@ngrx/store';

import { DistributionEnum, Simulation } from '@grupog/libs/shared/models';

import { SimulationActions } from './simulation.actions';

const simulationFeatureKey = 'simulation';

type State = Simulation & {
  randomNumbers: number[];
};

const initialState: State = {
  distribution: DistributionEnum.UNIFORM,
  sampleSize: 0,
  a: 0,
  b: 0,
  mean: 0,
  standardDeviation: 0,
  lambda: 0,
  randomNumbers: [],
};

export const reducer = createReducer(
  initialState,

  on(SimulationActions.runSimulation, (state, { parameters }) => ({
    ...state,
    ...parameters,
  })),
  on(SimulationActions.runSimulationSuccess, (state, { randomNumbers }) => ({
    ...state,
    randomNumbers,
  })),
  on(SimulationActions.runSimulationFailure, (state) => ({
    ...state,
    randomNumbers: [],
  })),

  on(SimulationActions.resetSimulation, (state, { distribution }) => ({
    ...initialState,
    distribution,
  }))
);

export const SimulationFeature = createFeature({
  name: simulationFeatureKey,
  reducer,
});
