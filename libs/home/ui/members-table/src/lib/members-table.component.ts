import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TableModule } from 'primeng/table';

@Component({
  selector: 'gg-members-table',
  standalone: true,
  imports: [TableModule],
  template: `
    <p-table [value]="members()">
      <ng-template pTemplate="header">
        <tr>
          <th>Legajo</th>
          <th>Apellido y Nombre</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-member>
        <tr>
          <td>{{ member.id }}</td>
          <td>{{ member.name }}</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersTableComponent {
  members = input.required<any[]>();
}
