import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gg-simulation-table',
  standalone: true,
  imports: [],
  template: `<p>simulation-table works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationTableComponent {}
