import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'gg-randoms-table',
  standalone: true,
  imports: [TableModule, ButtonModule],
  template: `
    <p-table
      [value]="randoms()"
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
  randoms = input.required<number[]>();
}
