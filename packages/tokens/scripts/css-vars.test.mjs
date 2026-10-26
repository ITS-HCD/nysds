import assert from "node:assert/strict";
import { test } from "node:test";
import {
  deltaE,
  normalizeValue,
  parseBlocks,
  parseColor,
  resolveValue,
} from "./lib/css-vars.mjs";
import { variableName } from "./lib/variable-name.mjs";

test("color formats normalize to the same key", () => {
  const same = ["#FFF", "#ffffff", "rgb(255, 255, 255)", "rgb(255 255 255)", "color(srgb 1 1 1)"];
  for (const v of same) assert.equal(normalizeValue(v), "#ffffff", v);
});

test("alpha survives normalization", () => {
  assert.equal(normalizeValue("#0000001a"), "#0000001a");
  assert.equal(normalizeValue("rgb(0 0 0 / 0.1)"), "#0000001a");
  assert.equal(normalizeValue("color(srgb 0 0 0 / 10%)"), "#0000001a");
});

test("numbers drop trailing zeros and unitless zero", () => {
  assert.equal(normalizeValue("0.6250rem"), "0.625rem");
  assert.equal(normalizeValue("0px"), "0");
  assert.equal(normalizeValue("-1px"), "-1px");
});

test("shadow lists normalize per layer", () => {
  assert.equal(
    normalizeValue("0px 4px 6px -1px #0000001A, 0 4px 6px -1px rgb(0 0 0 / 0.0118)"),
    "0 4px 6px -1px #0000001a, 0 4px 6px -1px #00000003",
  );
});

test("font family quotes normalize", () => {
  assert.equal(normalizeValue("'Proxima Nova', sans-serif"), normalizeValue('"Proxima Nova", sans-serif'));
});

test("var() resolves through alias chains and fallbacks", () => {
  const scope = new Map([
    ["--a", "var(--b)"],
    ["--b", "#004dd1"],
  ]);
  assert.equal(resolveValue("var(--a)", scope), "#004dd1");
  assert.equal(resolveValue("var(--missing, 4px)", scope), "4px");
  assert.equal(resolveValue("var(--missing)", scope), "var(--missing)");
});

test("parseBlocks normalizes selector lists", () => {
  const blocks = parseBlocks(`/* x */ :root { --a: 1px; }\n.t-x,\n[data-theme='x'] { --a: 2px; }`);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[1].selector, '.t-x, [data-theme="x"]');
  assert.equal(blocks[1].declarations.get("--a"), "2px");
});

test("deltaE is 0 for identical colors and grows with difference", () => {
  const blue = parseColor("#004dd1");
  assert.equal(deltaE(blue, blue), 0);
  assert.ok(deltaE(blue, parseColor("#004dd2")) < 1);
  assert.ok(deltaE(blue, parseColor("#b52c2c")) > 20);
});

test("variableName strips layer prefixes and -default", () => {
  assert.equal(variableName("primitive.color.blue.600"), "--nys-color-blue-600");
  assert.equal(variableName("applied.color.text.default"), "--nys-color-text");
  assert.equal(variableName("color.theme.default"), "--nys-color-theme");
});
