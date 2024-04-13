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
        <p-button label="TP2" routerLink="/"></p-button>
      </div>

      <div class="p-toolbar-group-center">
        <p-button label="Enunciado" [link]="true" routerLink="enunciado"></p-button>
        <p-button label="Simulación" [link]="true" routerLink="simulacion"></p-button>
      </div>

      <div class="p-toolbar-group-end">
        <p-button label="Github" icon="pi pi-github"></p-button>
      </div>
    </p-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
