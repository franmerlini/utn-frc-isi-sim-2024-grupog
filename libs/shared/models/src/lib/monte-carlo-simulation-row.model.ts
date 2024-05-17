export type MonteCarloSimulationRow = {
  day: number;
  rnd: number;
  demand: number;
  available: number;
  stock: number;
  stockOutQuantity: number;
  orderCost: number;
  stockOutCost: number;
  salesProfit: number;
  returnProfit: number;
  totalProfit: number;
  accumulatedProfit: number;
  averageProfit: number;
};
