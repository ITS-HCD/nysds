#!/usr/bin/env node
/**
 * Syncs the framework guides and the framework package index from the
 * published source of truth: each framework package's own README.md and
 * package.json. One source (the package README), two surfaces (npm and the
 * MCP guide) — this script is the only thing that copies content between
 * them, so the guides never drift into hand-edited duplicates.
 *
 * Run via `npm run sync:guides -w @nysds/mcp-server`, and as part of
 * `npm run build -w @nysds/mcp-server`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MCP_ROOT = join(__dirname, "..");
const REPO_ROOT = join(MCP_ROOT, "../..");
const GUIDES_DIR = join(MCP_ROOT, "data/guides/frameworks");
const DATA_DIR = join(MCP_ROOT, "data");

/** @type {Array<{ id: "react" | "angular"; packageDir: string }>} */
const FRAMEWORK_PACKAGES = [
  { id: "react", packageDir: join(REPO_ROOT, "packages/react") },
  { id: "angular", packageDir: join(REPO_ROOT, "packages/angular") },
];

function readPackageJson(packageDir) {
  return JSON.parse(readFileSync(join(packageDir, "package.json"), "utf-8"));
}

/**
 * A hand-maintained `<id>-additions.md` next to this script's output, when
 * present, is appended after the synced README under its own heading. It's
 * the escape hatch for guidance that belongs in the MCP guide but not in the
 * npm package README (e.g. AI-assistant-specific patterns) — never a place
 * to duplicate what the README already says.
 */
function readAdditions(id) {
  const path = join(GUIDES_DIR, `${id}-additions.md`);
  return existsSync(path) ? readFileSync(path, "utf-8").trim() : undefined;
}

function syncGuide({ id, packageDir }) {
  const pkg = readPackageJson(packageDir);
  const readme = readFileSync(join(packageDir, "README.md"), "utf-8").trimEnd();
  const additions = readAdditions(id);

  const header = [
    "<!--",
    "  GENERATED FILE. Do not edit directly.",
    `  Source: packages/${id}/README.md` +
      (additions ? ` + data/guides/frameworks/${id}-additions.md` : ""),
    `  Regenerate with: npm run sync:guides -w @nysds/mcp-server`,
    "-->",
    "",
  ].join("\n");

  const body = additions
    ? `${readme}\n\n## MCP guide additions\n\n${additions}\n`
    : `${readme}\n`;

  mkdirSync(GUIDES_DIR, { recursive: true });
  writeFileSync(join(GUIDES_DIR, `${id}.md`), header + body, "utf-8");
  console.log(`sync-guides: wrote data/guides/frameworks/${id}.md`);

  return { packageName: pkg.name, version: pkg.version };
}

const index = {};
for (const framework of FRAMEWORK_PACKAGES) {
  index[framework.id] = syncGuide(framework);
}

mkdirSync(DATA_DIR, { recursive: true });
writeFileSync(
  join(DATA_DIR, "frameworks.json"),
  JSON.stringify(index, null, 2) + "\n",
  "utf-8",
);
console.log("sync-guides: wrote data/frameworks.json");
