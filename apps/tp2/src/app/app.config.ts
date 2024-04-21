import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { MessageService } from 'primeng/api';

import { CustomSerializer, ROOT_EFFECTS, ROOT_REDUCERS, RouterFeatureKey } from '@grupog/libs/shared/data-access/store';

import { ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(ROUTES),
    provideAnimationsAsync(),
    provideStore(ROOT_REDUCERS),
    provideEffects(ROOT_EFFECTS),
    provideRouterStore({
      stateKey: RouterFeatureKey,
      serializer: CustomSerializer,
    }),
    provideStoreDevtools({ logOnly: !isDevMode() }),
    MessageService,
  ],
};
