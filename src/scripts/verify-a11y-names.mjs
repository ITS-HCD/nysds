// Verifies Blink's REAL computed accessible names for the label/error/external cases.
//
// Why this exists: a browser exposes no "computed accessible name" API to page
// scripts, so Web Test Runner can only assert DOM contracts (that an attribute or
// element reference was set) — never that the name actually resolves. The nameability
// of <nys-label> / <nys-errormessage> (whose text lives in their own shadow roots) is
// only observable from the accessibility tree itself, which we read over CDP.
//
// Run AFTER `npm run build:packages`.  Usage: node scripts/verify-a11y-names.mjs
import { chromium } from "playwright";
import * as esbuild from "esbuild";
import { resolve } from "node:path";

// The built bundles leave `lit` externalized as a bare specifier, which a browser
// cannot resolve from an inline module. Bundle them into one self-contained ESM.
const entry = [
  "packages/nys-label/dist/nys-label.js",
  "packages/nys-errormessage/dist/nys-errormessage.js",
  "packages/nys-checkbox/dist/nys-checkbox.js",
  "packages/nys-radiobutton/dist/nys-radiobutton.js",
  "packages/nys-textinput/dist/nys-textinput.js",
]
  .map((p) => `import ${JSON.stringify(resolve(process.cwd(), p))};`)
  .join("\n");

const bundled = await esbuild.build({
  stdin: { contents: entry, resolveDir: process.cwd(), loader: "js" },
  bundle: true,
  format: "esm",
  write: false,
  logLevel: "silent",
});
const componentsJs = bundled.outputFiles[0].text;

// Real components, not synthetic hosts: these assert the shipped markup, so a regression
// in any component's own template is caught here.
const HTML = `<!doctype html><html><body>
  <span id="col">Select row</span>
  <nys-textinput id="ti" label="Full name" showError errorMessage="Required field"></nys-textinput>
  <nys-checkbox id="cbx" labelledby="col" hideLabel></nys-checkbox>
  <nys-radiobutton id="rb" name="p" value="snap" labelledby="col" hideLabel></nys-radiobutton>
  <nys-label id="rowlabel" label="Select HEAP"></nys-label>
  <nys-radiobutton id="rb2" name="p" value="heap" labelledby="rowlabel" hideLabel></nys-radiobutton>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();

const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));

await page.setContent(HTML, { waitUntil: "load" });
// Inject the bundle after setContent so the custom elements upgrade the markup above.
await page.addScriptTag({ content: componentsJs, type: "module" });
await page.waitForFunction(
  () =>
    customElements.get("nys-checkbox") &&
    customElements.get("nys-radiobutton") &&
    customElements.get("nys-label") &&
    customElements.get("nys-errormessage") &&
    customElements.get("nys-textinput"),
  null,
  { timeout: 5000 },
);
// Let the upgraded elements finish their first Lit update.
await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));

const client = await page.context().newCDPSession(page);
await client.send("Accessibility.enable");
const { nodes } = await client.send("Accessibility.getFullAXTree");

const byRole = (role) => nodes.filter((n) => n.role?.value === role);
const nameOf = (n) => n.name?.value ?? "";
const descOf = (n) => n.description?.value ?? "";

const textboxes = byRole("textbox");
const checkboxes = byRole("checkbox");
const radios = byRole("radio");

const checks = [
  // nys-textinput's name comes from <nys-label>, whose text lives in its own shadow
  // root — this resolves only because the label exposes it via internals.ariaLabel.
  ["internal-label", textboxes.some((n) => nameOf(n) === "Full name")],
  // The error reaches the AX tree through aria-describedby, NOT aria-errormessage:
  // Blink never surfaces aria-errormessage for a control inside a shadow root (checked
  // by attribute and by ariaErrorMessageElements reflection; neither appears). The text
  // itself resolves because <nys-errormessage> is nameable via internals.ariaLabel.
  ["internal-error", textboxes.some((n) => descOf(n) === "Required field")],
  // The checkbox borrows its name from a light-DOM <span> that no same-root IDREF
  // could reach — the associateControlRefs element-reference path.
  ["external-th", checkboxes.some((n) => nameOf(n) === "Select row")],
  // nys-radiobutton renders in the LIGHT DOM, so its native <input> and the external
  // element share a tree scope: this is the plain aria-labelledby IDREF path, with no
  // element references involved. Confirms the IDREF really does name the control.
  ["radio-external-idref", radios.some((n) => nameOf(n) === "Select row")],
  // Same IDREF path, but pointing at a <nys-label> whose text lives in ITS shadow
  // root. This resolves only because nys-label mirrors `label` onto its host via
  // internals.ariaLabel — this check guards that dependency.
  ["radio-external-nys-label", radios.some((n) => nameOf(n) === "Select HEAP")],
];

await browser.close();

if (pageErrors.length) {
  console.error("Page errors:\n  " + pageErrors.join("\n  "));
}

let ok = pageErrors.length === 0;
for (const [name, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}`);
  if (!pass) ok = false;
}

if (!ok) {
  // Dump what Blink actually computed, so a failure is diagnosable rather than a
  // bare non-zero exit.
  console.error("\nComputed names Blink reported:");
  for (const n of [...textboxes, ...checkboxes, ...radios]) {
    console.error(
      `  role=${n.role.value} name=${JSON.stringify(nameOf(n))} description=${JSON.stringify(descOf(n))}`,
    );
  }
}

console.log(
  ok ? "\nAll computed-name checks passed." : "\nComputed-name checks FAILED.",
);
process.exit(ok ? 0 : 1);
