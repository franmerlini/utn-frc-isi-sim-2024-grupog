import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ParametersFormComponent } from '@grupog/libs/simulation/ui/parameters-form';

@Component({
  selector: 'gg-simulation',
  standalone: true,
  imports: [ParametersFormComponent],
  template: ` <gg-parameters-form (simulate)="onSimulate($event)" (formError)="onFormError($event)" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationComponent {
  onSimulate(simulationParameters: any): void {
    console.log(simulationParameters);
  }

  onFormError(message: string): void {
    console.log(message);
  }
}
