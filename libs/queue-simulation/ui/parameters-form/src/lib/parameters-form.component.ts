import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gg-parameters-form',
  standalone: true,
  imports: [],
  template: `<p>parameters-form works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParametersFormComponent {}
