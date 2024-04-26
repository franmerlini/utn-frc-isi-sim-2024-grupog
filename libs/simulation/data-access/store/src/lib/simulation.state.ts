import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import {
  ChiSquareTestInterval,
  DistributionEnum,
  Interval,
  KsTestInterval,
  Simulation,
} from '@grupog/libs/shared/models';

import { CHI_SQUARE_PROBABILITIES, KS_PROBABILITIES, KS_PROBABILITIES_GREATER_THAN_35 } from '@grupog/libs/shared/util';
import { SimulationActions } from './simulation.actions';

const simulationFeatureKey = 'simulation';

type State = Simulation & {
  randomNumbers: number[];
  intervals: Interval[];
  significanceLevel: number;
  chiSquareTestIntervals: ChiSquareTestInterval[];
  ksTestIntervals: KsTestInterval[];
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
  ksTestIntervals: [],
  graph: {},
};

export const reducer = createReducer(
  initialState,

  on(SimulationActions.runSimulation, (state, { parameters }) => ({
    ...state,
    ...parameters,
  })),
  on(
    SimulationActions.runSimulationSuccess,
    (state, { randomNumbers, intervals, chiSquareTestIntervals, ksTestIntervals, graph }) => ({
      ...state,
      randomNumbers,
      intervals,
      chiSquareTestIntervals,
      ksTestIntervals,
      graph,
    })
  ),
  on(SimulationActions.runSimulationFailure, (state) => ({
    ...state,
    randomNumbers: [],
    intervals: [],
    chiSquareTestIntervals: [],
    ksTestIntervals: [],
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
    const selectCalculatedChiSquare = createSelector(selectSimulationState, (state) =>
      state.chiSquareTestIntervals?.length
        ? state.chiSquareTestIntervals[state.chiSquareTestIntervals.length - 1].accumulatedC
        : 0
    );

    const selectChiSquareDegreesOfFreedom = createSelector(selectSimulationState, (state) => {
      const intervalsQuantity = state.chiSquareTestIntervals?.length;

      if (!intervalsQuantity) {
        return 0;
      }

      switch (state.distribution) {
        case DistributionEnum.UNIFORM:
          return intervalsQuantity - 1 - 0;
        case DistributionEnum.NORMAL:
          return intervalsQuantity - 1 - 2;
        case DistributionEnum.EXPONENTIAL:
          return intervalsQuantity - 1 - 1;
      }
    });

    const selectChiSquareCriticalValue = createSelector(
      selectSimulationState,
      selectChiSquareDegreesOfFreedom,
      (state, chiSqaureDegreesOfFreedom) => {
        if (!chiSqaureDegreesOfFreedom || !state.significanceLevel) {
          return 0;
        }
        return CHI_SQUARE_PROBABILITIES[chiSqaureDegreesOfFreedom][state.significanceLevel];
      }
    );

    const selectCalculatedKs = createSelector(selectSimulationState, (state) =>
      state.ksTestIntervals?.length ? state.ksTestIntervals[state.ksTestIntervals.length - 1].maxDeviation : 0
    );

    const selectKsDegreesOfFreedom = createSelector(selectSimulationState, (state) => state.sampleSize);

    const selectKsCriticalValue = createSelector(
      selectSimulationState,
      selectKsDegreesOfFreedom,
      (state, ksDegreesOfFreedom) => {
        if (!ksDegreesOfFreedom || !state.significanceLevel) {
          return 0;
        }
        if (ksDegreesOfFreedom >= 35) {
          return KS_PROBABILITIES_GREATER_THAN_35[state.significanceLevel](ksDegreesOfFreedom);
        }
        return KS_PROBABILITIES[ksDegreesOfFreedom][state.significanceLevel];
      }
    );

    return {
      selectCalculatedChiSquare,
      selectChiSquareDegreesOfFreedom,
      selectChiSquareCriticalValue,
      selectCalculatedKs,
      selectKsDegreesOfFreedom,
      selectKsCriticalValue,
    };
  },
});
