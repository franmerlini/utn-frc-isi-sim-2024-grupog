import { Params, RouterStateSnapshot } from '@angular/router';

import { RouterStateSerializer, routerReducer } from '@ngrx/router-store';

export const RouterFeatureKey = 'router';

export interface State {
  state: RouterStateUrl;
  navigationId: number;
}

export const reducer = routerReducer;

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    return { url, params, queryParams };
  }
}
