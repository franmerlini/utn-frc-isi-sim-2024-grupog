import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import { ToastActions } from '@grupog/libs/shared/data-access/store';
import { Simulation } from '@grupog/libs/shared/models';
import { SimulationActions, SimulationFeature } from '@grupog/libs/simulation/data-access/store';
import { ParametersFormComponent } from '@grupog/libs/simulation/ui/parameters-form';
import { RandomsTableComponent } from '@grupog/libs/simulation/ui/randoms-table';

@Component({
  selector: 'gg-simulation',
  standalone: true,
  imports: [ParametersFormComponent, AsyncPipe, RandomsTableComponent],
  template: `
    <div class="flex flex-col gap-8">
      <gg-parameters-form (simulate)="onSimulate($event)" (formError)="onFormError($event)" />

      @if(randoms$ | async; as randoms) { @if(randoms.length) {
      <gg-randoms-table [randoms]="randoms" />
      } }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationComponent {
  #store = inject(Store);
  randoms$ = this.#store.select(SimulationFeature.selectRandomNumbers);

  onSimulate(parameters: Simulation): void {
    this.#store.dispatch(SimulationActions.runSimulation({ parameters }));
  }

  onFormError(message: string): void {
    this.#store.dispatch(ToastActions.toastError({ summary: 'Error', detail: message }));
  }
}
