import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'gg-members-table',
  standalone: true,
  imports: [],
  template: `
    <table class="max-w-20rem">
      <body>
        @for (member of members(); track member.id) {
        <tr>
          <td class="pr-3">{{ member.id }}</td>
          <td>{{ member.name }}</td>
        </tr>
        }
      </body>
    </table>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersTableComponent {
  members = input.required<any[]>();
}
