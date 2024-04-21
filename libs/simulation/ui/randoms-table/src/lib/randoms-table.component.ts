import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TableModule } from 'primeng/table';

@Component({
  selector: 'gg-randoms-table',
  standalone: true,
  imports: [TableModule],
  template: `
    <p-table
      [value]="randomNumbers()"
      [paginator]="true"
      [rows]="10"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
      [rowsPerPageOptions]="[10, 15, 20]"
      styleClass="p-datatable-sm p-datatable-striped"
    >
      <ng-template pTemplate="header">
        <tr>
          <th style="width:25%">N</th>
          <th>RND</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-number let-rowIndex="rowIndex">
        <tr>
          <td>{{ rowIndex + 1 }}</td>
          <td>{{ number }}</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomsTableComponent {
  randomNumbers = input.required<number[]>();
}
