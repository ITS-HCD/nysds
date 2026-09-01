import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFormControlTag } from "../dist/index.js";
import { formControlPlugin } from "../cem-plugins/form-control.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const readManifest = (name: string) =>
  JSON.parse(fs.readFileSync(path.join(here, "fixtures", name), "utf8"));

test("parseFormControlTag accepts the documented grammar", () => {
  assert.deepEqual(parseFormControlTag("value nys-change nys-input"), {
    kind: "value",
    changeEvent: "nys-change",
    inputEvent: "nys-input",
  });
  assert.deepEqual(parseFormControlTag("checked nys-change"), {
    kind: "checked",
    changeEvent: "nys-change",
  });
  assert.deepEqual(parseFormControlTag("  files   nys-change  "), {
    kind: "files",
    changeEvent: "nys-change",
  });
});

test("parseFormControlTag throws on malformed tags", () => {
  assert.throws(() => parseFormControlTag("banana nys-change"), /kind/);
  assert.throws(() => parseFormControlTag("value"), /expects/);
  assert.throws(() => parseFormControlTag(""), /expects/);
  assert.throws(
    () => parseFormControlTag("value nys-change nys-input extra"),
    /expects/
  );
  assert.throws(() => parseFormControlTag("value change"), /event/);
  assert.throws(() => parseFormControlTag("value nys-change input"), /event/);
});

/**
 * Minimal stand-in for the analyzer's analyzePhase inputs: a class node
 * whose JSDoc carries one @formControl tag.
 */
function fakeAnalyzeArgs(comment: string) {
  return {
    ts: { isClassDeclaration: () => true },
    node: {
      jsDoc: [
        {
          tags: [{ tagName: { getText: () => "formControl" }, comment }],
        },
      ],
      name: { getText: () => "NysFake" },
    },
    moduleDoc: {
      path: "packages/nys-fake/src/nys-fake.ts",
      declarations: [{ kind: "class", name: "NysFake" }],
    },
  };
}

test("a malformed tag fails the analyze run with the file path", () => {
  const plugin = formControlPlugin({ strict: false });
  assert.throws(
    () => plugin.analyzePhase(fakeAnalyzeArgs("banana nys-change")),
    (error: Error) => {
      assert.match(error.message, /packages\/nys-fake\/src\/nys-fake\.ts/);
      assert.match(error.message, /kind/);
      return true;
    }
  );
});

test("a well-formed tag lands on the declaration at link time", () => {
  const plugin = formControlPlugin({ strict: false });
  const args = fakeAnalyzeArgs("value nys-change nys-input");
  plugin.analyzePhase(args);
  const manifest = { modules: [args.moduleDoc] };
  plugin.packageLinkPhase({ customElementsManifest: manifest });
  assert.deepEqual(
    (manifest.modules[0].declarations[0] as { formControl?: unknown })
      .formControl,
    { kind: "value", changeEvent: "nys-change", inputEvent: "nys-input" }
  );
});

test("strict mode throws when a form component misses the tag", () => {
  const plugin = formControlPlugin({ strict: true });
  assert.throws(
    () =>
      plugin.packageLinkPhase({
        customElementsManifest: readManifest("manifest-today.json"),
      }),
    (error: Error) => {
      assert.match(error.message, /NysTextinput/);
      assert.match(error.message, /NysCheckbox/);
      assert.match(error.message, /NysToggle/);
      assert.doesNotMatch(error.message, /NysButton/, "allowlisted");
      return true;
    }
  );
});

test("strict: false logs one warning instead of throwing", (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const plugin = formControlPlugin({ strict: false });
  plugin.packageLinkPhase({
    customElementsManifest: readManifest("manifest-today.json"),
  });
  assert.equal(warn.mock.callCount(), 1);
  const message = String(warn.mock.calls[0].arguments[0]);
  assert.match(message, /NysTextinput/);
  assert.match(message, /strict: false/);
});

test("a manifest with formControl everywhere passes strict mode", () => {
  const plugin = formControlPlugin({ strict: true });
  const manifest = readManifest("manifest.json");
  plugin.packageLinkPhase({ customElementsManifest: manifest });
  // Attachment path: declarations keep their formControl blocks.
  const textinput = manifest.modules
    .flatMap((mod: { declarations?: { name: string }[] }) => mod.declarations ?? [])
    .find((decl: { name: string }) => decl.name === "NysTextinput");
  assert.ok(textinput.formControl);
});

test("a custom allowlist replaces the default", (t) => {
  t.mock.method(console, "warn", () => {});
  const plugin = formControlPlugin({ strict: true, allowlist: [] });
  assert.throws(
    () =>
      plugin.packageLinkPhase({
        customElementsManifest: readManifest("manifest-today.json"),
      }),
    /NysButton/
  );
});
