import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import { toSignal } from '@angular/core/rxjs-interop';
import { QueueSimulationActions, QueueSimulationFeature } from '@grupog/libs/queue-simulation/data-access/store';
import { ParametersFormComponent } from '@grupog/libs/queue-simulation/ui/parameters-form';
import { SimulationTableComponent } from '@grupog/libs/queue-simulation/ui/simulation-table';
import { ToastActions } from '@grupog/libs/shared/data-access/store';
import { QueueSimulation } from '@grupog/libs/shared/models';

@Component({
  selector: 'gg-queue-simulation',
  standalone: true,
  imports: [ParametersFormComponent, SimulationTableComponent],
  template: `
    <div class="flex flex-col gap-8">
      <gg-parameters-form
        (submitForm)="onSubmitForm($event)"
        (resetForm)="onResetForm()"
        (formError)="onFormError($event)"
      />

      @if(queueSimulationRows().length) {
      <gg-simulation-table [queueSimulationRows]="queueSimulationRows()" />
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
