import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'gg-header',
  standalone: true,
  imports: [ToolbarModule, ButtonModule],
  template: `
    <p-toolbar>
      <div class="p-toolbar-group-start">
        <p-button label="TP2"></p-button>
      </div>

      <div class="p-toolbar-group-center">
        <p-button label="Uniforme" [link]="true"></p-button>
        <p-button label="Exponencial" [link]="true"></p-button>
        <p-button label="Normal" [link]="true"></p-button>
      </div>

      <div class="p-toolbar-group-end">
        <p-button label="Github" icon="pi pi-github"></p-button>
      </div>
    </p-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
