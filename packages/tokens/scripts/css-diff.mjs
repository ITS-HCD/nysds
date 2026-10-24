#!/usr/bin/env node
/**
 * One-time migration harness: snapshot the Terrazzo CSS output and compare two
 * snapshots semantically (resolved, normalized values per selector).
 *
 *   node scripts/css-diff.mjs snapshot <name>
 *   node scripts/css-diff.mjs compare <a> <b> [--step <n>]
 *
 * Snapshots live in .snapshots/<name>/ (gitignored). Compare prints a summary
 * and writes reports/step-<n>-<b>.md (or reports/compare-<a>-<b>.md).
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  colorKey,
  deltaE,
  normalizeValue,
  parseBlocks,
  resolveValue,
  singleColor,
} from "./lib/css-vars.mjs";
import { variableName } from "./lib/variable-name.mjs";

const PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = join(PKG, "../..");
const SNAPSHOTS = join(PKG, ".snapshots");
const REPORTS = join(PKG, "reports");
const STYLES_DIST = join(PKG, "../styles/dist");

const [cmd, ...args] = process.argv.slice(2);
if (cmd === "snapshot" && args[0]) snapshot(args[0]);
else if (cmd === "compare" && args[0] && args[1]) compare(args[0], args[1], flag("--step"));
else {
  console.error("Usage: css-diff.mjs snapshot <name> | compare <a> <b> [--step <n>]");
  process.exit(1);
}

function flag(name) {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
}

// ---------------------------------------------------------------- snapshot

function snapshot(name) {
  const tz = join(ROOT, "node_modules/.bin/tz");
  console.log(`Building tokens with ${terrazzoVersion()}…`);
  execFileSync(tz, ["build"], { cwd: PKG, stdio: "inherit" });

  const dir = join(SNAPSHOTS, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, "css"), { recursive: true });
  cpSync(join(PKG, "dist/tokens.css"), join(dir, "css/tokens.css"));
  for (const f of readdirSync(STYLES_DIST).filter((f) => /^theme-.*\.css$/.test(f))) {
    cpSync(join(STYLES_DIST, f), join(dir, "css", f));
  }
  cpSync(join(PKG, "src"), join(dir, "tokens"), { recursive: true, filter: (p) => !p.endsWith(".DS_Store") });
  cpSync(join(PKG, "terrazzo.config.js"), join(dir, "terrazzo.config.js"));
  writeFileSync(
    join(dir, "meta.json"),
    JSON.stringify({ name, terrazzo: terrazzoVersion(), created: new Date().toISOString() }, null, 2) + "\n",
  );
  console.log(`Snapshot "${name}" → ${relative(ROOT, dir)}`);
}

function terrazzoVersion() {
  const pkg = JSON.parse(readFileSync(join(ROOT, "node_modules/@terrazzo/cli/package.json"), "utf8"));
  return `@terrazzo/cli@${pkg.version}`;
}

// ---------------------------------------------------------------- loading

function load(name) {
  const dir = join(SNAPSHOTS, name);
  if (!existsSync(dir)) throw new Error(`No snapshot "${name}" — run: css-diff.mjs snapshot ${name}`);
  const meta = JSON.parse(readFileSync(join(dir, "meta.json"), "utf8"));
  const read = (f) => parseBlocks(readFileSync(join(dir, "css", f), "utf8"));

  const tokensBlocks = read("tokens.css");
  const root = new Map(tokensBlocks.filter((b) => b.selector === ":root").flatMap((b) => [...b.decls]));

  // context key → { declared: Map, scope: Map }
  const contexts = new Map();
  contexts.set("tokens.css :root", { declared: root, scope: root });
  for (const b of tokensBlocks.filter((b) => b.selector !== ":root")) {
    contexts.set(`tokens.css ${b.selector}`, { declared: b.decls, scope: new Map([...root, ...b.decls]) });
  }
  for (const f of readdirSync(join(dir, "css")).filter((f) => f.startsWith("theme-")).sort()) {
    const decls = new Map(read(f).flatMap((b) => [...b.decls]));
    contexts.set(f, { declared: decls, scope: new Map([...root, ...decls]) });
  }

  return { name, meta, contexts, tokenIndex: indexTokens(join(dir, "tokens")) };
}

/** CSS var name → { id, file } for every token in a snapshot's token sources. */
function indexTokens(dir) {
  const index = new Map();
  for (const f of readdirSync(dir, { recursive: true }).filter((f) => String(f).endsWith(".json"))) {
    const json = JSON.parse(readFileSync(join(dir, f), "utf8"));
    walk(json, [], (id) => {
      const name = variableName(id);
      if (!index.has(name)) index.set(name, { id, file: `src/${f}` });
    });
  }
  return index;
}

function walk(node, path, visit) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return;
  if ("$value" in node && path.length) visit(path.join("."));
  for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) walk(v, [...path, k], visit);
}

// ---------------------------------------------------------------- compare

function compare(aName, bName, step) {
  const a = load(aName);
  const b = load(bName);

  const removed = [];
  const added = [];
  const changed = [];
  const structural = [];
  let formatOnly = 0;
  const formatExamples = [];

  const keys = [...new Set([...a.contexts.keys(), ...b.contexts.keys()])];
  for (const ctx of keys) {
    const ca = a.contexts.get(ctx);
    const cb = b.contexts.get(ctx);
    if (!ca || !cb) {
      structural.push(`Context \`${ctx}\` only exists in **${ca ? aName : bName}**`);
      if (!cb) for (const v of ca.declared.keys()) removed.push({ ctx, v });
      else for (const v of cb.declared.keys()) added.push({ ctx, v });
      continue;
    }
    if (ca.declared.size !== cb.declared.size) {
      structural.push(`\`${ctx}\` declares ${ca.declared.size} vars in ${aName}, ${cb.declared.size} in ${bName}`);
    }

    for (const v of new Set([...ca.declared.keys(), ...cb.declared.keys()])) {
      const inA = ca.scope.has(v);
      const inB = cb.scope.has(v);
      if (inA && !inB) {
        removed.push({ ctx, v });
        continue;
      }
      if (!inA && inB) {
        added.push({ ctx, v });
        continue;
      }
      const rawA = ca.scope.get(v);
      const rawB = cb.scope.get(v);
      const resA = resolveValue(rawA, ca.scope);
      const resB = resolveValue(rawB, cb.scope);
      if (normalizeValue(resA) === normalizeValue(resB)) {
        if (rawA !== rawB) {
          formatOnly++;
          if (formatExamples.length < 10) formatExamples.push({ ctx, v, rawA, rawB });
        }
        continue;
      }
      const colA = singleColor(resA);
      const colB = singleColor(resB);
      changed.push({
        ctx,
        v,
        token: b.tokenIndex.get(v) ?? a.tokenIndex.get(v),
        before: colA ? colorKey(colA) : resA,
        after: colB ? colorKey(colB) : resB,
        rawA,
        rawB,
        dE: colA && colB ? deltaE(colA, colB) : null,
      });
    }
  }

  printSummary({ a, b, removed, added, changed, formatOnly, structural });
  const file = step ? `step-${step}-${bName}.md` : `compare-${aName}-${bName}.md`;
  mkdirSync(REPORTS, { recursive: true });
  writeFileSync(
    join(REPORTS, file),
    renderReport({ a, b, step, removed, added, changed, formatOnly, formatExamples, structural }),
  );
  console.log(`\nReport → ${relative(ROOT, join(REPORTS, file))}`);
}

// ---------------------------------------------------------------- output

function printSummary({ a, b, removed, added, changed, formatOnly, structural }) {
  console.log(`\n${a.name} (${a.meta.terrazzo}) → ${b.name} (${b.meta.terrazzo})`);
  console.log(`  removed vars:            ${removed.length}`);
  console.log(`  added vars:              ${added.length}`);
  console.log(`  semantic value changes:  ${changed.length}`);
  console.log(`  format-only changes:     ${formatOnly}`);
  for (const s of structural) console.log(`  note: ${s.replace(/[`*]/g, "")}`);

  if (removed.length) {
    console.log("\nRemoved:");
    for (const r of removed) console.log(`  ${r.v}  (${r.ctx})`);
  }
  if (added.length) {
    console.log("\nAdded:");
    for (const r of added) console.log(`  ${r.v}  (${r.ctx})`);
  }
  if (changed.length) {
    console.log("\nSemantic value changes:");
    printTable(
      ["CSS var", "Context", "Token", "Source", "Before", "After", "ΔE"],
      changed.map((c) => [
        c.v,
        c.ctx,
        c.token?.id ?? "?",
        c.token?.file ?? "?",
        c.before,
        c.after,
        c.dE === null ? "" : c.dE.toFixed(2),
      ]),
    );
  }
}

function printTable(head, rows) {
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const line = (r) => "  " + r.map((c, i) => String(c).padEnd(widths[i])).join("  ");
  console.log(line(head));
  console.log("  " + widths.map((w) => "-".repeat(w)).join("  "));
  for (const r of rows) console.log(line(r));
}

function renderReport({ a, b, step, removed, added, changed, formatOnly, formatExamples, structural }) {
  const md = [];
  md.push(`# ${step ? `Step ${step}: ` : ""}${a.name} → ${b.name}`);
  md.push("");
  md.push(`Generated ${new Date().toISOString()} by \`scripts/css-diff.mjs\`.`);
  md.push("");
  md.push("| | Before | After |");
  md.push("|---|---|---|");
  md.push(`| Snapshot | \`${a.name}\` | \`${b.name}\` |`);
  md.push(`| Terrazzo | ${a.meta.terrazzo} | ${b.meta.terrazzo} |`);
  md.push("");
  md.push("| Result | Count |");
  md.push("|---|---|");
  md.push(`| Removed vars | ${removed.length} |`);
  md.push(`| Added vars | ${added.length} |`);
  md.push(`| Semantic value changes | ${changed.length} |`);
  md.push(`| Format-only changes | ${formatOnly} |`);
  md.push("");

  if (structural.length) {
    md.push("## Structural notes", "");
    for (const s of structural) md.push(`- ${s}`);
    md.push("");
  }
  if (removed.length) {
    md.push("## Removed vars", "", "| CSS var | Context |", "|---|---|");
    for (const r of removed) md.push(`| \`${r.v}\` | ${r.ctx} |`);
    md.push("");
  }
  if (added.length) {
    md.push("## Added vars", "", "| CSS var | Context |", "|---|---|");
    for (const r of added) md.push(`| \`${r.v}\` | ${r.ctx} |`);
    md.push("");
  }
  if (changed.length) {
    md.push("## Semantic value changes", "");
    md.push("| CSS var | Context | Token | Source | Before | After | ΔE | Raw before | Raw after |");
    md.push("|---|---|---|---|---|---|---|---|---|");
    for (const c of changed) {
      md.push(
        `| \`${c.v}\` | ${c.ctx} | \`${c.token?.id ?? "?"}\` | ${c.token?.file ?? "?"} | \`${c.before}\` | \`${c.after}\` | ${
          c.dE === null ? "" : c.dE.toFixed(2)
        } | \`${c.rawA}\` | \`${c.rawB}\` |`,
      );
    }
    md.push("");
  }
  if (formatExamples.length) {
    md.push("## Format-only changes (examples)", "");
    md.push("Same resolved value, different CSS text.", "");
    md.push("| CSS var | Context | Before | After |", "|---|---|---|---|");
    for (const e of formatExamples) md.push(`| \`${e.v}\` | ${e.ctx} | \`${e.rawA}\` | \`${e.rawB}\` |`);
    md.push("");
  }
  return md.join("\n");
}
