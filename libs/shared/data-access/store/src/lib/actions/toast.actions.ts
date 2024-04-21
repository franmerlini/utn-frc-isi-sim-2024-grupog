import { createActionGroup, props } from '@ngrx/store';

export const ToastActions = createActionGroup({
  source: 'Toast',
  events: {
    'Toast Error': props<{ summary: string; detail: string }>(),
    'Toast Info': props<{ summary: string; detail: string }>(),
    'Toast Success': props<{ summary: string; detail: string }>(),
    'Toast Warning': props<{ summary: string; detail: string }>(),
  },
});
