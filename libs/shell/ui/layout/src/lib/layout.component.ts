import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { HeaderComponent } from '@grupog/libs/shell/ui/header';
import { SidebarComponent } from '@grupog/libs/shell/ui/sidebar';

@Component({
  selector: 'gg-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, SidebarComponent, ToastModule],
  template: `
    <div class="h-screen flex flex-col">
      <gg-header [navItems]="navItems()" (openSidebar)="openSidebar.set(true)" />

      <gg-sidebar [navItems]="navItems()" [(openSidebar)]="openSidebar" />

      <main class="flex-1 flex justify-center px-4 md:px-12 lg:px-24 py-8">
        <div class="container">
          <p-toast />
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
