import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TableModule } from 'primeng/table';

import { ChiSquareTestInterval } from '@grupog/libs/shared/models';

@Component({
  selector: 'gg-chi-square-test-table',
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
          <th>C</th>
          <th>C acumulado</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-interval>
        <tr>
          <td>{{ interval.lowerBound }}</td>
          <td>{{ interval.upperBound }}</td>
          <td>{{ interval.observedFrequency }}</td>
          <td>{{ interval.expectedFrequency }}</td>
          <td>{{ interval.c }}</td>
          <td>{{ interval.accumulatedC }}</td>
        </tr>
      </ng-template>
    </p-table>

    <p class="mt-3">{{ hypothesisTestResult() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChiSquareTestTableComponent {
  intervals = input.required<ChiSquareTestInterval[]>();
  degreesOfFreedom = input.required<number>();
  significantLevel = input.required<number>();
  calculatedC = input.required<number>();
  criticalValue = input.required<number>();
  hypothesisTestResult = computed(() => {
    const isLower = this.calculatedC() < this.criticalValue();
    return `Para los grados de libertad especificados (${this.degreesOfFreedom()}) y el nivel de significancia seleccionado
  (${this.significantLevel()}), el valor crítico es ${this.criticalValue()}. Como el estadístico de prueba calculado (${this.calculatedC()})
  es ${isLower ? 'menor' : 'mayor'} al valor crítico, se concluye que ${
      isLower ? 'no se puede rechazar la hipótesis nula' : 'se rechaza la hipótesis nula'
    }.`;
  });
}
