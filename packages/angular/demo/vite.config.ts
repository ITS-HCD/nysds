import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Vite + Analog config for the @nysds/angular demo app.
 *
 * `tsconfig` is passed explicitly because Analog defaults to `tsconfig.app.json`
 * (Angular CLI's convention) — we only ship a single `tsconfig.json` here.
 */
export default defineConfig({
  plugins: [
    angular({
      tsconfig: resolve(__dirname, 'tsconfig.json'),
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
});
