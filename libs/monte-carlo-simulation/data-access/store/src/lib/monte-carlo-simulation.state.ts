import { createFeature, createReducer, on } from '@ngrx/store';

import { MonteCarloSimulation, MonteCarloSimulationRow } from '@grupog/libs/shared/models';

import { MonteCarloSimulationActions } from './monte-carlo-simulation.actions';

const monteCarloSimulationFeatureKey = 'monteCarloSimulation';

type State = MonteCarloSimulation & {
  monteCarloSimulationRows: MonteCarloSimulationRow[];
};

const initialState: State = {
  n: 0,
  purchasePrice: 0,
  sellingPrice: 0,
  stockOutCost: 0,
  returnPrice: 0,
  initialDemand: 0,
  demandDistribution: [],
  monteCarloSimulationRows: [],
};

export const reducer = createReducer(
  initialState,

  on(MonteCarloSimulationActions.runMonteCarloSimulationSuccess, (state, { monteCarloSimulationRows }) => ({
    ...state,
    monteCarloSimulationRows,
  })),
  on(MonteCarloSimulationActions.runMonteCarloSimulationFailure, (state) => ({
    ...state,
    monteCarloSimulationRows: [],
  })),

  on(MonteCarloSimulationActions.resetMonteCarloSimulation, () => ({
    ...initialState,
  }))
);

export const MonteCarloSimulationFeature = createFeature({
  name: monteCarloSimulationFeatureKey,
  reducer,
});
