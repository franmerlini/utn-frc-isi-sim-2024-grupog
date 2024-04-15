import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@grupog/libs/shell/ui/header';

@Component({
  selector: 'gg-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <div class="h-screen flex flex-col">
      <gg-header />

      <main class="flex-1 flex justify-center px-2 pt-8">
        <div class="container">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
