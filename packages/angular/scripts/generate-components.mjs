#!/usr/bin/env node
/**
 * Standalone CLI wrapper around the Angular wrapper-component generator.
 *
 * The generation logic now lives in `cem-angular-plugin.mjs`, which runs
 * automatically during `npm run cem` (wired into
 * `custom-elements-manifest.config.mjs`). This script lets you regenerate the
 * wrappers on their own — reading the already-built `custom-elements.json` from
 * the repo root — without re-running a full CEM analysis.
 *
 * Usage: `npm run generate --workspace=@nysds/angular`
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { generateAngularComponents, reportResult } from './cem-angular-plugin.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..', '..');
const CEM_PATH = resolve(REPO_ROOT, 'custom-elements.json');

function main() {
  if (!existsSync(CEM_PATH)) {
    console.error(`custom-elements.json not found at ${CEM_PATH}`);
    console.error('Run `npm run cem` from the repo root first.');
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(CEM_PATH, 'utf8'));
  const result = generateAngularComponents(manifest);
  reportResult(result);
}

main();
