import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gg-simulation',
  standalone: true,
  imports: [],
  template: `<h1>Acá va el desarrollo del TP</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationComponent {}
