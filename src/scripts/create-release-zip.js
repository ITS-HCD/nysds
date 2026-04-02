#!/usr/bin/env node

/**
 * create-release-zip.js
 * Assembles a Release folder from dist outputs and zips it at the project root.
 * Run from: src/scripts/create-release-zip.js
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Resolve paths
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script lives at <root>/src/scripts/create-release-zip.js
// So root is two levels up.
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");

const SOURCES = {
  components: path.join(PROJECT_ROOT, "dist"),
  styles: path.join(PROJECT_ROOT, "packages", "styles", "dist"),
  tokens: path.join(PROJECT_ROOT, "packages", "tokens", "dist"),
  react: path.join(PROJECT_ROOT, "packages", "react"),
};

const RELEASE_DIR = path.join(PROJECT_ROOT, "release");
const ZIP_PATH = path.join(PROJECT_ROOT, "release.zip");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively copy a directory's contents from src to dest.
 * Creates dest if it doesn't exist.
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source not found, skipping: ${src}`);
    return 0;
  }

  fs.mkdirSync(dest, { recursive: true });

  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }

  return count;
}

/**
 * Delete a path (file or directory) if it exists.
 */
function removePath(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("Creating release...\n");

// 1. Clean up any previous Release folder and zip
console.log("Cleaning previous release artifacts...");
removePath(RELEASE_DIR);
removePath(ZIP_PATH);

// 2. Copy each source into its Release sub-folder
for (const [folder, srcDir] of Object.entries(SOURCES)) {
  const destDir = path.join(RELEASE_DIR, folder);
  console.log(`Copying ${folder}...`);
  console.log(`   ${srcDir}`);
  console.log(`   → ${destDir}`);
  const count = copyDir(srcDir, destDir);
  console.log(`     ${count} file(s) copied\n`);
}

// 3. Zip the Release folder
console.log(`Zipping Release/ → release.zip`);

// Use the native zip command (available on macOS/Linux).
// The -r flag recurses into subdirectories; -q keeps output quiet.
// We cd to the project root first so the zip paths are relative.
execSync(`zip -rq "${ZIP_PATH}" release`, { cwd: PROJECT_ROOT });

const zipSizeKB = (fs.statSync(ZIP_PATH).size / 1024).toFixed(1);
console.log(`release.zip created (${zipSizeKB} KB)`);
console.log(`   ${ZIP_PATH}\n`);

console.log("Done!");