/**
 * Pins the naming rules to README.md section 4.1 of the framework-support
 * plan. If one of these assertions changes, every generator changes with it.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  pascalize,
  tagToClass,
  classToAngularClass,
  eventToReactProp,
  eventToAngularOutput,
  tagToSubpath,
  tagToPackage,
  loadManifest,
} from "../dist/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const manifest = loadManifest(path.join(here, "fixtures", "manifest.json"));

test("tag to class: manifest declaration name is authoritative", () => {
  assert.equal(tagToClass("nys-textinput", manifest), "NysTextinput");
  // The manifest capitalizes Item; mechanical PascalCase cannot know that.
  assert.equal(tagToClass("nys-accordionitem", manifest), "NysAccordionItem");
});

test("tag to class: mechanical fallback without a manifest", () => {
  assert.equal(tagToClass("nys-textinput"), "NysTextinput");
  assert.equal(tagToClass("nys-accordionitem"), "NysAccordionitem");
  assert.equal(pascalize("nys-textinput"), "NysTextinput");
});

test("angular component class: class name + Component", () => {
  assert.equal(classToAngularClass("NysTextinput"), "NysTextinputComponent");
  assert.equal(
    classToAngularClass("NysAccordionItem"),
    "NysAccordionItemComponent"
  );
});

test("event to React prop: on + PascalCase of the full event name", () => {
  assert.equal(eventToReactProp("nys-change"), "onNysChange");
  assert.equal(eventToReactProp("nys-input"), "onNysInput");
  assert.equal(eventToReactProp("nys-error-clear"), "onNysErrorClear");
  // Inner capitals in a segment survive.
  assert.equal(eventToReactProp("nys-fileRemove"), "onNysFileRemove");
});

test("event to Angular output: camelCase of the full event name", () => {
  assert.equal(eventToAngularOutput("nys-change"), "nysChange");
  assert.equal(eventToAngularOutput("nys-input"), "nysInput");
  assert.equal(eventToAngularOutput("nys-error-clear"), "nysErrorClear");
  assert.equal(eventToAngularOutput("nys-fileRemove"), "nysFileRemove");
});

test("subpath: the tag minus the prefix", () => {
  assert.equal(tagToSubpath("nys-textinput"), "textinput");
  assert.equal(tagToSubpath("nys-accordionitem"), "accordionitem");
});

test("package name derives from the manifest module path", () => {
  assert.equal(
    tagToPackage("packages/nys-accordion/src/nys-accordionitem.ts"),
    "@nysds/nys-accordion"
  );
  assert.equal(
    tagToPackage("packages/nys-select/src/nys-option.ts"),
    "@nysds/nys-select"
  );
  assert.throws(() => tagToPackage("src/index.ts"), /Cannot derive/);
});
