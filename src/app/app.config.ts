import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  LOCALE_ID,
  ENVIRONMENT_INITIALIZER,
  inject,
  APP_INITIALIZER,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';

import { provideQuillConfig } from 'ngx-quill';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
  // components: {
  //   button: {
  //     root: {
  //       borderRadius: '0px',
  //     },
  //   },
  // },
});

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');

import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { ToastMessageService } from './core/services/toast-message.service';
import { AuthService } from './core/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, httpErrorInterceptor])
    ),
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(AuthService),
      multi: true,
    },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(ToastMessageService),
      multi: true,
    },
    // provideQuillConfig({
    //   modules: {
    //     toolbar: [
    //       ['bold'],
    //       [{ list: 'ordered' }, { list: 'bullet' }],
    //       [{ color: [] }, { background: [] }],
    //       [{ align: [] }],
    //     ],
    //   },
    // }),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: 'es',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
