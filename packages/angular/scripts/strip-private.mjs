#!/usr/bin/env node
/**
 * Removes the `private: true` flag from the ng-packagr-emitted
 * dist/package.json so the dist tarball is publishable.
 *
 * Background: we set `private: true` in the source package.json so that
 * `npm publish --workspaces` (run at the repo root during release) skips
 * the source folder. ng-packagr copies the source manifest's fields when
 * writing dist/package.json — including `private` — which would also
 * block publishing from dist/. This script peels it back off after the
 * library build completes.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_PKG = resolve(__dirname, '..', 'dist', 'package.json');

const pkg = JSON.parse(readFileSync(DIST_PKG, 'utf8'));
if (pkg.private) {
  delete pkg.private;
  writeFileSync(DIST_PKG, JSON.stringify(pkg, null, 2) + '\n');
  console.log('Stripped `private` field from dist/package.json');
} else {
  console.log('dist/package.json already public — nothing to strip');
}
