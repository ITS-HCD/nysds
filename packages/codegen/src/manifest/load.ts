import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import type { Manifest, ManifestModule } from "./types.js";

/**
 * Loads and validates a custom elements manifest.
 *
 * Without an argument, resolves the manifest that ships with
 * `@nysds/components`. The root package's `exports` map doesn't expose
 * `./custom-elements.json` as a subpath, so resolution goes through the
 * package entry point and walks up to the package root.
 */
export function loadManifest(manifestPath?: string): Manifest {
  const resolved = manifestPath ?? defaultManifestPath();
  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(resolved, "utf8"));
  } catch (error) {
    throw new Error(
      `Cannot read manifest at ${resolved}: ${(error as Error).message}`
    );
  }
  return validateManifest(raw, resolved);
}

function defaultManifestPath(): string {
  const require = createRequire(import.meta.url);
  let entry: string;
  try {
    entry = require.resolve("@nysds/components");
  } catch {
    throw new Error(
      "Cannot resolve @nysds/components. Install it, or pass an explicit manifest path to loadManifest()."
    );
  }
  let dir = path.dirname(entry);
  for (let depth = 0; depth < 4; depth += 1) {
    const candidate = path.join(dir, "custom-elements.json");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    `Found @nysds/components at ${entry} but no custom-elements.json near it. Pass an explicit manifest path to loadManifest().`
  );
}

/** Light structural validation: enough to fail fast on the wrong file. */
function validateManifest(raw: unknown, source: string): Manifest {
  if (typeof raw !== "object" || raw === null) {
    throw new Error(`${source} is not a custom elements manifest: not an object.`);
  }
  const manifest = raw as { modules?: unknown };
  if (!Array.isArray(manifest.modules)) {
    throw new Error(
      `${source} is not a custom elements manifest: missing "modules" array.`
    );
  }
  for (const mod of manifest.modules) {
    const candidate = mod as ManifestModule;
    if (typeof candidate?.path !== "string") {
      throw new Error(
        `${source} is not a custom elements manifest: a module has no "path".`
      );
    }
    if (
      candidate.declarations !== undefined &&
      !Array.isArray(candidate.declarations)
    ) {
      throw new Error(
        `${source} is not a custom elements manifest: "declarations" of ${candidate.path} is not an array.`
      );
    }
  }
  return raw as Manifest;
}
