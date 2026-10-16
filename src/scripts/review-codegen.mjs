// Shows what a change does to codegen output without committing generated
// files or touching your checkout.
//
// The framework wrappers in packages/*/src/generated/ are gitignored (decision
// L5), so a pull request diff never shows them. This script exports the base
// and head commits into a temporary directory, runs the same `cem analyze`
// step as `npm run cem` in each, and compares what codegen wrote. For every
// output that changed, it reports:
//   - what changed: a unified diff of the generated file
//   - what produced it: the codegen plugin and component source, or the
//     hand-written file in src/overrides/ that replaces the generated one
//   - whether the change is expected: the PR touched that component's source
//     or override (expected), only the generator (generator), or nothing that
//     explains it (check)
//
// Usage, from the repo root:
//   npm run review:codegen -- --pr 1951
//   npm run review:codegen -- --base origin/develop --head my-branch
//   npm run review:codegen -- --working-tree
//   npm run review:codegen -- --help
//
// Each run executes the codegen config and plugins from both commits. Run it
// only on code you'd be willing to check out and build.
import { execFileSync, spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const HELP = `Review codegen output for a change

Usage: npm run review:codegen -- [options]

Picking what to compare (the base is always the merge base, as on GitHub):
  --pr <number>       Compare a pull request with its base branch. Needs gh.
  --base <ref>        Base branch or commit. Default: origin/develop.
  --head <ref>        Head branch or commit. Default: HEAD.
  --working-tree      Use your working tree, including uncommitted and
                      untracked files, as the head.

Narrowing the report:
  --component <name>  Only this component. Accepts a tag (nys-avatar), a class
                      name (NysAvatar), or a subpath (avatar). Repeatable.
  --framework <name>  Only this package under packages/ (react, angular, vue).
                      Repeatable.
  --summary           Skip the diffs.

Running codegen:
  --install           Run npm ci in each snapshot instead of reusing this
                      checkout's node_modules. Slower, but exact when the
                      lockfile differs.
  --keep              Keep the snapshots and print where they are.

  -h, --help          Show this help.

Verdicts:
  expected   The PR changed this output's component source, override, or the
             file itself.
  generator  Only a codegen plugin, the CEM config, or the lockfile changed.
  check      Nothing in the PR explains the change. Look closely.

To page a long report and keep its colors:
  FORCE_COLOR=1 npm run review:codegen -- --pr 1951 | less -R
`;

const REMOTE = "origin";
const DEFAULT_BASE_BRANCH = "develop";

/** Used when a commit's `cem` npm script has no --config flag to read. */
const DEFAULT_CEM_CONFIG = "src/scripts/custom-elements-manifest.config.mjs";

/** `packages/<name>/src/generated/<file>`: a codegen-owned wrapper file. */
const GENERATED_RE = /^(packages\/[^/]+)\/src\/generated\/(.+)$/;

/** `packages/<name>/src/overrides/<file>`: a hand-written replacement. */
const OVERRIDE_RE = /^(packages\/[^/]+)\/src\/overrides\/(.+)$/;

/** Component files the CEM config excludes, so they can't change the manifest. */
const NON_MANIFEST_RE = /\.(test|stories|figma)\.ts$/;

/** A package's own package.json, the only file deps.mjs rewrites. */
const PACKAGE_MANIFEST_RE = /^packages\/[^/]+\/package\.json$/;

/** Bad flags or refs. Exits 1 with the message alone. */
class UsageError extends Error {}

/** A codegen or install step failed. Exits 2 with the message alone. */
class RunError extends Error {}

const useColor = process.env.FORCE_COLOR
  ? process.env.FORCE_COLOR !== "0"
  : Boolean(process.stdout.isTTY) && !("NO_COLOR" in process.env);
const paint = (code) => (text) =>
  useColor ? `\x1b[${code}m${text}\x1b[0m` : String(text);
const bold = paint(1);
const dim = paint(2);
const red = paint(31);
const green = paint(32);
const yellow = paint(33);
const cyan = paint(36);

const VERDICTS = {
  check: { label: "check", color: red, rank: 0 },
  generator: { label: "generator", color: yellow, rank: 1 },
  expected: { label: "expected", color: green, rank: 2 },
};

const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();

// ---------------------------------------------------------------------------
// Git and process helpers
// ---------------------------------------------------------------------------

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
}

function resolveCommit(ref) {
  try {
    return git(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]).trim();
  } catch {
    throw new UsageError(
      `Can't find "${ref}". Fetch it first, or check the spelling.`,
    );
  }
}

function mergeBase(a, b) {
  try {
    return git(["merge-base", a, b]).trim();
  } catch {
    throw new UsageError(`"${a}" and "${b}" share no history.`);
  }
}

function subject(commit) {
  return git(["log", "-1", "--format=%s", commit]).trim();
}

function refExists(ref) {
  try {
    git(["rev-parse", "--verify", "--quiet", ref]);
    return true;
  } catch {
    return false;
  }
}

function progress(message) {
  process.stderr.write(`${dim(message)}\n`);
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

const unique = (items) => [...new Set(items.filter(Boolean))];

const plural = (count, noun) => `${count} ${noun}${count === 1 ? "" : "s"}`;

// ---------------------------------------------------------------------------
// Options and refs
// ---------------------------------------------------------------------------

function readOptions() {
  let parsed;
  try {
    parsed = parseArgs({
      options: {
        pr: { type: "string" },
        base: { type: "string" },
        head: { type: "string" },
        "working-tree": { type: "boolean", default: false },
        component: { type: "string", multiple: true, default: [] },
        framework: { type: "string", multiple: true, default: [] },
        summary: { type: "boolean", default: false },
        install: { type: "boolean", default: false },
        keep: { type: "boolean", default: false },
        help: { type: "boolean", short: "h", default: false },
      },
    });
  } catch (error) {
    throw new UsageError(`${error.message}\n\n${HELP}`);
  }
  const options = parsed.values;
  if (options.pr && (options.base || options.head || options["working-tree"])) {
    throw new UsageError(
      "--pr picks both commits, so it can't be combined with --base, --head, or --working-tree.",
    );
  }
  if (options.head && options["working-tree"]) {
    throw new UsageError("Use --head or --working-tree, not both.");
  }
  if (options.pr && !/^\d+$/.test(options.pr)) {
    throw new UsageError(
      `--pr takes a pull request number, not "${options.pr}".`,
    );
  }
  return options;
}

/**
 * Resolves the two commits to compare. The base is the merge base of the base
 * branch and the head, which matches what GitHub shows as a PR's changes.
 */
function resolveRefs(options) {
  if (options.pr) return resolvePullRequest(options.pr);

  const workingTree = options["working-tree"];
  const headCommit = resolveCommit(options.head ?? "HEAD");
  const baseRef =
    options.base ??
    (refExists(`${REMOTE}/${DEFAULT_BASE_BRANCH}`)
      ? `${REMOTE}/${DEFAULT_BASE_BRANCH}`
      : DEFAULT_BASE_BRANCH);
  const base = mergeBase(resolveCommit(baseRef), headCommit);
  const headLabel = workingTree
    ? `working tree (${options.head ?? "HEAD"} plus uncommitted changes)`
    : `${options.head ?? "HEAD"} · ${subject(headCommit)}`;
  return {
    base,
    baseLabel: `merge base with ${baseRef}`,
    head: headCommit,
    headLabel,
    workingTree,
  };
}

function resolvePullRequest(number) {
  let info;
  try {
    info = JSON.parse(
      execFileSync(
        "gh",
        [
          "pr",
          "view",
          number,
          "--json",
          "number,title,url,state,baseRefName,headRefOid,mergeCommit",
        ],
        { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      ),
    );
  } catch (error) {
    const reason =
      error.code === "ENOENT" ? "gh isn't installed" : error.stderr?.trim();
    throw new UsageError(
      `Can't read PR #${number} (${reason}). Pass --base and --head instead.`,
    );
  }

  progress(`Fetching PR #${number} and ${info.baseRefName}…`);
  git([
    "fetch",
    "--quiet",
    REMOTE,
    `refs/pull/${number}/head`,
    `refs/heads/${info.baseRefName}`,
  ]);

  const head = resolveCommit(info.headRefOid);
  // A merged PR's head is already in the base branch, so take the merge base
  // from the commit before the PR landed.
  const baseTip =
    info.state === "MERGED" && info.mergeCommit?.oid
      ? `${info.mergeCommit.oid}^1`
      : `${REMOTE}/${info.baseRefName}`;
  return {
    base: mergeBase(resolveCommit(baseTip), head),
    baseLabel: `merge base with ${info.baseRefName}`,
    head,
    headLabel: `PR #${info.number} · ${info.title}${info.state === "OPEN" ? "" : ` (${info.state.toLowerCase()})`}`,
    url: info.url,
    workingTree: false,
  };
}

/** Files the change touches, as GitHub would list them. */
function listChangedFiles(refs) {
  const lines = (text) => text.split("\n").filter(Boolean);
  if (!refs.workingTree) {
    return lines(
      git(["diff", "--name-only", "--no-renames", refs.base, refs.head]),
    );
  }
  return unique([
    ...lines(git(["diff", "--name-only", "--no-renames", refs.base])),
    ...listUntracked(),
  ]).sort();
}

/**
 * Untracked, non-ignored files, minus dot-directories like .angular/ and
 * .turbo/ that hold local caches rather than source.
 */
function listUntracked() {
  return git(["ls-files", "-z", "--others", "--exclude-standard"])
    .split("\0")
    .filter((file) => file && !file.startsWith("."));
}

// ---------------------------------------------------------------------------
// Snapshots
// ---------------------------------------------------------------------------

/** Writes a commit's tracked files to `dir` through a throwaway index. */
function exportCommit(commit, dir, scratch) {
  const env = {
    ...process.env,
    GIT_INDEX_FILE: path.join(scratch, `${path.basename(dir)}.index`),
  };
  git(["read-tree", commit], { env });
  git(["checkout-index", "--all", "--force", `--prefix=${dir}/`], { env });
}

/** Copies the working tree, including untracked files, to `dir`. */
function exportWorkingTree(dir) {
  const files = git(["ls-files", "-z", "--cached"]).split("\0").filter(Boolean);
  for (const file of unique([...files, ...listUntracked()])) {
    const from = path.join(repoRoot, file);
    let stat;
    try {
      stat = fs.lstatSync(from);
    } catch {
      continue; // deleted in the working tree
    }
    if (stat.isDirectory()) continue;
    const to = path.join(dir, file);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    if (stat.isSymbolicLink()) fs.symlinkSync(fs.readlinkSync(from), to);
    else fs.copyFileSync(from, to);
  }
}

/** Maps each workspace package name in `dir` to its directory. */
function listWorkspaces(dir) {
  const pkg = JSON.parse(readText(path.join(dir, "package.json")));
  const patterns = Array.isArray(pkg.workspaces)
    ? pkg.workspaces
    : (pkg.workspaces?.packages ?? []);
  const workspaces = new Map();
  for (const pattern of patterns) {
    const dirs = pattern.endsWith("/*")
      ? fs
          .readdirSync(path.join(dir, pattern.slice(0, -2)), {
            withFileTypes: true,
          })
          .filter((entry) => entry.isDirectory())
          .map((entry) => path.join(dir, pattern.slice(0, -2), entry.name))
      : [path.join(dir, pattern)];
    for (const workspace of dirs) {
      const manifest = path.join(workspace, "package.json");
      if (!fs.existsSync(manifest)) continue;
      const name = JSON.parse(readText(manifest)).name;
      if (name) workspaces.set(name, workspace);
    }
  }
  return workspaces;
}

/**
 * Gives a snapshot this checkout's installed packages without letting it pick
 * up this checkout's workspace code. Every package in node_modules is linked
 * in, except workspace packages (@nysds/codegen and friends), which point at
 * the snapshot's own copies. Without that, a snapshot would quietly run
 * whichever generator this checkout has.
 */
function linkNodeModules(dir) {
  const source = path.join(repoRoot, "node_modules");
  if (!fs.existsSync(source)) {
    throw new UsageError(
      "This checkout has no node_modules. Run npm ci, or pass --install.",
    );
  }
  const target = path.join(dir, "node_modules");
  const workspaces = listWorkspaces(dir);
  const link = (name, to) => {
    const at = path.join(target, name);
    fs.mkdirSync(path.dirname(at), { recursive: true });
    fs.symlinkSync(to, at, "dir");
  };
  const isWorkspaceLink = (file) => {
    if (!fs.lstatSync(file).isSymbolicLink()) return false;
    const real = fs.realpathSync(file);
    return (
      real.startsWith(`${repoRoot}${path.sep}`) &&
      !real.includes(`${path.sep}node_modules${path.sep}`)
    );
  };

  fs.mkdirSync(target);
  for (const entry of fs.readdirSync(source)) {
    if (entry.startsWith(".")) continue;
    const names = entry.startsWith("@")
      ? fs
          .readdirSync(path.join(source, entry))
          .map((child) => `${entry}/${child}`)
      : [entry];
    for (const name of names) {
      const from = path.join(source, name);
      if (workspaces.has(name) || isWorkspaceLink(from)) continue;
      link(name, from);
    }
  }
  for (const [name, workspace] of workspaces) {
    link(name, workspace);
    const nested = path.join(
      repoRoot,
      path.relative(dir, workspace),
      "node_modules",
    );
    if (
      fs.existsSync(nested) &&
      !fs.existsSync(path.join(workspace, "node_modules"))
    ) {
      fs.symlinkSync(nested, path.join(workspace, "node_modules"), "dir");
    }
  }
}

function installNodeModules(side) {
  return runLogged(
    "npm",
    ["ci", "--ignore-scripts", "--no-audit", "--no-fund", "--loglevel=error"],
    side,
    "npm ci",
  );
}

/** Reads the --config path from the commit's own `cem` npm script. */
function cemConfigPath(side) {
  const pkg = JSON.parse(readText(path.join(side.dir, "package.json")));
  const script = pkg.scripts?.cem;
  if (!script) {
    throw new UsageError(
      `The ${side.name} commit has no "cem" npm script, so it has no codegen to run.`,
    );
  }
  return /--config[=\s]+(\S+)/.exec(script)?.[1] ?? DEFAULT_CEM_CONFIG;
}

function cemBinary(nodeModules) {
  const bin = path.join(nodeModules, ".bin", "cem");
  if (!fs.existsSync(bin)) {
    throw new UsageError(
      `Can't find the cem binary in ${nodeModules}. Run npm ci first.`,
    );
  }
  return fs.realpathSync(bin);
}

/** Longest any single step may run before it's treated as hung. */
const STEP_TIMEOUT_MS = 10 * 60 * 1000;

/** Steps still running, so an interrupted review can stop them. */
const running = new Set();

/** Runs a command in a snapshot, appending its output to the side's log. */
function runLogged(command, args, side, label) {
  return new Promise((resolve, reject) => {
    const log = fs.openSync(side.log, "a");
    const child = spawn(command, args, {
      cwd: side.dir,
      stdio: ["ignore", log, log],
    });
    running.add(child);
    const timer = setTimeout(() => child.kill("SIGKILL"), STEP_TIMEOUT_MS);
    child.on("error", reject);
    child.on("close", (code, signal) => {
      running.delete(child);
      clearTimeout(timer);
      fs.closeSync(log);
      if (code === 0) return resolve();
      if (signal === "SIGKILL") {
        return reject(
          new RunError(
            `${label} for the ${side.name} commit didn't finish within ${STEP_TIMEOUT_MS / 60000} minutes.`,
          ),
        );
      }
      // npm puts the cause first and usage text last; stack traces do the
      // reverse. Long logs show both ends.
      const lines = readText(side.log).trimEnd().split("\n");
      const excerpt =
        lines.length > 30
          ? [...lines.slice(0, 10), "…", ...lines.slice(-15)].join("\n")
          : lines.join("\n");
      reject(
        new RunError(
          `${label} failed for the ${side.name} commit (exit ${code}):\n\n${excerpt}` +
            (side.linked
              ? "\n\nA missing or mismatched package usually means this commit needs different dependencies than this checkout has. Try again with --install."
              : ""),
        ),
      );
    });
  });
}

/** Size and modification time of every file, skipping node_modules and .git. */
function stampFiles(root) {
  const stamps = new Map();
  const pending = [""];
  while (pending.length > 0) {
    const dir = pending.pop();
    for (const entry of fs.readdirSync(path.join(root, dir), {
      withFileTypes: true,
    })) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const rel = dir ? `${dir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) pending.push(rel);
      else if (entry.isFile()) {
        const stat = fs.statSync(path.join(root, rel));
        stamps.set(rel, `${stat.size}:${stat.mtimeMs}`);
      }
    }
  }
  return stamps;
}

/** Runs codegen in a snapshot and records every file it wrote or deleted. */
async function runCodegen(side, cem) {
  // When the config fails to import, the analyzer prints the error, falls
  // back to its defaults, and still exits 0, which reads as "codegen wrote
  // nothing". Importing the config first turns that into a real failure.
  // It runs from a file because `node --eval` deadlocks on @prettier/sync,
  // which the VS Code plugin loads; the explicit exit is for plugins that
  // hold the event loop open.
  const loader = path.join(path.dirname(side.dir), "load-config.mjs");
  fs.writeFileSync(
    loader,
    "await import(process.argv[2]);\nprocess.exit(0);\n",
  );
  const config = pathToFileURL(path.join(side.dir, side.cemConfig)).href;
  await runLogged(
    process.execPath,
    [loader, config],
    side,
    "Loading the CEM config",
  );
  const before = stampFiles(side.dir);
  await runLogged(
    process.execPath,
    [cem, "analyze", "--config", side.cemConfig],
    side,
    "cem analyze",
  );
  const after = stampFiles(side.dir);
  side.outputs = new Set();
  for (const [file, stamp] of after)
    if (before.get(file) !== stamp) side.outputs.add(file);
  for (const file of before.keys())
    if (!after.has(file)) side.outputs.add(file);
}

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

/** Reads the nys-* component declarations from a snapshot's manifest. */
function readComponents(dir) {
  const file = path.join(dir, "custom-elements.json");
  const components = new Map();
  if (!fs.existsSync(file)) return components;
  const manifest = JSON.parse(readText(file));
  for (const mod of manifest.modules ?? []) {
    for (const decl of mod.declarations ?? []) {
      if (decl.kind !== "class" || !decl.tagName?.startsWith("nys-")) continue;
      components.set(decl.tagName, { modulePath: mod.path, decl });
    }
  }
  return components;
}

/** Modules a declaration inherits members from, as listed in the manifest. */
function inheritedModules(decl) {
  if (!decl) return [];
  return [
    decl.superclass?.module,
    ...(decl.members ?? []).map((member) => member.inheritedFrom?.module),
    ...(decl.events ?? []).map((event) => event.inheritedFrom?.module),
  ];
}

function publicFields(decl) {
  const attributes = new Map(
    (decl.attributes ?? []).map((attr) => [attr.fieldName, attr.name]),
  );
  return new Map(
    (decl.members ?? [])
      .filter(
        (member) =>
          member.kind === "field" &&
          !member.static &&
          member.privacy !== "private" &&
          member.privacy !== "protected" &&
          !/^[_#]/.test(member.name),
      )
      .map((member) => [
        member.name,
        {
          type: member.type?.text,
          attribute: member.attribute ?? attributes.get(member.name),
          default: member.default,
          reflects: Boolean(member.reflects),
          deprecated: Boolean(member.deprecated),
          description: member.description,
        },
      ]),
  );
}

function namedEntries(list, pick) {
  return new Map((list ?? []).map((entry) => [entry.name, pick(entry)]));
}

/** Human-readable API differences for one component, base to head. */
function manifestDelta(base, head) {
  if (!base && !head) return [];
  if (!base) return ["new component"];
  if (!head) return ["component removed"];
  const eventShape = (event) => ({
    type: event.type?.text,
    deprecated: Boolean(event.deprecated),
    description: event.description,
  });
  const slotShape = (slot) => ({ description: slot.description });
  const lines = [
    ...compareEntries("prop", publicFields(base), publicFields(head)),
    ...compareEntries(
      "event",
      namedEntries(base.events, eventShape),
      namedEntries(head.events, eventShape),
    ),
    ...compareEntries(
      "slot",
      namedEntries(base.slots, slotShape),
      namedEntries(head.slots, slotShape),
    ),
  ];
  if (JSON.stringify(base.formControl) !== JSON.stringify(head.formControl)) {
    lines.push("~ formControl");
  }
  if ((base.description ?? "") !== (head.description ?? "")) {
    lines.push("~ class description");
  }
  return lines;
}

/**
 * Lines like `+ prop size: "sm" | "md"`, `- event nys-close`, and
 * `~ prop label: type string → string | undefined`. Type, attribute, and
 * default changes show both values; other aspects show by name. Entries whose
 * only change is their description share one line, since doc edits are
 * common and rarely what a reviewer is hunting for.
 */
function compareEntries(kind, before, after) {
  const label = (name) => name || "(default)";
  const shown = (value) => (value === undefined ? "none" : value);
  const lines = [];
  const describedOnly = [];
  for (const [name, entry] of after) {
    const previous = before.get(name);
    if (!previous) {
      lines.push(
        `+ ${kind} ${label(name)}${entry.type ? `: ${entry.type}` : ""}`,
      );
      continue;
    }
    const aspects = Object.keys(entry).filter(
      (aspect) => previous[aspect] !== entry[aspect],
    );
    if (aspects.length === 1 && aspects[0] === "description") {
      describedOnly.push(label(name));
    } else if (aspects.length > 0) {
      const changes = aspects.map((aspect) =>
        ["type", "attribute", "default"].includes(aspect)
          ? `${aspect} ${shown(previous[aspect])} → ${shown(entry[aspect])}`
          : aspect,
      );
      lines.push(`~ ${kind} ${label(name)}: ${changes.join(", ")}`);
    }
  }
  for (const name of before.keys()) {
    if (!after.has(name)) lines.push(`- ${kind} ${label(name)}`);
  }
  if (describedOnly.length > 0) {
    lines.push(`~ ${kind} descriptions: ${describedOnly.join(", ")}`);
  }
  return lines;
}

/** One record per tag across both commits, with what can explain its output. */
function mergeComponents(baseComponents, headComponents) {
  const tags = unique([
    ...baseComponents.keys(),
    ...headComponents.keys(),
  ]).sort();
  return tags.map((tag) => {
    const base = baseComponents.get(tag);
    const head = headComponents.get(tag);
    const modulePaths = unique([base?.modulePath, head?.modulePath]);
    return {
      tag,
      classNames: unique([base?.decl.name, head?.decl.name]),
      subpath: tag.replace(/^nys-/, ""),
      modulePaths,
      packageRoots: unique(
        modulePaths.map((file) => file.split("/").slice(0, 2).join("/")),
      ),
      inherited: unique([
        ...inheritedModules(base?.decl),
        ...inheritedModules(head?.decl),
      ]),
      delta: manifestDelta(base?.decl, head?.decl),
    };
  });
}

/**
 * Finds the component an output belongs to by file name (NysAvatar.ts,
 * nys-avatar.component.ts) or by folder (.ngbuild/avatar/ng-package.json).
 * Barrels and other shared files match nothing.
 */
function matchComponent(file, components) {
  const segments = file.split("/");
  const stem = segments.at(-1).replace(/\.[^.]+$/, "");
  const byName = components.find(
    (c) =>
      c.classNames.includes(stem) ||
      stem === c.tag ||
      stem === `${c.tag}.component`,
  );
  if (byName) return byName;
  const folders = segments.slice(2, -1);
  return components.find((c) => folders.includes(c.subpath)) ?? null;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

/**
 * What a commit ships for an output path: the generated file, or the override
 * that replaced it. A generated file wins when both exist, since then the
 * generator didn't honor the override.
 */
function sideState(dir, key) {
  if (fs.existsSync(path.join(dir, key))) {
    return {
      provider: "generated",
      path: key,
      text: readText(path.join(dir, key)),
    };
  }
  const match = GENERATED_RE.exec(key);
  if (match) {
    const override = `${match[1]}/src/overrides/${match[2]}`;
    if (fs.existsSync(path.join(dir, override))) {
      return {
        provider: "override",
        path: override,
        text: readText(path.join(dir, override)),
      };
    }
  }
  return null;
}

function sameState(a, b) {
  return (
    a?.provider === b?.provider && a?.path === b?.path && a?.text === b?.text
  );
}

/** True for files that change what codegen emits without being a component. */
function isGeneratorFile(file, cemConfigs) {
  if (cemConfigs.includes(file) || file === "package-lock.json") return true;
  return (
    file.startsWith("packages/codegen/") &&
    !file.startsWith("packages/codegen/test/") &&
    !file.endsWith(".md")
  );
}

/**
 * Generator files from `changed` that can affect `key`. A framework plugin
 * (cem-plugins/react.mjs) only affects its own package, deps.mjs only affects
 * each package's own package.json, and everything else affects every output.
 */
function generatorInputs(key, changed, cemConfigs, frameworkNames) {
  const pkg = key.split("/")[1];
  return changed.filter((file) => {
    if (!isGeneratorFile(file, cemConfigs)) return false;
    const plugin = /^packages\/codegen\/cem-plugins\/([^/]+)\.mjs$/.exec(
      file,
    )?.[1];
    if (plugin === "deps") return PACKAGE_MANIFEST_RE.test(key);
    if (plugin && frameworkNames.has(plugin)) return plugin === pkg;
    return true;
  });
}

/**
 * PR files that can change a component's manifest entry, closest first: the
 * component's own module, then modules it inherits from, then other source
 * in its package (shared types, base classes).
 */
function componentSources(component, changed) {
  const own = changed.filter((file) => component.modulePaths.includes(file));
  const inherited = changed.filter(
    (file) => !own.includes(file) && component.inherited.includes(file),
  );
  const nearby = changed.filter(
    (file) =>
      !own.includes(file) &&
      !inherited.includes(file) &&
      component.packageRoots.some((root) => file.startsWith(`${root}/src/`)) &&
      file.endsWith(".ts") &&
      !NON_MANIFEST_RE.test(file),
  );
  return [
    ...own.map((file) => `source changed: ${file}`),
    ...inherited.map((file) => `inherited source changed: ${file}`),
    ...nearby.map((file) => `package source changed: ${file}`),
  ];
}

function buildReport(sides, changed, options) {
  const { base, head } = sides;
  const changedSet = new Set(changed);
  const cemConfigs = unique([base.cemConfig, head.cemConfig]);
  const components = mergeComponents(base.components, head.components);
  for (const component of components) {
    component.sources = componentSources(component, changed);
  }

  // Every file codegen wrote under packages/, plus overrides the PR touched
  // in packages that have generated output.
  const keys = new Set(
    [...base.outputs, ...head.outputs].filter((file) =>
      file.startsWith("packages/"),
    ),
  );
  const frameworkPackages = new Set(
    [...keys].map((file) => GENERATED_RE.exec(file)?.[1]).filter(Boolean),
  );
  for (const file of changed) {
    const match = OVERRIDE_RE.exec(file);
    if (
      match &&
      frameworkPackages.has(match[1]) &&
      !/readme\.md$/i.test(match[2])
    ) {
      keys.add(`${match[1]}/src/generated/${match[2]}`);
    }
  }
  const frameworkNames = new Set(
    [...frameworkPackages].map((pkg) => pkg.split("/")[1]),
  );

  let rows = [];
  for (const key of keys) {
    const baseState = sideState(base.dir, key);
    const headState = sideState(head.dir, key);
    if (sameState(baseState, headState)) continue;
    let change = "modified";
    if (!baseState) change = "added";
    else if (!headState) change = "removed";
    else if (baseState.provider !== headState.provider) {
      change = `${baseState.provider} → ${headState.provider}`;
    }
    rows.push({
      key,
      pkg: key.split("/").slice(0, 2).join("/"),
      base: baseState,
      head: headState,
      component: matchComponent(key, components),
      change,
    });
  }

  const added = components
    .filter((c) => c.delta[0] === "new component")
    .map((c) => c.tag);
  const removed = components
    .filter((c) => c.delta[0] === "component removed")
    .map((c) => c.tag);

  for (const row of rows) {
    const source = [];
    for (const state of [row.base, row.head]) {
      if (state && changedSet.has(state.path)) {
        const kind = state.provider === "override" ? "override" : "file";
        const inBase = fs.existsSync(path.join(base.dir, state.path));
        const inHead = fs.existsSync(path.join(head.dir, state.path));
        const verb = !inBase ? "added" : !inHead ? "deleted" : "changed";
        source.push(`${kind} ${verb} in this PR: ${state.path}`);
      }
    }
    if (row.component) {
      source.push(...row.component.sources);
    } else {
      // A shared file (barrel, module, package.json) lists every component,
      // so any component-level change the PR explains also explains it.
      if (added.length > 0)
        source.push(`components added: ${added.join(", ")}`);
      if (removed.length > 0)
        source.push(`components removed: ${removed.join(", ")}`);
      for (const other of rows) {
        if (
          other.pkg === row.pkg &&
          other.component &&
          other.change.includes("→")
        ) {
          source.push(`${path.basename(other.key)}: ${other.change}`);
        }
      }
      for (const component of components) {
        if (component.delta.length > 0 && component.sources.length > 0) {
          source.push(`${component.tag} API changed in this PR`);
        }
      }
      // deps.mjs copies component package versions into the wrapper
      // package.json files, so a version bump explains those.
      if (row.key.endsWith("/package.json")) {
        const manifests = changed.filter((file) =>
          /^(packages\/[^/]+\/)?package\.json$/.test(file),
        );
        if (manifests.length > 0) {
          source.push(
            `${plural(manifests.length, "package.json file")} changed in this PR`,
          );
        }
      }
    }
    const generator = generatorInputs(
      row.key,
      changed,
      cemConfigs,
      frameworkNames,
    ).map((file) => `generator changed: ${file}`);
    if (source.length === 0 && generator.length === 0 && row.head) {
      const twin = changed.find((file) => {
        const copy = path.join(head.dir, file);
        return fs.existsSync(copy) && readText(copy) === row.head.text;
      });
      if (twin) source.push(`same content as ${twin}, changed in this PR`);
    }
    row.reasons = unique([...source, ...generator]);
    if (source.length > 0) row.verdict = "expected";
    else if (generator.length > 0) row.verdict = "generator";
    else row.verdict = "check";
  }

  const wanted = options.component.map((name) => name.toLowerCase());
  const answersTo = (component, name) =>
    component.tag === name ||
    component.subpath === name ||
    component.classNames.some((className) => className.toLowerCase() === name);
  const isWanted = (component) =>
    wanted.length === 0 ||
    (component !== null && wanted.some((name) => answersTo(component, name)));
  const frameworks = options.framework.map((name) => name.toLowerCase());
  rows = rows.filter(
    (row) =>
      isWanted(row.component) &&
      (frameworks.length === 0 || frameworks.includes(row.pkg.split("/")[1])),
  );
  // Needs-attention first; within a verdict, a component's own files read
  // before the shared files (barrels, modules) they ripple into.
  rows.sort(
    (a, b) =>
      VERDICTS[a.verdict].rank - VERDICTS[b.verdict].rank ||
      Number(!a.component) - Number(!b.component) ||
      a.key.localeCompare(b.key),
  );

  // Components the PR touched, or whose API changed, with no output change.
  const quiet = components.filter(
    (component) =>
      isWanted(component) &&
      (component.sources.length > 0 || component.delta.length > 0) &&
      !rows.some((row) => row.component === component),
  );

  const notes = [];
  const unknown = wanted.filter(
    (name) => !components.some((c) => answersTo(c, name)),
  );
  if (unknown.length > 0)
    notes.push(`No component matches ${unknown.join(", ")}.`);
  const unknownFrameworks = frameworks.filter(
    (name) => !frameworkNames.has(name),
  );
  if (unknownFrameworks.length > 0) {
    notes.push(
      `No generated package matches ${unknownFrameworks.join(", ")}. Codegen writes ${[...frameworkNames].sort().join(", ")}.`,
    );
  }

  return {
    rows,
    quiet,
    components,
    added,
    removed,
    notes,
    generatorChanged: changed.filter((file) =>
      isGeneratorFile(file, cemConfigs),
    ),
  };
}

/** The plugin that writes an output: its framework's plugin, or deps.mjs. */
function pluginFor(row, sides) {
  if (PACKAGE_MANIFEST_RE.test(row.key)) {
    return "packages/codegen/cem-plugins/deps.mjs";
  }
  const framework = `packages/codegen/cem-plugins/${row.pkg.split("/")[1]}.mjs`;
  const exists = [sides.base.dir, sides.head.dir].some((dir) =>
    fs.existsSync(path.join(dir, framework)),
  );
  return exists ? framework : "packages/codegen";
}

/** Says where one side of an output came from. */
function describeSide(state, row, sides) {
  if (state.provider === "override") {
    return `override ${state.path} ${dim("(hand-written)")}`;
  }
  const from = row.component
    ? `from ${row.component.modulePaths.join(", ")}`
    : dim("(shared file: barrel, module, or package config)");
  return `${GENERATED_RE.test(state.path) ? "generated" : "written"} by ${pluginFor(row, sides)} ${from}`;
}

/**
 * Collapses outputs that changed for the same reason: same verdict, folder,
 * providers, and why lines, with no API change of their own. A generator
 * edit that touches every wrapper then reads as one entry, not fifty.
 */
function groupRows(rows) {
  const groups = [];
  const byId = new Map();
  for (const row of rows) {
    const id = row.component?.delta.length
      ? null
      : [
          row.verdict,
          path.dirname(row.key),
          row.base?.provider,
          row.head?.provider,
          ...row.reasons,
        ].join("\n");
    let group = id === null ? undefined : byId.get(id);
    if (!group) {
      group = [];
      groups.push(group);
      if (id !== null) byId.set(id, group);
    }
    group.push(row);
  }
  return groups.flatMap((group) =>
    group.length >= 3 ? [group] : group.map((row) => [row]),
  );
}

/** Basenames per folder, for listing many outputs compactly. */
function byFolder(keys) {
  const folders = new Map();
  for (const key of keys) {
    const folder = path.dirname(key);
    if (!folders.has(folder)) folders.set(folder, []);
    folders.get(folder).push(path.basename(key));
  }
  return folders;
}

/** Wraps a comma-separated list to fit an 80-column terminal. */
function wrapList(names, width = 64) {
  const lines = [];
  let current = "";
  for (const name of names) {
    const next = current ? `${current}, ${name}` : name;
    if (current && next.length > width) {
      lines.push(`${current},`);
      current = name;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function renderDiff(row, viewDir) {
  const a = row.base ? `base/${row.base.path}` : "/dev/null";
  const b = row.head ? `head/${row.head.path}` : "/dev/null";
  const result = spawnSync(
    "git",
    [
      "diff",
      "--no-index",
      "--no-ext-diff",
      "--no-prefix",
      `--color=${useColor ? "always" : "never"}`,
      "--",
      a,
      b,
    ],
    { cwd: viewDir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  if (result.error || result.status > 1) {
    throw result.error ?? new Error(result.stderr);
  }
  return (
    result.stdout ||
    dim("(same content; only the file that provides it changed)\n")
  );
}

/**
 * A diff's added and removed lines with the component's own names masked,
 * so one template change repeated across every wrapper compares equal.
 */
function changeSignature(diff, row) {
  const changes = diff
    .replace(/\x1b\[[0-9;]*m/g, "")
    .split("\n")
    .filter((text) => /^[+-]/.test(text) && !/^(\+\+\+|---) /.test(text));
  if (changes.length === 0) return `only-provider:${row.key}`;
  const names = [...(row.component?.classNames ?? []), row.component?.tag]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  return names.reduce(
    (text, name) => text.split(name).join("\0"),
    changes.join("\n"),
  );
}

function render(report, refs, sides, changed, options, viewDir, seconds) {
  const out = [];
  const line = (text = "") => out.push(text);
  const short = (sha) => sha.slice(0, 9);
  const indent = " ".repeat(13);
  const field = (name, text) =>
    line(`${indent}${dim(name.padEnd(4))}  ${text}`);

  line(bold("Codegen review"));
  line(`  ${dim("base")}   ${cyan(short(refs.base))}  ${refs.baseLabel}`);
  line(
    `  ${dim("head")}   ${cyan(refs.workingTree ? "worktree " : short(refs.head))}  ${refs.headLabel}`,
  );
  if (refs.url) line(`         ${dim(refs.url)}`);
  line(
    `  ${dim("PR")}     ${plural(changed.length, "file")} changed · ${
      report.generatorChanged.length > 0
        ? yellow(`generator changed: ${report.generatorChanged.join(", ")}`)
        : "generator unchanged"
    }`,
  );
  const apiChanges = report.components.filter(
    (c) =>
      c.delta.length > 0 &&
      !report.added.includes(c.tag) &&
      !report.removed.includes(c.tag),
  );
  line(
    `  ${dim("API")}    ${plural(apiChanges.length, "component")} changed · ${report.added.length} added · ${report.removed.length} removed ${dim("(from each commit's regenerated custom-elements.json)")}`,
  );
  const filters = [
    ...options.component.map((name) => `component ${name}`),
    ...options.framework.map((name) => `framework ${name}`),
  ];
  if (filters.length > 0) line(`  ${dim("filter")} ${filters.join(", ")}`);
  line(`  ${dim(`Ran cem analyze on both commits in ${seconds}s.`)}`);
  for (const note of [...sides.notes, ...report.notes]) {
    line(`  ${yellow("note")}   ${note}`);
  }
  line();

  const count = (verdict) =>
    report.rows.filter((row) => row.verdict === verdict).length;
  line(
    bold(
      `What changed in the generated output: ${plural(report.rows.length, "file")}`,
    ),
  );
  if (report.rows.length > 0) {
    line(
      `  ${green(`${count("expected")} expected`)} · ${yellow(`${count("generator")} from generator changes`)} · ${red(`${count("check")} to check`)}`,
    );
  }
  line();
  for (const group of groupRows(report.rows)) {
    const [row] = group;
    const verdict = VERDICTS[row.verdict];
    const label = verdict.color(verdict.label.padEnd(10));
    if (group.length > 1) {
      const changes = new Map();
      for (const member of group) {
        changes.set(member.change, (changes.get(member.change) ?? 0) + 1);
      }
      const summary = [...changes]
        .map(([kind, n]) => `${n} ${kind}`)
        .join(", ");
      line(
        `  ${label} ${bold(`${path.dirname(row.key)}/`)} ${dim(`(${plural(group.length, "file")}: ${summary})`)}`,
      );
      const state = row.head ?? row.base;
      field(
        "from",
        state.provider === "override"
          ? `overrides in ${path.dirname(state.path)}/ ${dim("(hand-written)")}`
          : `${GENERATED_RE.test(state.path) ? "generated" : "written"} by ${pluginFor(row, sides)}`,
      );
    } else {
      line(`  ${label} ${bold(row.key)} ${dim(`(${row.change})`)}`);
      if (
        row.base?.provider === row.head?.provider &&
        row.base?.path === row.head?.path
      ) {
        field("from", describeSide(row.head, row, sides));
      } else {
        if (row.base) field("was", describeSide(row.base, row, sides));
        if (row.head) field("now", describeSide(row.head, row, sides));
      }
    }
    for (const reason of row.reasons) field("why", reason);
    if (row.reasons.length === 0) {
      field("why", red("nothing in this PR explains this change"));
    }
    for (const change of row.component?.delta ?? []) field("api", change);
    if (group.length > 1) {
      wrapList(group.map((member) => path.basename(member.key))).forEach(
        (text, index) => field(index === 0 ? "file" : "", text),
      );
    }
    line();
  }

  if (report.quiet.length > 0) {
    const scope =
      options.framework.length > 0 ? " in the selected frameworks" : "";
    line(
      bold(
        `Changed in this PR, but no generated output changed${scope}: ${report.quiet.length}`,
      ),
    );
    line(
      dim(
        "  Expected for internal logic and styles. If you expected a wrapper change, the api lines show what the manifest saw.",
      ),
    );
    line();
    for (const component of report.quiet) {
      line(`  ${bold(component.tag)}`);
      for (const source of component.sources) field("src", source);
      if (component.sources.length === 0) {
        field("src", yellow("no source change in this PR"));
      }
      for (const change of component.delta) field("api", change);
      if (component.delta.length === 0) field("api", "unchanged");
    }
    line();
  }

  if (!options.summary && report.rows.length > 0) {
    line(bold("Diffs"));
    line();
    // One diff per distinct change; repeats of it are listed underneath.
    const entries = [];
    const bySignature = new Map();
    for (const row of report.rows) {
      const diff = renderDiff(row, viewDir);
      const signature = changeSignature(diff, row);
      const first = bySignature.get(signature);
      if (first) {
        first.same.push(row.key);
        continue;
      }
      const entry = { row, diff, same: [] };
      bySignature.set(signature, entry);
      entries.push(entry);
    }
    for (const { row, diff, same } of entries) {
      line(
        cyan(`── ${row.key} ${"─".repeat(Math.max(3, 76 - row.key.length))}`),
      );
      out.push(diff.trimEnd());
      if (same.length > 0) {
        line();
        line(
          dim(
            `  Same change, component names aside, in ${plural(same.length, "more file")}:`,
          ),
        );
        for (const [folder, names] of byFolder(same)) {
          line(dim(`  ${folder}/`));
          for (const text of wrapList(names)) line(dim(`    ${text}`));
        }
      }
      line();
    }
  }

  if (options.keep) {
    line(bold("Snapshots"));
    line(`  ${path.dirname(viewDir)}`);
    line(`    base/ and head/   full trees after codegen`);
    line(
      `    view/             only the changed files, at the path that provides them`,
    );
    line(
      `  Compare them with: git diff --no-index ${path.join(viewDir, "base")} ${path.join(viewDir, "head")}`,
    );
  }
  return `${out.join("\n")}\n`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const options = readOptions();
  if (options.help) {
    process.stdout.write(HELP);
    return;
  }

  const refs = resolveRefs(options);
  if (refs.base === refs.head && !refs.workingTree) {
    process.stdout.write(
      `Base and head are the same commit (${refs.head.slice(0, 9)}), so there's nothing to compare.\n`,
    );
    return;
  }
  const changed = listChangedFiles(refs);

  const scratch = fs.mkdtempSync(
    path.join(os.tmpdir(), "nysds-codegen-review-"),
  );
  const cleanup = () => {
    if (!options.keep) fs.rmSync(scratch, { recursive: true, force: true });
  };
  if (options.keep) progress(`Keeping snapshots in ${scratch}`);
  for (const [signal, code] of [
    ["SIGINT", 130],
    ["SIGTERM", 143],
    ["SIGHUP", 129],
  ]) {
    process.on(signal, () => {
      for (const child of running) child.kill("SIGKILL");
      cleanup();
      process.exit(code);
    });
  }

  try {
    const notes = [];
    const sides = {
      base: { name: "base", commit: refs.base },
      head: { name: "head", commit: refs.workingTree ? null : refs.head },
    };
    const installedLock = fs.existsSync(
      path.join(repoRoot, "package-lock.json"),
    )
      ? readText(path.join(repoRoot, "package-lock.json"))
      : null;

    for (const side of Object.values(sides)) {
      side.dir = path.join(scratch, side.name);
      side.log = path.join(scratch, `${side.name}.log`);
      side.linked = !options.install;
      fs.mkdirSync(side.dir);
      progress(
        `Exporting ${side.name} (${side.commit ? side.commit.slice(0, 9) : "working tree"})…`,
      );
      if (side.commit) exportCommit(side.commit, side.dir, scratch);
      else exportWorkingTree(side.dir);
      side.cemConfig = cemConfigPath(side);
      if (side.linked) {
        linkNodeModules(side.dir);
        const lock = path.join(side.dir, "package-lock.json");
        if (
          installedLock !== null &&
          fs.existsSync(lock) &&
          readText(lock) !== installedLock
        ) {
          notes.push(
            `The ${side.name} lockfile differs from this checkout's, so codegen ran with this checkout's packages. Pass --install for an exact install.`,
          );
        }
      }
    }
    if (!fs.existsSync(path.join(sides.base.dir, "packages/codegen"))) {
      notes.push(
        "The base commit predates @nysds/codegen, so every wrapper shows as added.",
      );
    }
    if (!refs.workingTree && !options.pr && !options.head) {
      const dirty = git([
        "status",
        "--porcelain",
        "--untracked-files=no",
      ]).trim();
      if (dirty)
        notes.push(
          "Your uncommitted changes aren't included. Pass --working-tree to include them.",
        );
    }
    sides.notes = notes;

    if (options.install) {
      progress("Installing packages in both snapshots (npm ci)…");
      await Promise.all([
        installNodeModules(sides.base),
        installNodeModules(sides.head),
      ]);
    }

    progress("Running cem analyze on both commits…");
    const started = Date.now();
    await Promise.all(
      [sides.base, sides.head].map((side) =>
        runCodegen(
          side,
          cemBinary(
            path.join(side.linked ? repoRoot : side.dir, "node_modules"),
          ),
        ),
      ),
    );
    const seconds = Math.round((Date.now() - started) / 1000);

    for (const side of [sides.base, sides.head])
      side.components = readComponents(side.dir);
    const report = buildReport(sides, changed, options);

    // view/ holds only the changed files, each at the path that provides it,
    // so the diff headers name the override when one is in play.
    const viewDir = path.join(scratch, "view");
    fs.mkdirSync(viewDir);
    for (const row of report.rows) {
      for (const [name, state] of [
        ["base", row.base],
        ["head", row.head],
      ]) {
        if (!state) continue;
        const file = path.join(viewDir, name, state.path);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, state.text);
      }
    }
    process.stdout.write(
      render(report, refs, sides, changed, options, viewDir, seconds),
    );
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  if (error instanceof UsageError || error instanceof RunError) {
    process.stderr.write(`${error.message}\n`);
    process.exit(error instanceof UsageError ? 1 : 2);
  }
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exit(2);
});
