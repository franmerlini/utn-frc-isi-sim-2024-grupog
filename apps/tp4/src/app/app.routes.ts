import { Route } from '@angular/router';

import { QueueSimulationService } from '@grupog/libs/shared/util';
import { LayoutComponent } from '@grupog/libs/shell/ui/layout';

export const ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@grupog/libs/home/feature').then((c) => c.HomeComponent),
        data: { theme: 'TP4 - Modelos de simulación dinámicos', dueDate: new Date('2024-06-28') },
      },
      {
        path: 'enunciado',
        loadComponent: () => import('@grupog/libs/assignment/feature').then((c) => c.AssignmentComponent),
      },
      {
        path: 'simulacion',
        loadComponent: () => import('@grupog/libs/queue-simulation/feature').then((c) => c.QueueSimulationComponent),
        providers: [QueueSimulationService],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
