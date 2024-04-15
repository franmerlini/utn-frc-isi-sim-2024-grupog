import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MenuItem } from 'primeng/api';

import { HeaderComponent } from '@grupog/libs/shell/ui/header';
import { SidebarComponent } from '@grupog/libs/shell/ui/sidebar';

@Component({
  selector: 'gg-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, SidebarComponent],
  template: `
    <div class="h-screen flex flex-col">
      <gg-header [navItems]="navItems()" (openSidebar)="openSidebar.set(true)" />

      <gg-sidebar [navItems]="navItems()" [(openSidebar)]="openSidebar" />

      <main class="flex-1 flex justify-center px-2 pt-8">
        <div class="container">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  openSidebar = signal(false);
  navItems = signal<MenuItem[]>([
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Enunciado',
      icon: 'pi pi-list-check',
      routerLink: 'enunciado',
    },
    {
      label: 'Simulación',
      icon: 'pi pi-play',
      routerLink: 'simulacion',
    },
  ]);
}
