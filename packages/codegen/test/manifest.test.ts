import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, listComponents } from "../dist/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) => path.join(here, "fixtures", name);

const future = loadManifest(fixture("manifest.json"));
const today = loadManifest(fixture("manifest-today.json"));

test("loadManifest rejects a file that is not a manifest", () => {
  assert.throws(
    () => loadManifest(fixture("not-a-manifest.json")),
    /missing "modules"/
  );
  assert.throws(() => loadManifest(fixture("missing.json")), /Cannot read/);
});

test("listComponents returns every component, sorted by tag", () => {
  const tags = listComponents(future).map((component) => component.tag);
  assert.deepEqual(tags, [
    "nys-accordion",
    "nys-accordionitem",
    "nys-button",
    "nys-checkbox",
    "nys-fileinput",
    "nys-option",
    "nys-select",
    "nys-textinput",
  ]);
});

test("naming and packaging fields derive from the manifest", () => {
  const byTag = new Map(
    listComponents(future).map((component) => [component.tag, component])
  );
  const item = byTag.get("nys-accordionitem")!;
  assert.equal(item.className, "NysAccordionItem");
  assert.equal(item.packageName, "@nysds/nys-accordion");
  assert.equal(item.subpath, "accordionitem");

  // Sub-component in a shared package.
  const option = byTag.get("nys-option")!;
  assert.equal(option.packageName, "@nysds/nys-select");
});

test("props filter out private, static, deprecated, and Lit members", () => {
  const textinput = listComponents(future).find(
    (component) => component.tag === "nys-textinput"
  )!;
  const names = textinput.props.map((prop) => prop.name);
  assert.ok(names.includes("label"));
  assert.ok(names.includes("showError"));
  for (const hidden of [
    "_inputEl",
    "showPassword",
    "legacyMask",
    "updateComplete",
    "shadowRootOptions",
    "checkValidity",
  ]) {
    assert.ok(!names.includes(hidden), `${hidden} must be filtered`);
  }
});

test("prop metadata: attribute mapping, type flags, union collapsing", () => {
  const textinput = listComponents(future).find(
    (component) => component.tag === "nys-textinput"
  )!;
  const byName = new Map(textinput.props.map((prop) => [prop.name, prop]));

  assert.equal(byName.get("showError")!.attribute, "show-error");
  assert.equal(byName.get("showError")!.isBoolean, true);

  const maxlength = byName.get("maxlength")!;
  assert.equal(maxlength.type, "number | null");
  assert.equal(maxlength.isNumber, true);
  assert.equal(maxlength.isPrimitive, true);

  const width = byName.get("width")!;
  assert.equal(width.type, '"sm" | "md" | "lg" | "full"');
  assert.equal(width.isPrimitive, true);
  assert.equal(width.isBoolean, false);
});

test("events: deprecated events are dropped, aliases and fallbacks kept", () => {
  const fileinput = listComponents(future).find(
    (component) => component.tag === "nys-fileinput"
  )!;
  const names = fileinput.events.map((event) => event.name);
  assert.ok(!names.includes("nys-fileRemove"), "deprecated event filtered");

  const change = fileinput.events.find((event) => event.name === "nys-change")!;
  assert.equal(change.typeText, "NysFileinputChangeEvent");
  assert.equal(change.reactProp, "onNysChange");
  assert.equal(change.angularOutput, "nysChange");

  // Today's manifest: bare types stay usable.
  const textinput = listComponents(today).find(
    (component) => component.tag === "nys-textinput"
  )!;
  const input = textinput.events.find((event) => event.name === "nys-input")!;
  assert.equal(input.typeText, "CustomEvent");
});

test("formControl metadata flows through when present, absent today", () => {
  const futureTextinput = listComponents(future).find(
    (component) => component.tag === "nys-textinput"
  )!;
  assert.deepEqual(futureTextinput.formControl, {
    kind: "value",
    changeEvent: "nys-change",
    inputEvent: "nys-input",
  });

  for (const component of listComponents(today)) {
    assert.equal(component.formControl, undefined);
  }
});

test("slots surface with names and descriptions", () => {
  const textinput = listComponents(future).find(
    (component) => component.tag === "nys-textinput"
  )!;
  assert.deepEqual(
    textinput.slots.map((slot) => slot.name),
    ["description", "endButton"]
  );
});
