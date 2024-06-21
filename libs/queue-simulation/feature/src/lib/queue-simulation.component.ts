import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gg-queue-simulation',
  standalone: true,
  imports: [],
  template: `<p>queue-simulation works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueSimulationComponent {}
