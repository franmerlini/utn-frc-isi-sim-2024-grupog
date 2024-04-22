import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
PlotlyModule.plotlyjs = PlotlyJS;

import { ToastActions } from '@grupog/libs/shared/data-access/store';
import { Distribution, Simulation } from '@grupog/libs/shared/models';
import { SimulationActions, SimulationFeature } from '@grupog/libs/simulation/data-access/store';
import { IntervalsTableComponent } from '@grupog/libs/simulation/ui/intervals-table';
import { ParametersFormComponent } from '@grupog/libs/simulation/ui/parameters-form';
import { RandomsTableComponent } from '@grupog/libs/simulation/ui/randoms-table';

@Component({
  selector: 'gg-simulation',
  standalone: true,
  imports: [ParametersFormComponent, AsyncPipe, RandomsTableComponent, IntervalsTableComponent, PlotlyModule, JsonPipe],
  template: `
    <div class="flex flex-col gap-8">
      <gg-parameters-form (simulate)="onSimulate($event)" (reset)="onReset($event)" (formError)="onFormError($event)" />

      @if(randomNumbers$ | async; as randomNumbers) { @if(randomNumbers.length) {
      <gg-randoms-table [randomNumbers]="randomNumbers" />
      } } @if(intervals$ | async; as intervals) { @if(intervals.length) {
      <gg-intervals-table [intervals]="intervals" />
      } } @if(graph$ | async; as graph) { @if( graph?.data && graph?.layout) {
      <plotly-plot [data]="getStructuredClone(graph.data)" [layout]="getStructuredClone(graph.layout)"></plotly-plot>
      } }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationComponent {
  #store = inject(Store);

  randomNumbers$ = this.#store.select(SimulationFeature.selectRandomNumbers);
  intervals$ = this.#store.select(SimulationFeature.selectIntervals);
  graph$ = this.#store.select(SimulationFeature.selectGraph);

  onSimulate(parameters: Simulation): void {
    this.#store.dispatch(SimulationActions.runSimulation({ parameters }));
  }

  onReset(distribution: Distribution): void {
    this.#store.dispatch(SimulationActions.resetSimulation({ distribution }));
  }

  onFormError(message: string): void {
    this.#store.dispatch(ToastActions.toastError({ summary: 'Error', detail: message }));
  }

  getStructuredClone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
