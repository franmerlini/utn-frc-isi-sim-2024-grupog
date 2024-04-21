import { createFeature, createReducer, on } from '@ngrx/store';

import { DistributionEnum, Interval, Simulation } from '@grupog/libs/shared/models';

import { SimulationActions } from './simulation.actions';

const simulationFeatureKey = 'simulation';

type State = Simulation & {
  randomNumbers: number[];
  intervals: Interval[];
  graph: any;
};

const initialState: State = {
  distribution: DistributionEnum.UNIFORM,
  sampleSize: 0,
  a: 0,
  b: 0,
  mean: 0,
  standardDeviation: 0,
  lambda: 0,
  intervalQuantity: 10,
  randomNumbers: [],
  intervals: [],
  graph: {},
};

export const reducer = createReducer(
  initialState,

  on(SimulationActions.runSimulation, (state, { parameters }) => ({
    ...state,
    ...parameters,
  })),
  on(SimulationActions.runSimulationSuccess, (state, { randomNumbers, intervals, graph }) => ({
    ...state,
    randomNumbers,
    intervals,
    graph,
  })),
  on(SimulationActions.runSimulationFailure, (state) => ({
    ...state,
    randomNumbers: [],
    intervals: [],
    graph: {},
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
