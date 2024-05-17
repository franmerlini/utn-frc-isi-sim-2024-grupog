import { DemandDistributionItem } from './demand-distribution-item.model';
import { Policy } from './policy.model';

export type MonteCarloSimulation = {
  policy: Policy;
  orderAmount: number;
  n: number;
  purchasePrice: number;
  sellingPrice: number;
  stockOutCost: number;
  returnPrice: number;
  initialDemand: number;
  demandDistribution: DemandDistributionItem[];
};
