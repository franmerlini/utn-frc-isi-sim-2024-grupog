import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
          <td>{{ interval.accumulatedExpectedFrequency }}</td>
          <td>{{ interval.accumulatedObservedFrequency }}</td>
          <td>{{ interval.deviation }}</td>
          <td>{{ interval.maxDeviation }}</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KsTestTableComponent {
  intervals = input.required<KsTestInterval[]>();
}
