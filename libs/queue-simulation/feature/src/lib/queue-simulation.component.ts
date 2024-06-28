import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import { toSignal } from '@angular/core/rxjs-interop';
import { QueueSimulationActions, QueueSimulationFeature } from '@grupog/libs/queue-simulation/data-access/store';
import { ParametersFormComponent } from '@grupog/libs/queue-simulation/ui/parameters-form';
import { SimulationResultComponent } from '@grupog/libs/queue-simulation/ui/simulation-result';
import { SimulationTableComponent } from '@grupog/libs/queue-simulation/ui/simulation-table';
import { ToastActions } from '@grupog/libs/shared/data-access/store';
import { QueueSimulation } from '@grupog/libs/shared/models';

@Component({
  selector: 'gg-queue-simulation',
  standalone: true,
  imports: [ParametersFormComponent, SimulationResultComponent, SimulationTableComponent],
  template: `
    <div class="flex flex-col gap-8">
      <gg-parameters-form
        (submitForm)="onSubmitForm($event)"
        (resetForm)="onResetForm()"
        (formError)="onFormError($event)"
      />

      @if(queueSimulationRows().length) {
      <div class="flex flex-col gap-6">
        <h1 class="text-2xl font-bold underline">Resultados de simulación</h1>

        <gg-simulation-result [queueSimulationRows]="queueSimulationRows()" />

        <gg-simulation-table [queueSimulationRows]="queueSimulationRows()" />
      </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueSimulationComponent {
  #store = inject(Store);

  queueSimulationRows = toSignal(this.#store.select(QueueSimulationFeature.selectQueueSimulationRows), {
    initialValue: [],
  });

  onSubmitForm(parameters: QueueSimulation): void {
    this.#store.dispatch(QueueSimulationActions.runQueueSimulation({ parameters }));
  }

  onResetForm(): void {
    this.#store.dispatch(QueueSimulationActions.resetQueueSimulation());
  }

  onFormError(message: string): void {
    this.#store.dispatch(ToastActions.toastError({ summary: 'Error', detail: message }));
  }
}
