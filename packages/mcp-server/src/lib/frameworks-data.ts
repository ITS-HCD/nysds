/**
 * Framework package index
 *
 * Reads `data/frameworks.json`, written by `scripts/sync-guides.mjs` from
 * `packages/react/package.json` and `packages/angular/package.json`. Gives
 * tools and resources the published package name and version without
 * hand-maintaining either.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface FrameworkPackageInfo {
  packageName: string;
  version: string;
}

export interface FrameworksIndex {
  react: FrameworkPackageInfo;
  angular: FrameworkPackageInfo;
}

let cached: FrameworksIndex | null = null;

function getFrameworksDataPath(): string {
  const candidates = [
    resolve(__dirname, "../../data/frameworks.json"),
    resolve(process.cwd(), "data/frameworks.json"),
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  throw new Error(
    `data/frameworks.json not found. Searched paths:\n${candidates.join("\n")}`,
  );
}

export function getFrameworksIndex(): FrameworksIndex {
  if (cached) return cached;
  try {
    cached = JSON.parse(
      readFileSync(getFrameworksDataPath(), "utf-8"),
    ) as FrameworksIndex;
  } catch (error) {
    console.error("Warning: Could not load data/frameworks.json:", error);
    cached = {
      react: { packageName: "@nysds/react", version: "unknown" },
      angular: { packageName: "@nysds/angular", version: "unknown" },
    };
  }
  return cached;
}
