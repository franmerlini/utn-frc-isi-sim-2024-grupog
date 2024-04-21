import { inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { tap } from 'rxjs';

import { ToastService } from '@grupog/libs/shared/util';

import { ToastActions } from '../actions/toast.actions';

const toastError$ = createEffect(
  (actions$ = inject(Actions), toastService = inject(ToastService)) =>
    actions$.pipe(
      ofType(ToastActions.toastError),
      tap(({ summary, detail }) => toastService.error(summary, detail))
    ),
  { functional: true, dispatch: false }
);

const toastInfo$ = createEffect(
  (actions$ = inject(Actions), toastService = inject(ToastService)) =>
    actions$.pipe(
      ofType(ToastActions.toastInfo),
      tap(({ summary, detail }) => toastService.info(summary, detail))
    ),
  { functional: true, dispatch: false }
);

const toastSuccess$ = createEffect(
  (actions$ = inject(Actions), toastService = inject(ToastService)) =>
    actions$.pipe(
      ofType(ToastActions.toastSuccess),
      tap(({ summary, detail }) => toastService.success(summary, detail))
    ),
  { functional: true, dispatch: false }
);

const toastWarning$ = createEffect(
  (actions$ = inject(Actions), toastService = inject(ToastService)) =>
    actions$.pipe(
      ofType(ToastActions.toastWarning),
      tap(({ summary, detail }) => toastService.warning(summary, detail))
    ),
  { functional: true, dispatch: false }
);

export const ToastEffects = { toastError$, toastInfo$, toastSuccess$, toastWarning$ };
