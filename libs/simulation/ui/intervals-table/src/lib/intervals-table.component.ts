import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TableModule } from 'primeng/table';

import { Interval } from '@grupog/libs/shared/models';

@Component({
  selector: 'gg-intervals-table',
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
          <th>Marca de clase</th>
          <th>Frecuencia esperada</th>
          <th>Frecuencia observada</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-interval>
        <tr>
          <td>{{ interval.lowerBound }}</td>
          <td>{{ interval.upperBound }}</td>
          <td>{{ interval.classMark }}</td>
          <td>{{ interval.expectedFrequency }}</td>
          <td>{{ interval.observedFrequency }}</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalsTableComponent {
  intervals = input.required<Interval[]>();
}
