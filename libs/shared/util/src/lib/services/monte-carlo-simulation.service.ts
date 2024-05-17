import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { DemandDistributionItem, MonteCarloSimulation, MonteCarloSimulationRow } from '@grupog/libs/shared/models';

import { truncateDecimals } from '../random-generators';

@Injectable()
export class MonteCarloSimulationService {
  simulate(parameters: MonteCarloSimulation): Observable<MonteCarloSimulationRow[]> {
    const { n, purchasePrice, sellingPrice, stockOutCost, returnPrice, initialDemand, demandDistribution } = parameters;
    const accumulatedProbabilities = this.generateAccumulatedProbabilities(demandDistribution);

    const previousState: MonteCarloSimulationRow = {
      day: 0,
      rnd: 0,
      demand: 0,
      available: 0,
      stock: 0,
      stockOutQuantity: 0,
      orderCost: 0,
      stockOutCost: 0,
      salesProfit: 0,
      returnProfit: 0,
      totalProfit: 0,
      accumulatedProfit: 0,
      averageProfit: 0,
    };

    const monteCarloSimulationRows: MonteCarloSimulationRow[] = [];

    let currentDay = 0;
    let currentRnd = 0;
    let currentDemand = 0;
    let currentAvailable = 0;
    let currentStock = 0;
    let currentStockOutQuantity = 0;

    let currentOrderCost = 0;
    let currentStockOutCost = 0;

    let currentSalesProfit = 0;
    let currentReturnProfit = 0;

    let currentTotalProfit = 0;
    let currentAccumulatedProfit = 0;
    let currentAverageProfit = 0;

    for (let i = 0; i < n + 1; i++) {
      currentDay = i;

      if (i === 0) {
        currentDemand = initialDemand;

        previousState.day = currentDay;
        previousState.demand = currentDemand;

        monteCarloSimulationRows.push({ ...previousState });

        continue;
      }

      currentRnd = truncateDecimals(Math.random(), 2);
      currentDemand = accumulatedProbabilities.find(({ accProb }) => currentRnd < accProb)?.demand || 0;
      currentAvailable = previousState.demand;

      const disponibleMenosDemanda = currentAvailable - currentDemand;
      if (disponibleMenosDemanda < 0) {
        currentStock = 0;
        currentStockOutQuantity = currentDemand - currentAvailable;
      } else {
        currentStock = disponibleMenosDemanda;
        currentStockOutQuantity = 0;
      }

      // costos
      currentOrderCost = currentAvailable * purchasePrice;

      if (currentStockOutQuantity > 0) {
        currentStockOutCost = currentStockOutQuantity * stockOutCost;
      } else {
        currentStockOutCost = 0;
      }

      // ganancias
      if (currentStockOutQuantity === 0) {
        currentSalesProfit = currentDemand * sellingPrice;
      } else {
        currentSalesProfit = currentAvailable * sellingPrice;
      }

      if (currentStockOutQuantity === 0 && currentStock > 0) {
        currentReturnProfit = currentStock * returnPrice;
      } else {
        currentReturnProfit = 0;
      }

      const totalGanancias = currentSalesProfit + currentReturnProfit;
      const totalCostos = currentOrderCost + currentStockOutCost;
      const total = totalGanancias - totalCostos;
      currentTotalProfit = total;

      if (i === 0) {
        currentAccumulatedProfit = total;
        currentAverageProfit = 0;
      } else {
        currentAccumulatedProfit = previousState.totalProfit + total;
        currentAverageProfit = total / i;
      }

      previousState.day = currentDay;
      previousState.rnd = currentRnd;
      previousState.demand = currentDemand;
      previousState.available = currentAvailable;
      previousState.stock = currentStock;
      previousState.stockOutQuantity = currentStockOutQuantity;
      previousState.orderCost = currentOrderCost;
      previousState.stockOutCost = truncateDecimals(currentStockOutCost, 2);
      previousState.salesProfit = truncateDecimals(currentSalesProfit, 2);
      previousState.returnProfit = truncateDecimals(currentReturnProfit, 2);
      previousState.totalProfit = truncateDecimals(currentTotalProfit, 2);
      previousState.accumulatedProfit = truncateDecimals(currentAccumulatedProfit, 2);
      previousState.averageProfit = truncateDecimals(currentAverageProfit, 2);

      monteCarloSimulationRows.push({ ...previousState });
    }

    return of(monteCarloSimulationRows);
  }

  private generateAccumulatedProbabilities(
    demandDistribution: DemandDistributionItem[]
  ): { demand: number; accProb: number }[] {
    let acc = 0;
    return demandDistribution.map(({ demand }) => ({
      demand,
      accProb: (acc += demand),
    }));
  }
}
