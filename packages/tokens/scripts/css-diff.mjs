#!/usr/bin/env node
/**
 * One-time migration harness: snapshot the Terrazzo CSS output and compare two
 * snapshots semantically (resolved, normalized values per selector).
 *
 *   node scripts/css-diff.mjs snapshot <name>
 *   node scripts/css-diff.mjs compare <a> <b> [--step <n>] [--drift [--out <file.md>]]
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
else if (cmd === "compare" && args[0] && args[1]) compare(args[0], args[1], flag("--step"), args.includes("--drift") && (flag("--out") ?? "figma-code-drift.md"));
else {
  console.error("Usage: css-diff.mjs snapshot <name> | compare <a> <b> [--step <n>] [--drift [--out <file.md>]]");
  process.exit(1);
}

function flag(name) {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
}

// ---------------------------------------------------------------- snapshot

function snapshot(name) {
  const tz = [PKG, ROOT].map((d) => join(d, "node_modules/.bin/tz")).find(existsSync);
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
  const file = [PKG, ROOT].map((d) => join(d, "node_modules/@terrazzo/cli/package.json")).find(existsSync);
  const pkg = JSON.parse(readFileSync(file, "utf8"));
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

function compare(aName, bName, step, drift) {
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
  if (drift) writeDriftReport({ a, b, changed, file: drift });
}

// ---------------------------------------------------------------- drift report

/**
 * Team-facing report of every place code and Figma disagree, from the CSS
 * compare plus figma/sync-meta.json written by figma-pull.mjs.
 */
function writeDriftReport({ a, b, changed, file }) {
  const metaFile = join(PKG, "figma/sync-meta.json");
  if (!existsSync(metaFile)) throw new Error("No figma/sync-meta.json — run figma-pull.mjs first");
  const meta = JSON.parse(readFileSync(metaFile, "utf8"));
  const figmaName = (v) => meta.matched[v]?.figma ?? "";
  const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

  // theme-*.css mirror the tokens.css theme blocks; report tokens.css only.
  // "Direct" = the token's own value changed; "follows" = it aliases a token that changed.
  const rows = changed.filter((c) => c.ctx.startsWith("tokens.css"));
  const direct = rows.filter((c) => c.rawA !== c.rawB);
  const follows = rows.filter((c) => c.rawA === c.rawB);

  const root = a.contexts.get("tokens.css :root").scope;
  const codeOnly = meta.codeOnly.map((c) => ({ ...c, value: root.has(c.css) ? resolveValue(root.get(c.css), root) : "" }));
  const words = (css) => css.replace(/^--nys-/, "").split("-");
  const similar = (x, y) => {
    const [p, q] = [words(x), words(y)];
    return p.join("") === q.join("") || p.every((w) => q.includes(w)) || q.every((w) => p.includes(w));
  };
  const renames = [];
  for (const c of codeOnly) {
    for (const f of meta.figmaOnly) {
      if (similar(c.css, f.css) && normalizeValue(c.value) === normalizeValue(f.value)) renames.push({ code: c, figma: f });
    }
  }

  const md = [];
  md.push("# Figma ↔ code token drift", "");
  md.push(`Generated ${new Date().toISOString()} by \`scripts/css-diff.mjs --drift\`.`, "");
  md.push(`Figma file \`${meta.fileKey}\`, fetched ${meta.fetched}. Code before sync: snapshot \`${a.name}\`; after: \`${b.name}\`.`, "");
  md.push("Figma is the source of truth: every **Value differs** row is now the Figma value in `tokens.css`.");
  md.push("Fill in **Team resolution** (e.g. \"Figma correct\", \"fix in Figma\", \"intentional\").", "");
  md.push("| Section | Count |", "|---|---|");
  md.push(`| Value differs (code changed to Figma) | ${direct.length} |`);
  md.push(`| Follows a changed alias | ${follows.length} |`);
  md.push(`| In code, missing in Figma (kept) | ${codeOnly.length} |`);
  md.push(`| In Figma, missing in code (not published) | ${meta.figmaOnly.length} |`);
  md.push(`| Possible renames | ${renames.length} |`);
  md.push(`| Type/unit mismatches (kept code) | ${meta.mismatches.length} |`);
  md.push("");

  md.push("## Value differs", "");
  md.push("| CSS var | Context | Figma variable | Code (before) | Figma (now) | ΔE | Code raw | Figma raw | Team resolution |");
  md.push("|---|---|---|---|---|---|---|---|---|");
  for (const c of direct) {
    const ctx = c.ctx.replace("tokens.css ", "").replace(/^\.nys-theme-(\w+).*/, "theme: $1");
    md.push(
      `| \`${c.v}\` | ${ctx} | ${esc(figmaName(c.v))} | \`${c.before}\` | \`${c.after}\` | ${c.dE === null ? "" : c.dE.toFixed(2)} | \`${esc(c.rawA)}\` | \`${esc(c.rawB)}\` | |`,
    );
  }
  md.push("");

  if (follows.length) {
    md.push("## Follows a changed alias", "");
    md.push("Unchanged tokens whose resolved value moved because a token they alias changed above.", "");
    md.push("| CSS var | Context | Aliases | Before | Now |", "|---|---|---|---|---|");
    for (const c of follows) md.push(`| \`${c.v}\` | ${c.ctx.replace("tokens.css ", "")} | \`${esc(c.rawB)}\` | \`${c.before}\` | \`${c.after}\` |`);
    md.push("");
  }

  md.push("## In code, missing in Figma", "");
  md.push("No Figma variable maps to these, so they keep their code value. Add them to Figma or deprecate them.", "");
  md.push("| CSS var | Token | Value | Team resolution |", "|---|---|---|---|");
  for (const c of codeOnly) md.push(`| \`${c.css}\` | \`${c.path}\` | \`${esc(c.value)}\` | |`);
  md.push("");

  md.push("## In Figma, missing in code", "");
  md.push("Not published. To publish one, add its CSS name → token path to `add` in `figma.config.mjs`.", "");
  md.push("| CSS var (derived) | Figma variable | Type | Value | Team resolution |", "|---|---|---|---|---|");
  for (const f of meta.figmaOnly) md.push(`| \`${f.css}\` | ${esc(f.figma)} | ${f.type} | \`${esc(f.value)}\` | |`);
  md.push("");

  md.push("## Possible renames", "");
  md.push("A code-only and a Figma-only variable with similar names and the same value — likely the same token named differently.", "");
  md.push("| Code CSS var | Figma variable | Value | Team resolution |", "|---|---|---|---|");
  for (const r of renames) md.push(`| \`${r.code.css}\` | ${esc(r.figma.figma)} (\`${r.figma.css}\`) | \`${esc(r.code.value)}\` | |`);
  md.push("");

  md.push("## Type/unit mismatches", "");
  if (meta.mismatches.length) {
    md.push("| CSS var | Figma variable | Problem | Alias chain |", "|---|---|---|---|");
    for (const m of meta.mismatches) md.push(`| \`${m.css}\` | ${esc(m.figma)} | ${esc(m.reason)} | ${esc(m.chain?.join(" → "))} |`);
  } else {
    md.push("None.");
  }
  md.push("");

  md.push("## Not synced", "");
  if (meta.unmappedThemeModes.length) md.push(`- Theme modes with no theme in code: ${meta.unmappedThemeModes.map((m) => `**${m}**`).join(", ")}`);
  if (meta.breakpointVariance.length) {
    md.push(`- ${meta.breakpointVariance.length} variables differ by Responsive mode; code uses **${"Mobile"}** (\`modes.Responsive\` in figma.config.mjs):`);
    for (const v of meta.breakpointVariance) md.push(`  - \`${v.css}\`: ${esc(JSON.stringify(v.values))}`);
  }
  if (meta.warnings.length) for (const w of meta.warnings) md.push(`- \`${w.css}\`: ${esc(w.warning)}`);
  md.push("");

  writeFileSync(join(REPORTS, file), md.join("\n"));
  console.log(`Drift report → ${relative(ROOT, join(REPORTS, file))}`);
  console.log(`  value differs: ${direct.length} (+${follows.length} via aliases), code-only: ${codeOnly.length}, figma-only: ${meta.figmaOnly.length}, renames: ${renames.length}`);
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
