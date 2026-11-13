import assert from "node:assert/strict";
import { test } from "node:test";
import {
  convert,
  figmaColor,
  figmaCSSName,
  figmaDimension,
  figmaHex,
  figmaTokenPath,
  formatJSON,
  toDTCG,
} from "./figma-to-dtcg.mjs";

test("Figma names map to NYSDS CSS custom properties", () => {
  assert.equal(figmaCSSName("Color", "p-color-unpublished/blue/600"), "--nys-color-blue-600");
  assert.equal(figmaCSSName("Semantic", "!-nys/color-@/text-weak"), "--nys-color-text-weak");
  assert.equal(figmaCSSName("Semantic", "!-nys/font-weight/ui/Semi Bold"), "--nys-font-weight-ui-semi-bold");
  assert.equal(figmaCSSName("Typography", "p-type-unpublished/@-font-lineheight/display/xl"), "--nys-font-lineheight-display-xl");
  assert.equal(figmaCSSName("Accordion Items", "Item 1"), null);
});

test("Figma names map to DTCG token paths", () => {
  assert.equal(figmaTokenPath("Color", "p-color-unpublished/blue/600"), "primitive.color.blue.600");
  assert.equal(figmaTokenPath("Semantic", "!-nys/color-#/theme-mid"), "applied.color.theme-mid");
  assert.equal(figmaTokenPath("Typography", "p-type-unpublished/#-font-size/2xl"), "font.size.2xl");
  assert.equal(figmaTokenPath("Space and Size", "p-space-unpublished/@-border-width/sm"), "border.width.sm");
});

test("Figma RGBA floats become hex and DTCG colors", () => {
  assert.equal(figmaHex({ r: 0, g: 0.302, b: 0.8196, a: 1 }), "#004dd1");
  assert.equal(figmaHex({ r: 1, g: 1, b: 1, a: 0.1 }), "#ffffff1a");
  assert.deepEqual(figmaColor({ r: 0, g: 0, b: 0, a: 0.1 }), {
    colorSpace: "srgb",
    components: [0, 0, 0],
    alpha: 0.102,
    hex: "#000000",
  });
  assert.equal("alpha" in figmaColor({ r: 1, g: 1, b: 1, a: 1 }), false);
});

test("Figma px become rem, except configured px tokens", () => {
  assert.deepEqual(figmaDimension(24, "--nys-space-300"), { value: 1.5, unit: "rem" });
  assert.deepEqual(figmaDimension(1, "--nys-space-1px"), { value: 1, unit: "px" });
  assert.deepEqual(figmaDimension(1776, "--nys-radius-round"), { value: 1776, unit: "px" });
});

test("toDTCG converts by token $type", () => {
  assert.deepEqual(toDTCG("fontFamily", "STRING", "D Sari", "--x").value, ["D Sari", "Arial", "sans-serif"]);
  assert.ok(toDTCG("fontFamily", "STRING", "Comic Sans MS", "--x").warning);
  assert.equal(toDTCG("fontWeight", "STRING", "Semi Bold", "--x").value, 600);
  assert.ok(toDTCG("fontWeight", "STRING", "Regular Italic", "--x").error);
  assert.ok(toDTCG("dimension", "COLOR", { r: 0, g: 0, b: 0, a: 1 }, "--x").error);
});

/** Minimal Variables API response: one primitive, one themed semantic alias. */
function fixture() {
  const color = (r, g, b) => ({ r, g, b, a: 1 });
  return {
    status: 200,
    error: false,
    meta: {
      variableCollections: {
        C: { id: "C", name: "Color", modes: [{ modeId: "c", name: "Values" }], defaultModeId: "c", variableIds: ["blue", "teal", "gray"] },
        T: {
          id: "T",
          name: "Theme",
          modes: [
            { modeId: "nys", name: "NYS" },
            { modeId: "biz", name: "Business (NYS)" },
          ],
          defaultModeId: "nys",
          variableIds: ["tTheme"],
        },
        S: { id: "S", name: "Semantic", modes: [{ modeId: "s", name: "Mode 1" }], defaultModeId: "s", variableIds: ["sTheme"] },
      },
      variables: {
        blue: { id: "blue", name: "p-color-unpublished/state-blue/700", variableCollectionId: "C", resolvedType: "COLOR", valuesByMode: { c: color(0, 0, 1) } },
        teal: { id: "teal", name: "p-color-unpublished/business-teal/600", variableCollectionId: "C", resolvedType: "COLOR", valuesByMode: { c: color(0, 1, 1) } },
        gray: { id: "gray", name: "p-color-unpublished/gray/500", variableCollectionId: "C", resolvedType: "COLOR", valuesByMode: { c: color(0.5, 0.5, 0.5) } },
        tTheme: {
          id: "tTheme",
          name: "theme-unpublished/theme/theme",
          variableCollectionId: "T",
          resolvedType: "COLOR",
          valuesByMode: { nys: { type: "VARIABLE_ALIAS", id: "blue" }, biz: { type: "VARIABLE_ALIAS", id: "teal" } },
        },
        sTheme: {
          id: "sTheme",
          name: "!-nys/color-#/theme",
          variableCollectionId: "S",
          resolvedType: "COLOR",
          description: "Main brand color.",
          valuesByMode: { s: { type: "VARIABLE_ALIAS", id: "tTheme" } },
        },
      },
    },
  };
}

test("convert resolves aliases through unpublished collections, per theme", () => {
  const manual = { shadow: { $type: "shadow", raised: { $value: { color: "#000", offsetX: "0", offsetY: "0", blur: "0", spread: "0" } } } };
  const { tokens, themes, meta } = convert(fixture(), manual);

  assert.deepEqual(tokens.applied.color.theme, {
    $type: "color",
    $value: "{primitive.color.state-blue.700}",
    $description: "Main brand color.",
  });
  assert.equal(themes.business.applied.color.theme.$value, "{primitive.color.business-teal.600}");
  assert.equal(themes.health.applied, undefined); // no "Health (NYS)" mode → no overrides
  assert.equal(tokens.primitive.color.gray, undefined); // excluded: --nys-color-gray-*
  assert.deepEqual(meta.excluded.map((e) => e.css), ["--nys-color-gray-500"]);
  assert.equal(tokens.shadow.raised.$type, "shadow"); // manual token merged
  assert.deepEqual(meta.manual, [{ css: "--nys-shadow-raised", path: "shadow.raised" }]);
});

test("formatJSON inlines flat values but not token or group objects", () => {
  const out = formatJSON({ a: { $type: "dimension", b: { $value: { value: 1, unit: "rem" } } }, f: ["x", "y"] });
  assert.equal(
    out,
    '{\n  "a": {\n    "$type": "dimension",\n    "b": {\n      "$value": { "value": 1, "unit": "rem" }\n    }\n  },\n  "f": ["x", "y"]\n}\n',
  );
});
