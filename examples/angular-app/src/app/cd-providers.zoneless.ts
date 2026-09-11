import { provideZonelessChangeDetection } from "@angular/core";
import type { Provider, EnvironmentProviders } from "@angular/core";

/** Zoneless build: no zone.js polyfill, signal-driven change detection. */
export const changeDetectionProviders: (Provider | EnvironmentProviders)[] = [
  provideZonelessChangeDetection(),
];
