import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gg-simulation-result',
  standalone: true,
  template: `<p>simulation-ui-simulation-result works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationResultComponent {}
