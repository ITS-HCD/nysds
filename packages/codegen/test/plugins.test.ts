import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { reactPlugin } from "../cem-plugins/react.mjs";
import { angularPlugin } from "../cem-plugins/angular.mjs";
import { depsPlugin } from "../cem-plugins/deps.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const readManifest = (name: string) =>
  JSON.parse(fs.readFileSync(path.join(here, "fixtures", name), "utf8"));

const tmp = (prefix: string) => fs.mkdtempSync(path.join(os.tmpdir(), prefix));

// ---------------------------------------------------------------------------
// React plugin
// ---------------------------------------------------------------------------

test("react plugin writes one wrapper per component plus a barrel", () => {
  const dir = tmp("nysds-react-");
  const outDir = path.join(dir, "generated");
  reactPlugin({ outDir, overridesDir: path.join(dir, "overrides") })
    .packageLinkPhase({ customElementsManifest: readManifest("manifest.json") });

  const files = fs.readdirSync(outDir).sort();
  assert.deepEqual(files, [
    "NysAccordion.ts",
    "NysAccordionItem.ts",
    "NysButton.ts",
    "NysCheckbox.ts",
    "NysFileinput.ts",
    "NysOption.ts",
    "NysSelect.ts",
    "NysTextinput.ts",
    "index.ts",
  ]);

  const wrapper = fs.readFileSync(path.join(outDir, "NysTextinput.ts"), "utf8");
  assert.ok(wrapper.startsWith('"use client";\n'), "use client banner");
  assert.match(
    wrapper,
    /import { NysTextinput as NysTextinputElement } from "@nysds\/nys-textinput";/
  );
  assert.match(
    wrapper,
    /import type { NysTextinputChangeEvent, NysTextinputInputEvent } from "@nysds\/nys-textinput";/
  );
  assert.match(wrapper, /tagName: "nys-textinput",/);
  assert.match(
    wrapper,
    /onNysInput: "nys-input" as EventName<NysTextinputInputEvent>,/
  );
  assert.match(wrapper, /onNysFocus: "nys-focus" as EventName<Event>,/);
  assert.match(
    wrapper,
    /export type NysTextinputProps = React.ComponentProps<typeof NysTextinput>;/
  );

  // Deprecated events never become props.
  const fileinput = fs.readFileSync(path.join(outDir, "NysFileinput.ts"), "utf8");
  assert.doesNotMatch(fileinput, /onNysFileRemove/);

  const barrel = fs.readFileSync(path.join(outDir, "index.ts"), "utf8");
  assert.match(barrel, /export \* from ".\/NysTextinput.js";/);
});

test("react plugin falls back to CustomEvent typing on today's manifest", () => {
  const dir = tmp("nysds-react-today-");
  const outDir = path.join(dir, "generated");
  reactPlugin({ outDir, overridesDir: path.join(dir, "overrides") })
    .packageLinkPhase({
      customElementsManifest: readManifest("manifest-today.json"),
    });

  const wrapper = fs.readFileSync(path.join(outDir, "NysTextinput.ts"), "utf8");
  assert.match(wrapper, /onNysInput: "nys-input" as EventName<CustomEvent>,/);
  assert.doesNotMatch(wrapper, /import type/);
});

test("react plugin honors overrides and clears stale output", () => {
  const dir = tmp("nysds-react-override-");
  const outDir = path.join(dir, "generated");
  const overridesDir = path.join(dir, "overrides");
  fs.mkdirSync(overridesDir, { recursive: true });
  fs.writeFileSync(path.join(overridesDir, "NysTextinput.ts"), "// override\n");
  // A stale file from an earlier run must disappear.
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "NysRemoved.ts"), "// stale\n");

  reactPlugin({ outDir, overridesDir }).packageLinkPhase({
    customElementsManifest: readManifest("manifest.json"),
  });

  assert.ok(!fs.existsSync(path.join(outDir, "NysTextinput.ts")));
  assert.ok(!fs.existsSync(path.join(outDir, "NysRemoved.ts")));
  const barrel = fs.readFileSync(path.join(outDir, "index.ts"), "utf8");
  assert.match(barrel, /export \* from "..\/overrides\/NysTextinput.js";/);
});

// ---------------------------------------------------------------------------
// Angular plugin
// ---------------------------------------------------------------------------

test("angular plugin writes typed proxies, a barrel, and the module", () => {
  const dir = tmp("nysds-angular-");
  const outDir = path.join(dir, "generated");
  angularPlugin({ outDir, overridesDir: path.join(dir, "overrides") })
    .packageLinkPhase({ customElementsManifest: readManifest("manifest.json") });

  const files = fs.readdirSync(outDir).sort();
  assert.ok(files.includes("nys-textinput.component.ts"));
  assert.ok(files.includes("nys-angular.module.ts"));
  assert.ok(files.includes("index.ts"));

  const textinput = fs.readFileSync(
    path.join(outDir, "nys-textinput.component.ts"),
    "utf8"
  );
  assert.match(textinput, /selector: "nys-textinput",/);
  assert.match(
    textinput,
    /export class NysTextinputComponent extends NysValueAccessor<string> {/
  );
  assert.match(textinput, /NG_VALUE_ACCESSOR/);
  assert.match(
    textinput,
    /protected override readonly changeEvent = "nys-change";/
  );
  assert.match(
    textinput,
    /protected override readonly inputEvent = "nys-input";/
  );
  assert.match(
    textinput,
    /@Input\({ transform: booleanAttribute }\) set required\(v: boolean\)/
  );
  assert.match(
    textinput,
    /@Input\({ transform: numberAttribute }\) set step\(v: number\)/
  );
  // number | null props get a plain @Input.
  assert.match(textinput, /@Input\(\) set maxlength\(v: number \| null\)/);
  assert.match(textinput, /readonly nysInput = output<NysTextinputInputEvent>\(\);/);
  assert.match(
    textinput,
    /@HostListener\("nys-input", \["\$event"\]\).*protected _onNysInput\(e: Event\)/
  );
  assert.match(
    textinput,
    /this\.nysInput\.emit\(\(e as NysTextinputInputEvent\)\);.*this\.handleInput\(\(e as NysTextinputInputEvent\)\);/
  );
  assert.match(
    textinput,
    /@HostListener\("nys-blur", \["\$event"\]\).*protected _onNysBlur\(e: Event\)/
  );
  assert.match(
    textinput,
    /this\.nysBlur\.emit\(e\); this\.handleBlur\(\);/
  );
  // Host-managed props are skipped.
  assert.doesNotMatch(textinput, /set id\(/);

  const checkbox = fs.readFileSync(
    path.join(outDir, "nys-checkbox.component.ts"),
    "utf8"
  );
  assert.match(checkbox, /extends NysCheckedAccessor {/);

  const fileinput = fs.readFileSync(
    path.join(outDir, "nys-fileinput.component.ts"),
    "utf8"
  );
  assert.match(fileinput, /extends NysFilesAccessor {/);

  // Non-form component: no CVA wiring.
  const button = fs.readFileSync(
    path.join(outDir, "nys-button.component.ts"),
    "utf8"
  );
  assert.doesNotMatch(button, /NG_VALUE_ACCESSOR/);
  assert.doesNotMatch(button, /extends/);
  assert.match(button, /export class NysButtonComponent {/);

  const module = fs.readFileSync(
    path.join(outDir, "nys-angular.module.ts"),
    "utf8"
  );
  assert.match(module, /export class NysAngularModule {}/);
  assert.match(module, /NysTextinputComponent,/);

  const barrel = fs.readFileSync(path.join(outDir, "index.ts"), "utf8");
  assert.match(barrel, /export \* from ".\/nys-textinput.component";/);
  assert.match(barrel, /export { NysAngularModule }/);
});

test("angular plugin generates plain wrappers from today's manifest", () => {
  const dir = tmp("nysds-angular-today-");
  const outDir = path.join(dir, "generated");
  angularPlugin({ outDir, overridesDir: path.join(dir, "overrides") })
    .packageLinkPhase({
      customElementsManifest: readManifest("manifest-today.json"),
    });

  const textinput = fs.readFileSync(
    path.join(outDir, "nys-textinput.component.ts"),
    "utf8"
  );
  assert.doesNotMatch(textinput, /NG_VALUE_ACCESSOR/);
  assert.match(textinput, /readonly nysInput = output<CustomEvent>\(\);/);
});

// ---------------------------------------------------------------------------
// Deps plugin
// ---------------------------------------------------------------------------

test("deps plugin rewrites dependencies, peer range, and exports", (t) => {
  const dir = tmp("nysds-deps-");
  const rootPackageJson = path.join(dir, "root-package.json");
  fs.writeFileSync(rootPackageJson, JSON.stringify({ version: "1.21.0" }));

  const reactPkgPath = path.join(dir, "react-package.json");
  fs.writeFileSync(
    reactPkgPath,
    JSON.stringify({
      name: "@nysds/react",
      dependencies: {
        "@lit/react": "^1.0.8",
        "@nysds/nys-removed": "1.0.0",
      },
      peerDependencies: { react: "^18.0.0 || ^19.0.0" },
      exports: {
        ".": { types: "./dist/index.d.ts", import: "./dist/index.js" },
        "./removed": { import: "./dist/generated/NysRemoved.js" },
      },
    })
  );

  const warn = t.mock.method(console, "warn", () => {});
  depsPlugin({
    rootPackageJson,
    targets: [
      { path: reactPkgPath, framework: "react" },
      { path: path.join(dir, "missing-package.json"), framework: "angular" },
    ],
  }).packageLinkPhase({ customElementsManifest: readManifest("manifest.json") });

  // The missing angular package is a warning, not an error.
  assert.equal(warn.mock.callCount(), 1);
  assert.match(String(warn.mock.calls[0].arguments[0]), /missing-package.json/);

  const pkg = JSON.parse(fs.readFileSync(reactPkgPath, "utf8"));
  assert.equal(pkg.dependencies["@lit/react"], "^1.0.8", "kept as written");
  assert.equal(pkg.dependencies["@nysds/nys-textinput"], "1.21.0");
  assert.equal(pkg.dependencies["@nysds/nys-accordion"], "1.21.0");
  assert.equal(pkg.dependencies["@nysds/nys-removed"], undefined, "stale gone");
  assert.equal(pkg.peerDependencies["@nysds/components"], "^1.21.0");
  assert.equal(pkg.peerDependencies.react, "^18.0.0 || ^19.0.0");

  assert.deepEqual(pkg.exports["./textinput"], {
    types: "./dist/generated/NysTextinput.d.ts",
    import: "./dist/generated/NysTextinput.js",
  });
  assert.equal(pkg.exports["./removed"], undefined, "stale subpath gone");
  assert.equal(pkg.exports["./package.json"], undefined, "package.json export not needed");
  assert.ok(pkg.exports["."]);

  // Deterministic ordering.
  const depKeys = Object.keys(pkg.dependencies);
  assert.deepEqual(depKeys, [...depKeys].sort((a, b) => a.localeCompare(b)));
});
