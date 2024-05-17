import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  MonteCarloSimulationActions,
  MonteCarloSimulationFeature,
} from '@grupog/libs/monte-carlo-simulation/data-access/store';
import { ParametersFormComponent } from '@grupog/libs/monte-carlo-simulation/ui/parameters-form';
import { SimulationTableComponent } from '@grupog/libs/monte-carlo-simulation/ui/simulation-table';
import { ToastActions } from '@grupog/libs/shared/data-access/store';
import { MonteCarloSimulation } from '@grupog/libs/shared/models';

@Component({
  selector: 'gg-monte-carlo-simulation',
  standalone: true,
  imports: [ParametersFormComponent, AsyncPipe, SimulationTableComponent],
  template: `
    <div class="flex flex-col gap-8">
      <gg-parameters-form
        (submitForm)="onSubmitForm($event)"
        (resetForm)="onResetForm()"
        (formError)="onFormError($event)"
      />

      @if(monteCarloSimulationRows$ | async; as monteCarloSimulationRows) { @if(monteCarloSimulationRows.length) {
      <gg-simulation-table [monteCarloSimulationRows]="monteCarloSimulationRows" />
      } }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonteCarloSimulationComponent {
  #store = inject(Store);

  monteCarloSimulationRows$ = this.#store.select(MonteCarloSimulationFeature.selectMonteCarloSimulationRows);

  onSubmitForm(parameters: MonteCarloSimulation): void {
    this.#store.dispatch(MonteCarloSimulationActions.runMonteCarloSimulation({ parameters }));
  }

  onResetForm(): void {
    this.#store.dispatch(MonteCarloSimulationActions.resetMonteCarloSimulation());
  }

  onFormError(message: string): void {
    this.#store.dispatch(ToastActions.toastError({ summary: 'Error', detail: message }));
  }
}
