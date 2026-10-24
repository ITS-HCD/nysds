import assert from "node:assert/strict";
import { test } from "node:test";
import { figmaCSSName, figmaDimension, figmaHex, toDTCG } from "./lib/figma-sync.mjs";

test("Figma names map to NYSDS CSS custom properties", () => {
  assert.equal(figmaCSSName("Color", "p-color-unpublished/blue/600"), "--nys-color-blue-600");
  assert.equal(figmaCSSName("Semantic", "!-nys/color-@/text-weak"), "--nys-color-text-weak");
  assert.equal(figmaCSSName("Semantic", "!-nys/font-weight/ui/Semi Bold"), "--nys-font-weight-ui-semi-bold");
  assert.equal(figmaCSSName("Typography", "p-type-unpublished/@-font-lineheight/display/xl"), "--nys-font-lineheight-display-xl");
  assert.equal(figmaCSSName("Space and Size", "p-space-unpublished/space/100"), "--nys-space-100");
  assert.equal(figmaCSSName("Accordion Items", "Item 1"), null);
});

test("Figma RGBA floats become hex, 8-digit only below full alpha", () => {
  assert.equal(figmaHex({ r: 0, g: 0.302, b: 0.8196, a: 1 }), "#004dd1");
  assert.equal(figmaHex({ r: 1, g: 1, b: 1, a: 0.1 }), "#ffffff1a");
});

test("Figma px become rem, except configured px tokens", () => {
  assert.deepEqual(figmaDimension(24, "--nys-space-300"), { value: 1.5, unit: "rem" });
  assert.deepEqual(figmaDimension(1, "--nys-space-1px"), { value: 1, unit: "px" });
  assert.deepEqual(figmaDimension(2, "--nys-border-width-md"), { value: 2, unit: "px" });
  assert.deepEqual(figmaDimension(1776, "--nys-radius-round"), { value: 1776, unit: "px" });
});

test("toDTCG converts by the code token's $type", () => {
  assert.equal(toDTCG("color", "COLOR", { r: 1, g: 1, b: 1, a: 1 }, "--x").value.hex, "#ffffff");
  assert.deepEqual(toDTCG("fontFamily", "STRING", "D Sari", "--x").value, ["D Sari", "Arial", "sans-serif"]);
  assert.ok(toDTCG("fontFamily", "STRING", "Comic Sans MS", "--x").warning);
  assert.equal(toDTCG("fontWeight", "STRING", "Semi Bold", "--x").value, 600);
  assert.equal(toDTCG("fontWeight", "FLOAT", 200, "--x").value, 200);
  assert.ok(toDTCG("fontWeight", "STRING", "Regular Italic", "--x").error);
  assert.ok(toDTCG("dimension", "COLOR", { r: 0, g: 0, b: 0, a: 1 }, "--x").error);
});
