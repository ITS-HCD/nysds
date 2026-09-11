import type { Provider, EnvironmentProviders } from "@angular/core";

/**
 * Default build: zone.js change detection (the polyfill loads from
 * angular.json). The `zoneless` configuration swaps this file for
 * `cd-providers.zoneless.ts`.
 */
export const changeDetectionProviders: (Provider | EnvironmentProviders)[] =
  [];
