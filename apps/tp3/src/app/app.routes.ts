import { Route } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import {
  MonteCarloSimulationEffects,
  MonteCarloSimulationFeature,
} from '@grupog/libs/monte-carlo-simulation/data-access/store';
import { MonteCarloSimulationService } from '@grupog/libs/shared/util';
import { LayoutComponent } from '@grupog/libs/shell/ui/layout';

export const ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@grupog/libs/home/feature').then((c) => c.HomeComponent),
        data: { theme: 'TP3 - Modelos de simulación estáticos', dueDate: new Date('2024-05-15') },
      },
      {
        path: 'enunciado',
        loadComponent: () => import('@grupog/libs/assignment/feature').then((c) => c.AssignmentComponent),
      },
      {
        path: 'simulacion',
        loadComponent: () =>
          import('@grupog/libs/monte-carlo-simulation/feature').then((c) => c.MonteCarloSimulationComponent),
        providers: [
          MonteCarloSimulationService,
          provideState(MonteCarloSimulationFeature),
          provideEffects(MonteCarloSimulationEffects),
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
