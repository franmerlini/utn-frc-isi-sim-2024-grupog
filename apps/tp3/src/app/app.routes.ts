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
        data: { theme: 'TP3 - Modelos de simulación estáticos', dueDate: new Date('2024-05-15') },
      },
      {
        path: 'enunciado',
        loadComponent: () => import('@grupog/libs/assignment/feature').then((c) => c.AssignmentComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
