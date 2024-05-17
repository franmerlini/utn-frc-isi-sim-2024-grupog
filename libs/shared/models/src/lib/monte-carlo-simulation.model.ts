import { DemandDistributionItem } from './demand-distribution-item.model';

export type MonteCarloSimulation = {
  n: number;
  purchasePrice: number;
  sellingPrice: number;
  stockOutCost: number;
  returnPrice: number;
  initialDemand: number;
  demandDistribution: DemandDistributionItem[];
};
