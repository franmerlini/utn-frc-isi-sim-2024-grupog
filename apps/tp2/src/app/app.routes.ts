import { Route } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { ChiSquareTestService, KsTestService, SimulationService } from '@grupog/libs/shared/util';
import { LayoutComponent } from '@grupog/libs/shell/ui/layout';
import { SimulationEffects, SimulationFeature } from '@grupog/libs/simulation/data-access/store';

export const ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@grupog/libs/home/feature').then((c) => c.HomeComponent),
      },
      {
        path: 'enunciado',
        loadComponent: () => import('@grupog/libs/assignment/feature').then((c) => c.AssignmentComponent),
      },
      {
        path: 'simulacion',
        loadComponent: () => import('@grupog/libs/simulation/feature').then((c) => c.SimulationComponent),
        providers: [
          SimulationService,
          ChiSquareTestService,
          KsTestService,
          provideState(SimulationFeature),
          provideEffects(SimulationEffects),
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
