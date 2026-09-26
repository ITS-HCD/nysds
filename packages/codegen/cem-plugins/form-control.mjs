/**
 * CEM plugin: reads the class-level `@formControl` JSDoc tag and attaches
 * `declaration.formControl = { kind, changeEvent, inputEvent? }` to the
 * manifest.
 *
 * A malformed tag fails the analyze run with the file path. A form component
 * (any class extending the form-control superclass) without the tag throws
 * in strict mode and logs one warning otherwise. The allowlist names classes
 * that extend the superclass but are not bindable form controls.
 */
import { parseFormControlTag } from "./lib/core.mjs";

export function formControlPlugin(options = {}) {
  const {
    strict = true,
    allowlist = ["NysButton", "NysRadiobutton", "NysOption"],
    superclassName = "NysFormControlElement",
  } = options;
  const allowed = new Set(allowlist);

  /** Map<modulePath, Map<className, FormControlMeta>> */
  const collected = new Map();

  return {
    name: "nysds-form-control",

    analyzePhase({ ts, node, moduleDoc }) {
      if (!ts.isClassDeclaration(node) || !("jsDoc" in node)) return;
      const className = node.name?.getText();
      if (!className) return;

      for (const jsdoc of node.jsDoc ?? []) {
        if (!Array.isArray(jsdoc.tags)) continue;
        for (const tag of jsdoc.tags) {
          let tagName;
          try {
            tagName = tag.tagName.getText();
          } catch {
            continue;
          }
          if (tagName !== "formControl") continue;

          let parsed;
          try {
            parsed = parseFormControlTag(
              typeof tag.comment === "string" ? tag.comment : ""
            );
          } catch (error) {
            throw new Error(
              `[nysds-form-control] ${moduleDoc.path}: ${error.message}`
            );
          }

          if (!collected.has(moduleDoc.path)) {
            collected.set(moduleDoc.path, new Map());
          }
          collected.get(moduleDoc.path).set(className, parsed);
        }
      }
    },

    packageLinkPhase({ customElementsManifest }) {
      // Attach collected tags.
      for (const mod of customElementsManifest.modules ?? []) {
        const byClass = collected.get(mod.path);
        if (!byClass) continue;
        for (const decl of mod.declarations ?? []) {
          const formControl = byClass.get(decl.name);
          if (formControl) decl.formControl = formControl;
        }
      }

      // Verify every form component carries the tag.
      const missing = [];
      for (const mod of customElementsManifest.modules ?? []) {
        for (const decl of mod.declarations ?? []) {
          if (decl.kind !== "class") continue;
          if (decl.superclass?.name !== superclassName) continue;
          if (allowed.has(decl.name)) continue;
          if (!decl.formControl) missing.push(`${decl.name} (${mod.path})`);
        }
      }

      if (missing.length > 0) {
        const message =
          `[nysds-form-control] ${missing.length} form component(s) extend ` +
          `${superclassName} but have no @formControl JSDoc tag:\n  - ` +
          missing.join("\n  - ");
        if (strict) throw new Error(message);
        console.warn(`${message}\n  (strict: false — continuing)`);
      }
    },
  };
}
