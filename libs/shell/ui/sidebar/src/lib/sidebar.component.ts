import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'gg-sidebar',
  standalone: true,
  imports: [SidebarModule],
  template: `
    <p-sidebar [(visible)]="openSidebar()">
      <h3>Sidebar</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>
    </p-sidebar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  openSidebar = input(false);
}
