import { Route } from '@angular/router';

import { LayoutComponent } from '@grupog/libs/shell/ui/layout';

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
        path: 'simulacion',
        loadComponent: () => import('@grupog/libs/simulation/feature').then((c) => c.SimulationComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
