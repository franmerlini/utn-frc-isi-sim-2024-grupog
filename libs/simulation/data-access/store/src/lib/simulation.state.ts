import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { ChiSquareTestInterval, DistributionEnum, Interval, Simulation } from '@grupog/libs/shared/models';

import { CHI_SQUARE_PROBABILITIES } from '@grupog/libs/shared/util';
import { SimulationActions } from './simulation.actions';

const simulationFeatureKey = 'simulation';

type State = Simulation & {
  randomNumbers: number[];
  intervals: Interval[];
  significanceLevel: number;
  chiSquareTestIntervals: ChiSquareTestInterval[];
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
  significanceLevel: 0.05,
  chiSquareTestIntervals: [],
  graph: {},
};

export const reducer = createReducer(
  initialState,

  on(SimulationActions.runSimulation, (state, { parameters }) => ({
    ...state,
    ...parameters,
  })),
  on(SimulationActions.runSimulationSuccess, (state, { randomNumbers, intervals, chiSquareTestIntervals, graph }) => ({
    ...state,
    randomNumbers,
    intervals,
    chiSquareTestIntervals,
    graph,
  })),
  on(SimulationActions.runSimulationFailure, (state) => ({
    ...state,
    randomNumbers: [],
    intervals: [],
    chiSquareTestIntervals: [],
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
  extraSelectors: ({ selectSimulationState }) => {
    const selectCalculatedC = createSelector(selectSimulationState, (state) =>
      state.chiSquareTestIntervals?.length
        ? state.chiSquareTestIntervals[state.chiSquareTestIntervals.length - 1].accumulatedC
        : 0
    );

    const selectDegreesOfFreedom = createSelector(selectSimulationState, (state) => {
      if (!state.chiSquareTestIntervals?.length) {
        return 0;
      }

      switch (state.distribution) {
        case DistributionEnum.UNIFORM:
          return state.chiSquareTestIntervals.length - 1 - 0;
        case DistributionEnum.NORMAL:
          return state.chiSquareTestIntervals.length - 1 - 2;
        case DistributionEnum.EXPONENTIAL:
          return state.chiSquareTestIntervals.length - 1 - 1;
      }
    });

    const selectCriticalValue = createSelector(
      selectSimulationState,
      selectDegreesOfFreedom,
      (state, degreesOfFreedom) => {
        if (!degreesOfFreedom || !state.significanceLevel) {
          return 0;
        }
        return CHI_SQUARE_PROBABILITIES[degreesOfFreedom][state.significanceLevel];
      }
    );

    return {
      selectCalculatedC,
      selectDegreesOfFreedom,
      selectCriticalValue,
    };
  },
});
