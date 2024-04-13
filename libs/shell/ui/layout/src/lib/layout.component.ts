import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@grupog/libs/shell/ui/header';

@Component({
  selector: 'gg-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <div class="h-screen flex flex-column">
      <gg-header />

      <main class="flex-1 flex justify-content-center py-8 px-4">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
