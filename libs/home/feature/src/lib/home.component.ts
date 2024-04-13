import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gg-home',
  standalone: true,
  imports: [],
  template: `<p>home works!</p>`,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
