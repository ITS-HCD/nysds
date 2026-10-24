/**
 * Parsing, resolution and normalization of CSS custom properties, used by
 * css-diff.mjs to compare Terrazzo builds semantically rather than textually.
 */

/** Parse a stylesheet into [{ selector, decls: Map<name, value> }]. */
export function parseBlocks(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [];
  const stack = [];
  let buf = "";
  for (const ch of src) {
    if (ch === "{") {
      stack.push(buf.trim());
      buf = "";
    } else if (ch === "}") {
      const prelude = stack.pop();
      const body = buf;
      buf = "";
      if (prelude === undefined || prelude.startsWith("@")) continue;
      const wrappers = stack.filter((s) => s.startsWith("@"));
      const decls = new Map();
      for (const part of splitTopLevel(body, ";")) {
        const i = part.indexOf(":");
        if (i === -1) continue;
        const name = part.slice(0, i).trim();
        if (name.startsWith("--")) decls.set(name, part.slice(i + 1).trim());
      }
      blocks.push({ selector: [...wrappers, normalizeSelector(prelude)].join(" "), decls });
    } else {
      buf += ch;
    }
  }
  return blocks;
}

export function normalizeSelector(sel) {
  return sel
    .split(",")
    .map((s) => s.trim().replace(/\s+/g, " ").replace(/'/g, '"'))
    .filter(Boolean)
    .sort()
    .join(", ");
}

/** Split on a delimiter, ignoring delimiters inside parentheses or quotes. */
export function splitTopLevel(str, delim) {
  const out = [];
  let depth = 0;
  let quote = null;
  let cur = "";
  for (const ch of str) {
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (depth === 0 && ch === delim) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

/**
 * Resolve var() references against a scope (Map of name → raw value).
 * Unresolvable references are kept as `var(--x)` so they still compare.
 */
export function resolveValue(value, scope, seen = new Set()) {
  let out = "";
  let i = 0;
  while (i < value.length) {
    const start = value.indexOf("var(", i);
    if (start === -1) {
      out += value.slice(i);
      break;
    }
    out += value.slice(i, start);
    let depth = 0;
    let end = start + 3;
    for (; end < value.length; end++) {
      if (value[end] === "(") depth++;
      else if (value[end] === ")" && --depth === 0) break;
    }
    const inner = value.slice(start + 4, end);
    const [name, ...rest] = splitTopLevel(inner, ",");
    const ref = name.trim();
    const fallback = rest.length ? rest.join(",").trim() : null;
    if (scope.has(ref) && !seen.has(ref)) {
      out += resolveValue(scope.get(ref), scope, new Set([...seen, ref]));
    } else if (fallback !== null) {
      out += resolveValue(fallback, scope, seen);
    } else {
      out += `var(${ref})`;
    }
    i = end + 1;
  }
  return out;
}

/** Parse a CSS color into { r, g, b, a } (0–1), or null if not a color we know. */
export function parseColor(str) {
  const s = str.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    const n = (o) => parseInt(h.slice(o, o + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  }
  m = s.match(/^rgba?\((.*)\)$/);
  if (m) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const ch = (p) => (p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p) / 255);
    return { r: ch(parts[0]), g: ch(parts[1]), b: ch(parts[2]), a: alpha(parts[3]) };
  }
  m = s.match(/^color\(\s*srgb\s+(.*)\)$/);
  if (m) {
    const parts = m[1].split(/[\s/]+/).filter(Boolean);
    const ch = (p) => (p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p));
    return { r: ch(parts[0]), g: ch(parts[1]), b: ch(parts[2]), a: alpha(parts[3]) };
  }
  if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  return null;
}

function alpha(p) {
  if (p === undefined || p === "none") return 1;
  return p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p);
}

/** Canonical 8-bit hex form, used to decide whether two colors are the same. */
export function colorKey({ r, g, b, a }) {
  const h = (v) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}${a < 1 ? h(a) : ""}`;
}

function normalizeNumber(tok) {
  const m = tok.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
  if (!m) return tok;
  const n = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  if (n === 0 && unit !== "%") return "0";
  return `${Number(n.toFixed(6))}${unit}`;
}

/** Normalize a resolved value so format-only differences compare equal. */
export function normalizeValue(value) {
  return splitTopLevel(value, ",")
    .map((part) =>
      tokenize(part.trim())
        .map((tok) => {
          const c = parseColor(tok);
          if (c) return colorKey(c);
          if (/^["']/.test(tok)) return `"${tok.slice(1, -1)}"`;
          return normalizeNumber(tok);
        })
        .join(" "),
    )
    .join(", ");
}

/** Split on whitespace, keeping parenthesized groups and quoted strings whole. */
function tokenize(str) {
  return splitTopLevel(str.replace(/\s+/g, " "), " ").map((t) => t.trim()).filter(Boolean);
}

/** If the value is a single color, return it parsed; else null. */
export function singleColor(value) {
  return parseColor(value.trim());
}

// ΔE in OKLab, scaled ×100 so ~1 is a just-noticeable difference.
export function deltaE(c1, c2) {
  const [l1, a1, b1] = toOklab(c1);
  const [l2, a2, b2] = toOklab(c2);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2) * 100;
}

function toOklab({ r, g, b }) {
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
