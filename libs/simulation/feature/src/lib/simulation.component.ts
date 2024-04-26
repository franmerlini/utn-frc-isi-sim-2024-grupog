import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import { combineLatest } from 'rxjs';

import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
PlotlyModule.plotlyjs = PlotlyJS;

import { ToastActions } from '@grupog/libs/shared/data-access/store';
import { Distribution, Simulation } from '@grupog/libs/shared/models';
import { SimulationActions, SimulationFeature } from '@grupog/libs/simulation/data-access/store';
import { ChiSquareTestTableComponent } from '@grupog/libs/simulation/ui/chi-square-test-table';
import { IntervalsTableComponent } from '@grupog/libs/simulation/ui/intervals-table';
import { KsTestTableComponent } from '@grupog/libs/simulation/ui/ks-test-table';
import { ParametersFormComponent } from '@grupog/libs/simulation/ui/parameters-form';
import { RandomsTableComponent } from '@grupog/libs/simulation/ui/randoms-table';

@Component({
  selector: 'gg-simulation',
  standalone: true,
  imports: [
    ParametersFormComponent,
    AsyncPipe,
    RandomsTableComponent,
    IntervalsTableComponent,
    ChiSquareTestTableComponent,
    KsTestTableComponent,
    PlotlyModule,
    JsonPipe,
  ],
  template: `
    <div class="flex flex-col gap-8">
      <gg-parameters-form (simulate)="onSimulate($event)" (reset)="onReset($event)" (formError)="onFormError($event)" />

      @if(randomNumbers$ | async; as randomNumbers) { @if(randomNumbers.length) {
      <h2 class="text-xl font-bold">Números aleatorios</h2>
      <gg-randoms-table [randomNumbers]="randomNumbers" />
      } } @if(intervals$ | async; as intervals) { @if(intervals.length) {
      <h2 class="text-xl font-bold">Frecuencias y probabilidades</h2>
      <gg-intervals-table [intervals]="intervals" />
      @if (chiSquareTestData$ | async; as chiSquareTestData) {
      <h2 class="text-xl font-bold">Prueba de Chi Cuadrado</h2>
      <gg-chi-square-test-table
        [intervals]="chiSquareTestData.intervals"
        [degreesOfFreedom]="chiSquareTestData.chiSquareDegreesOfFreedom"
        [significantLevel]="chiSquareTestData.significanceLevel"
        [calculatedC]="chiSquareTestData.calculatedChiSquare"
        [criticalValue]="chiSquareTestData.criticalValue"
      />
      } } } @if(ksTestData$ | async; as ksTestData) { @if(ksTestData.intervals.length) {
      <h2 class="text-xl font-bold">Prueba de Kolmogorov-Smirnov</h2>
      <gg-ks-test-table
        [intervals]="ksTestData.intervals"
        [degreesOfFreedom]="ksTestData.ksDegreesOfFreedom"
        [significantLevel]="ksTestData.significanceLevel"
        [calculatedKs]="ksTestData.calculatedKs"
        [criticalValue]="ksTestData.criticalValue"
      />
      }} @if(graph$ | async; as graph) { @if( graph?.data && graph?.layout) {
      <h2 class="text-xl font-bold">Gráfico de distribución</h2>
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
  chiSquareTestData$ = combineLatest({
    intervals: this.#store.select(SimulationFeature.selectChiSquareTestIntervals),
    chiSquareDegreesOfFreedom: this.#store.select(SimulationFeature.selectChiSquareDegreesOfFreedom),
    significanceLevel: this.#store.select(SimulationFeature.selectSignificanceLevel),
    calculatedChiSquare: this.#store.select(SimulationFeature.selectCalculatedChiSquare),
    criticalValue: this.#store.select(SimulationFeature.selectChiSquareCriticalValue),
  });
  ksTestData$ = combineLatest({
    intervals: this.#store.select(SimulationFeature.selectKsTestIntervals),
    ksDegreesOfFreedom: this.#store.select(SimulationFeature.selectKsDegreesOfFreedom),
    significanceLevel: this.#store.select(SimulationFeature.selectSignificanceLevel),
    calculatedKs: this.#store.select(SimulationFeature.selectCalculatedKs),
    criticalValue: this.#store.select(SimulationFeature.selectKsCriticalValue),
  });

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
