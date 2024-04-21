import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import { ToastActions } from '@grupog/libs/shared/data-access/store';
import { Simulation } from '@grupog/libs/shared/models';
import { SimulationActions, SimulationFeature } from '@grupog/libs/simulation/data-access/store';
import { IntervalsTableComponent } from '@grupog/libs/simulation/ui/intervals-table';
import { ParametersFormComponent } from '@grupog/libs/simulation/ui/parameters-form';
import { RandomsTableComponent } from '@grupog/libs/simulation/ui/randoms-table';

@Component({
  selector: 'gg-simulation',
  standalone: true,
  imports: [ParametersFormComponent, AsyncPipe, RandomsTableComponent, IntervalsTableComponent],
  template: `
    <div class="flex flex-col gap-8">
      <gg-parameters-form (simulate)="onSimulate($event)" (formError)="onFormError($event)" />

      @if(randomNumbers$ | async; as randomNumbers) { @if(randomNumbers.length) {
      <gg-randoms-table [randomNumbers]="randomNumbers" />
      } } @if(intervals$ | async; as intervals) { @if(intervals.length) {
      <gg-intervals-table [intervals]="intervals" />
      } }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationComponent {
  #store = inject(Store);

  randomNumbers$ = this.#store.select(SimulationFeature.selectRandomNumbers);
  intervals$ = this.#store.select(SimulationFeature.selectIntervals);

  onSimulate(parameters: Simulation): void {
    this.#store.dispatch(SimulationActions.runSimulation({ parameters }));
  }

  onFormError(message: string): void {
    this.#store.dispatch(ToastActions.toastError({ summary: 'Error', detail: message }));
  }
}
