import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'gg-sidebar',
  standalone: true,
  imports: [SidebarModule, MenuModule],
  template: `
    <p-sidebar [(visible)]="openSidebar">
      <p-menu [model]="navItems()" (click)="openSidebar.set(false)"></p-menu>
    </p-sidebar>
  `,
  styles: [
    `
      ::ng-deep p-menu {
        width: 100%;
        .p-menu {
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  openSidebar = model(false);
  navItems = input.required<MenuItem[]>();
}
