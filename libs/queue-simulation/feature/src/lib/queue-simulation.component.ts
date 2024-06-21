import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-queue-simulation',
  standalone: true,
  imports: [],
  template: `<p>queue-simulation works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueSimulationComponent {}
