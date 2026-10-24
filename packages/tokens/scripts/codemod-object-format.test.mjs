import assert from "node:assert/strict";
import { test } from "node:test";
import { colorObject, convertTokens, dimensionObject } from "./codemod-object-format.mjs";
import { formatJSON } from "./lib/format-json.mjs";

test("hex colors become srgb objects with 6-digit hex", () => {
  assert.deepEqual(colorObject("#004dd1"), {
    colorSpace: "srgb",
    components: [0, 0.302, 0.8196],
    hex: "#004dd1",
  });
  assert.deepEqual(colorObject("#FFF").hex, "#ffffff");
});

test("8-digit hex splits alpha out of hex", () => {
  const c = colorObject("#0000001a");
  assert.equal(c.hex, "#000000");
  assert.equal(c.alpha, 0.102);
  assert.equal(Math.round(c.alpha * 255), 0x1a);
});

test("dimensions become value/unit objects", () => {
  assert.deepEqual(dimensionObject("0.625rem"), { value: 0.625, unit: "rem" });
  assert.deepEqual(dimensionObject("-12px"), { value: -12, unit: "px" });
  assert.throws(() => dimensionObject("7%"));
});

test("convertTokens respects inherited $type, skips aliases, converts shadows", () => {
  const doc = {
    color: { $type: "color", a: { $value: "#ffffff" }, b: { $value: "{color.a}" } },
    space: { $type: "dimension", sm: { $value: "4px" } },
    shadow: {
      $type: "shadow",
      s: { $value: { offsetX: "0px", offsetY: "4px", blur: "6px", spread: "-1px", color: "#0000001a" } },
    },
    misc: { $type: "string", t: { $value: "7%" } },
  };
  const { converted } = convertTokens(doc);
  assert.equal(converted, 3);
  assert.equal(doc.color.b.$value, "{color.a}");
  assert.deepEqual(doc.space.sm.$value, { value: 4, unit: "px" });
  assert.deepEqual(doc.shadow.s.$value.offsetY, { value: 4, unit: "px" });
  assert.equal(doc.shadow.s.$value.color.hex, "#000000");
  assert.equal(doc.misc.t.$value, "7%");
});

test("formatJSON inlines flat values but not token or group objects", () => {
  const out = formatJSON({ a: { $type: "dimension", b: { $value: { value: 1, unit: "rem" } } }, f: ["x", "y"] });
  assert.equal(
    out,
    '{\n  "a": {\n    "$type": "dimension",\n    "b": {\n      "$value": { "value": 1, "unit": "rem" }\n    }\n  },\n  "f": ["x", "y"]\n}\n',
  );
});
