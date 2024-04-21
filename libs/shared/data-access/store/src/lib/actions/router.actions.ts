import { NavigationExtras } from '@angular/router';

import { createActionGroup, emptyProps } from '@ngrx/store';

export const RouterActions = createActionGroup({
  source: 'Router',
  events: {
    Go: (path: unknown[], query?: object, extras?: NavigationExtras) => ({
      path,
      query,
      extras,
    }),
    Back: emptyProps(),
    Forward: emptyProps(),
  },
});
