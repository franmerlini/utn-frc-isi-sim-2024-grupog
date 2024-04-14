import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'gg-header',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, RouterLink],
  template: `
    <p-toolbar>
      <div class="p-toolbar-group-start">
        <p-button label="Inicio" [link]="true" routerLink="/"></p-button>
        <p-button label="Enunciado" [link]="true" routerLink="enunciado"></p-button>
        <p-button label="Simulación" [link]="true" routerLink="simulacion"></p-button>
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
export class HeaderComponent {}
