import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

/**
 * Vite + Analog config for the @nysds/angular smoke-test harness.
 *
 * The Analog plugin compiles Angular standalone components and template syntax
 * without requiring the Angular CLI / ng-packagr scaffolding.
 */
export default defineConfig({
  plugins: [angular()],
  server: {
    port: 4321,
    strictPort: true,
  },
  preview: {
    port: 4321,
    strictPort: true,
  },
});
