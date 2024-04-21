import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { tap } from 'rxjs';

import { RouterActions } from '../actions/router.actions';

const navigate$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(RouterActions.go),
      tap(({ path, query: queryParams, extras }) => router.navigate(path, { queryParams, ...extras }))
    ),
  { functional: true, dispatch: false }
);

const navigateBack$ = createEffect(
  (actions$ = inject(Actions), location = inject(Location)) =>
    actions$.pipe(
      ofType(RouterActions.back),
      tap(() => location.back())
    ),
  { functional: true, dispatch: false }
);

const navigateForward$ = createEffect(
  (actions$ = inject(Actions), location = inject(Location)) =>
    actions$.pipe(
      ofType(RouterActions.forward),
      tap(() => location.forward())
    ),
  { functional: true, dispatch: false }
);

export const RouterEffects = { navigate$, navigateBack$, navigateForward$ };
