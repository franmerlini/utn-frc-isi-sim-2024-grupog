import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { map } from 'rxjs';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

import { SidebarComponent } from '@grupog/libs/shell/ui/sidebar';

@Component({
  selector: 'gg-header',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, RouterLink, SidebarComponent],
  template: `
    <p-toolbar>
      <div class="p-toolbar-group-start">
        @if (isSmallScreen()) {
        <p-button icon="pi pi-bars" [text]="true" (click)="openSidebar.emit()"></p-button>
        } @else { @for (navItem of navItems(); track navItem.label) {
        <p-button [label]="navItem.label" [link]="true" [routerLink]="navItem.routerLink"></p-button>
        } }
      </div>

      <div class="p-toolbar-group-end">
        <a href="https://github.com/franmerlini/utn-frc-isi-sim-2024-grupog" target="_blank">
          <p-button label="Github" icon="pi pi-github"></p-button>
        </a>
      </div>
    </p-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  navItems = input.required<MenuItem[]>();
  openSidebar = output();

  isSmallScreen = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 640px)')
      .pipe(map(({ matches }) => matches))
  );
}
