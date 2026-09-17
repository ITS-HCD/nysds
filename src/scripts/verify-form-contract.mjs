// Verifies the WS1 form-component event and property contract against the
// root custom-elements.json (the manifest `npm run cem` writes).
//
// Rules (from .claude/plans/framework-support/01-component-event-contract.md,
// "Manifest verification"):
//   1. Every form component declaration carries formControl { kind, changeEvent }
//      with kind in value | checked | files, and there are at least
//      FORM_COMPONENT_MIN of them.
//   2. Every events[].type.text on a nys-* declaration is a named alias
//      (NysSomethingEvent) or plain Event — never bare CustomEvent, never
//      missing. @internal events keep their alias types, so they pass the
//      same check.
//   3. nys-checkboxgroup and nys-radiogroup declare a nys-change event.
//   4. Event names are lowercase kebab-case (allowlist below).
//   5. No public member (privacy undefined or "public") starts with "_".
//   6. formControl.changeEvent (and inputEvent when present) appear in the
//      declaration's own events list.
//
// Usage, after `npm run cem`, from the repo root:
//   node src/scripts/verify-form-contract.mjs
// Exits 1 and lists every violation when the manifest breaks the contract.
import { readFile } from "node:fs/promises";
import {
  NYS_PREFIX,
  listComponents,
  normalizeTypeText,
} from "@nysds/codegen/cem-plugins/lib/core.mjs";

/**
 * The contract covers eleven names today: textinput, textarea, select,
 * checkbox, checkboxgroup, radiobutton, radiogroup, toggle, fileinput,
 * datepicker, combobox. The list is derived from the manifest (declarations
 * carrying a formControl block), never hard-coded; this floor catches a
 * regression that silently drops several of them.
 */
const FORM_COMPONENT_MIN = 10;

/** Mirrors FORM_CONTROL_KINDS in @nysds/codegen/cem-plugins/lib/core.mjs. */
const FORM_CONTROL_KINDS = new Set(["value", "checked", "files"]);

/** Named event alias exported by a component package, e.g. NysTextinputInputEvent. */
const EVENT_ALIAS_RE = /^Nys[A-Za-z]+Event$/;

/**
 * Rule 4 allowlist. `nys-fileRemove` (nys-fileitem) is the documented
 * deprecated alias of `nys-file-remove`; both fire for the rest of 1.x and
 * the camelCase name is removed in 2.0 (see the WS1 compatibility rule).
 */
const UPPERCASE_EVENT_ALLOWLIST = new Set(["nys-fileRemove"]);

const manifestUrl = new URL("../../custom-elements.json", import.meta.url);
const manifest = JSON.parse(await readFile(manifestUrl, "utf-8"));

/** @type {{rule: number, decl: string, message: string}[]} */
const violations = [];
function fail(rule, decl, message) {
  violations.push({ rule, decl, message });
}

// Raw nys-* class declarations. Rules 2-6 read the manifest directly:
// core.mjs's isPublicMember/isExposedEvent filters exist to hide underscore
// members and deprecated events from wrappers, which would mask exactly the
// violations this script exists to catch.
const declarations = [];
for (const mod of manifest.modules ?? []) {
  for (const decl of mod.declarations ?? []) {
    if (decl.kind !== "class") continue;
    if (typeof decl.tagName !== "string") continue;
    if (!decl.tagName.startsWith(NYS_PREFIX)) continue;
    declarations.push(decl);
  }
}

// --- Rule 1: formControl blocks --------------------------------------------
const formComponents = listComponents(manifest).filter((c) => c.formControl);
if (formComponents.length < FORM_COMPONENT_MIN) {
  fail(
    1,
    "(manifest)",
    `only ${formComponents.length} declarations carry a formControl block; expected at least ${FORM_COMPONENT_MIN}`
  );
}
for (const component of formComponents) {
  const { kind, changeEvent } = component.formControl;
  if (!FORM_CONTROL_KINDS.has(kind)) {
    fail(1, component.tag, `formControl.kind "${kind}" is not value | checked | files`);
  }
  if (typeof changeEvent !== "string" || changeEvent.length === 0) {
    fail(1, component.tag, "formControl.changeEvent is missing");
  }
}

// --- Rules 2, 3, 4: events --------------------------------------------------
let eventCount = 0;
for (const decl of declarations) {
  for (const event of decl.events ?? []) {
    eventCount += 1;

    // Rule 2: type.text is a named alias or Event.
    const typeText = normalizeTypeText(event.type?.text);
    if (typeText === undefined) {
      // A leading {Alias} in the description means the @fires tag was written
      // "name {Type}" instead of "{Type} name", so the analyzer never saw the
      // type. Point at the fix.
      const misplaced = /^\{([A-Za-z]+)\}/.exec(event.description ?? "");
      fail(
        2,
        decl.tagName,
        `event "${event.name}" has no type.text` +
          (misplaced
            ? ` (alias {${misplaced[1]}} sits in the description — write the JSDoc as "@fires {${misplaced[1]}} ${event.name} - ...")`
            : ` (add "@fires {NysAliasEvent} ${event.name} - ..." to the class JSDoc)`)
      );
    } else if (typeText !== "Event" && !EVENT_ALIAS_RE.test(typeText)) {
      fail(
        2,
        decl.tagName,
        `event "${event.name}" has type.text "${typeText}"; expected a Nys*Event alias or Event`
      );
    }

    // Rule 4: lowercase event names.
    if (/[A-Z]/.test(event.name) && !UPPERCASE_EVENT_ALLOWLIST.has(event.name)) {
      fail(4, decl.tagName, `event name "${event.name}" contains an uppercase letter`);
    }
  }
}

// Rule 3: the group components declare nys-change.
for (const tag of ["nys-checkboxgroup", "nys-radiogroup"]) {
  const decl = declarations.find((d) => d.tagName === tag);
  if (!decl) {
    fail(3, tag, "declaration is missing from the manifest");
  } else if (!(decl.events ?? []).some((event) => event.name === "nys-change")) {
    fail(3, tag, "events array has no nys-change entry");
  }
}

// --- Rule 5: no public members with a leading underscore ---------------------
for (const decl of declarations) {
  for (const member of decl.members ?? []) {
    if (member.kind !== "field") continue;
    if (member.privacy !== undefined && member.privacy !== "public") continue;
    if (!member.name?.startsWith("_")) continue;
    fail(
      5,
      decl.tagName,
      `field "${member.name}" is public (privacy: ${member.privacy ?? "undefined"}); mark it @state/private or drop the underscore`
    );
  }
}

// --- Rule 6: formControl events exist on the declaration ---------------------
for (const component of formComponents) {
  const decl = declarations.find((d) => d.tagName === component.tag);
  const names = new Set((decl?.events ?? []).map((event) => event.name));
  for (const key of ["changeEvent", "inputEvent"]) {
    const eventName = component.formControl[key];
    if (eventName !== undefined && !names.has(eventName)) {
      fail(6, component.tag, `formControl.${key} "${eventName}" is not in the declaration's events list`);
    }
  }
}

// --- Report ------------------------------------------------------------------
if (violations.length > 0) {
  violations.sort((a, b) => a.rule - b.rule || a.decl.localeCompare(b.decl));
  for (const { rule, decl, message } of violations) {
    console.error(`rule ${rule} | ${decl}: ${message}`);
  }
  console.error(
    `\nverify-form-contract: ${violations.length} violation(s) across ` +
      `${new Set(violations.map((v) => v.decl)).size} declaration(s). ` +
      "Contract: .claude/plans/framework-support/01-component-event-contract.md"
  );
  process.exit(1);
}

console.log(
  `verify-form-contract: OK — ${declarations.length} components, ` +
    `${formComponents.length} form controls, ${eventCount} events checked.`
);
