import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TableModule } from 'primeng/table';

import { MonteCarloSimulationRow } from '@grupog/libs/shared/models';

@Component({
  selector: 'gg-simulation-table',
  standalone: true,
  imports: [TableModule],
  template: `
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold underline">Resultados de simulación</h1>

      <p-table [value]="monteCarloSimulationRows()">
        <ng-template pTemplate="header">
          <tr>
            <th>Día</th>
            <th>RND</th>
            <th>Demanda</th>
            <th>Disponible</th>
            <th>Stock</th>
            <th>Cantidad stock-out</th>
            <th>Costo pedido</th>
            <th>Costo stock-out</th>
            <th>Ganancia ventas</th>
            <th>Ganancia devoluciones</th>
            <th>Ganancia total</th>
            <th>Ganancia acumulada</th>
            <th>Ganancia promedio</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
          <tr>
            <td>{{ row.day }}</td>
            <td>{{ row.rnd }}</td>
            <td>{{ row.demand }}</td>
            <td>{{ row.available }}</td>
            <td>{{ row.stock }}</td>
            <td>{{ row.stockOutQuantity }}</td>
            <td>{{ row.orderCost }}</td>
            <td>{{ row.stockOutCost }}</td>
            <td>{{ row.salesProfit }}</td>
            <td>{{ row.returnProfit }}</td>
            <td>{{ row.totalProfit }}</td>
            <td>{{ row.accumulatedProfit }}</td>
            <td>{{ row.averageProfit }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [
    `
      th,
      td {
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationTableComponent {
  monteCarloSimulationRows = input.required<MonteCarloSimulationRow[]>();
}
