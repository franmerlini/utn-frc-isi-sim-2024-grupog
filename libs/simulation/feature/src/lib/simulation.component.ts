import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import { ToastActions } from '@grupog/libs/shared/data-access/store';
import { Simulation } from '@grupog/libs/shared/models';
import { ParametersFormComponent } from '@grupog/libs/simulation/ui/parameters-form';

@Component({
  selector: 'gg-simulation',
  standalone: true,
  imports: [ParametersFormComponent],
  template: ` <gg-parameters-form (simulate)="onSimulate($event)" (formError)="onFormError($event)" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationComponent {
  #store = inject(Store);

  onSimulate(simulation: Simulation): void {
    console.log(simulation);
  }

  onFormError(message: string): void {
    this.#store.dispatch(ToastActions.toastError({ summary: 'Error', detail: message }));
  }
}
