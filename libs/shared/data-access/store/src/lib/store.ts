import { ActionReducerMap } from '@ngrx/store';

import { RouterEffects } from './effects';
import * as fromRouter from './reducers/router.reducer';

interface State {
  [fromRouter.RouterFeatureKey]: fromRouter.State;
}

export const ROOT_REDUCERS: ActionReducerMap<State> = {
  [fromRouter.RouterFeatureKey]: fromRouter.reducer,
};

export const ROOT_EFFECTS = [RouterEffects];
