import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TableModule } from 'primeng/table';

import { KsTestInterval } from '@grupog/libs/shared/models';

@Component({
  selector: 'gg-ks-test-table',
  standalone: true,
  imports: [TableModule],
  template: `
    <p-table
      [value]="intervals()"
      [paginator]="true"
      [rows]="10"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
      [rowsPerPageOptions]="[10, 15, 20]"
      styleClass="p-datatable-sm p-datatable-striped"
    >
      <ng-template pTemplate="header">
        <tr>
          <th>Límite inferior</th>
          <th>Límite superior</th>
          <th>Frecuencia observada</th>
          <th>Frecuencia esperada</th>
          <th>Probabilidad observada</th>
          <th>Probabilidad esperada</th>
          <th>Probabilidad observada acumulada</th>
          <th>Probabilidad esperada acumulada</th>
          <th>Desviación</th>
          <th>Desviación máxima</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-interval>
        <tr>
          <td>{{ interval.lowerBound }}</td>
          <td>{{ interval.upperBound }}</td>
          <td>{{ interval.observedFrequency }}</td>
          <td>{{ interval.expectedFrequency }}</td>
          <td>{{ interval.observedProbability }}</td>
          <td>{{ interval.expectedProbability }}</td>
          <td>{{ interval.accumulatedObservedProbability }}</td>
          <td>{{ interval.accumulatedExpectedProbability }}</td>
          <td>{{ interval.deviation }}</td>
          <td>{{ interval.maxDeviation }}</td>
        </tr>
      </ng-template>
    </p-table>

    <p class="mt-3">{{ hypothesisTestResult() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KsTestTableComponent {
  intervals = input.required<KsTestInterval[]>();
  degreesOfFreedom = input.required<number>();
  significantLevel = input.required<number>();
  calculatedKs = input.required<number>();
  criticalValue = input.required<number>();
  hypothesisTestResult = computed(() => {
    const isLower = this.calculatedKs() < this.criticalValue();
    return `Para los grados de libertad especificados (${this.degreesOfFreedom()}) y el nivel de significancia utilizado
  (${this.significantLevel()}), el valor crítico es ${this.criticalValue()}. Como el estadístico de prueba calculado (${this.calculatedKs()})
  es ${isLower ? 'menor' : 'mayor'} al valor crítico, se concluye que ${
      isLower ? 'no se puede rechazar la hipótesis nula' : 'se rechaza la hipótesis nula'
    }.`;
  });
}
