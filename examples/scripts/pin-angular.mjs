#!/usr/bin/env node
// Pins an example app's Angular toolchain to a major version.
//
// Usage: node examples/scripts/pin-angular.mjs <major> <workspace-dir> [more-dirs...]
// Example: node examples/scripts/pin-angular.mjs 21 examples/angular-app
//
// Installs every @angular/* package the app uses at the requested major,
// plus the TypeScript version that @angular/compiler-cli's peer range
// asks for. Run it from the repo root. The install goes through the
// root workspace so the lockfile stays consistent.

import { execSync } from "node:child_process";

const [major, ...dirs] = process.argv.slice(2);

if (!major || !/^\d+$/.test(major) || dirs.length === 0) {
  console.error(
    "Usage: node examples/scripts/pin-angular.mjs <major> <workspace-dir> [more-dirs...]",
  );
  process.exit(1);
}

const ANGULAR_PACKAGES = [
  "@angular/core",
  "@angular/common",
  "@angular/forms",
  "@angular/router",
  "@angular/platform-browser",
  "@angular/compiler",
  "@angular/compiler-cli",
  "@angular/cli",
  "@angular/build",
];

function sh(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: ["ignore", "pipe", "inherit"] })
    .toString()
    .trim();
}

// Ask the registry which TypeScript range this Angular major wants.
const tsRange = sh(
  `npm view @angular/compiler-cli@^${major} peerDependencies.typescript --json`,
);
// npm view with a range can return one string or an array; take the last.
let tsSpec = "latest";
try {
  const parsed = JSON.parse(tsRange);
  const range = Array.isArray(parsed) ? parsed[parsed.length - 1] : parsed;
  // Use the upper-compatible end of the range: install the max satisfying
  // version by passing the range straight to npm.
  tsSpec = `"${range}"`;
} catch {
  console.warn("Could not parse TypeScript peer range; using latest.");
}

const specs = [
  ...ANGULAR_PACKAGES.map((p) => `${p}@^${major}`),
  `typescript@${tsSpec}`,
].join(" ");
const workspaces = dirs.map((d) => `-w ${d}`).join(" ");

execSync(`npm install --no-audit --no-fund ${workspaces} ${specs}`, {
  stdio: "inherit",
});

console.log(`Pinned ${dirs.join(", ")} to Angular ${major}.`);
