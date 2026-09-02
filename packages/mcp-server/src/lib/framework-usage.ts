/**
 * Framework usage notes
 *
 * Short, framework-specific guidance attached to `get_component` responses
 * when the caller asks for `framework: "react"` or `"angular"` — the import
 * line, the event-prop naming rule, and (when the component is a form
 * control) how it binds into that framework's forms. Naming follows the
 * rules in `.claude/plans/framework-support/README.md` section 4.1, reused
 * here via `@nysds/codegen` rather than re-derived.
 */

import { eventToAngularOutput, eventToReactProp, tagToSubpath } from "@nysds/codegen";
import type { CEMFormControl } from "./cem-parser.js";

export interface FrameworkUsageNotes {
  package: string;
  import: string;
  events: string;
  forms?: string;
}

const FORM_CONTROL_LABEL: Record<CEMFormControl["kind"], string> = {
  value: "value",
  checked: "checked state",
  files: "selected files",
};

export function buildReactUsageNotes(
  tagName: string,
  className: string,
  formControl: CEMFormControl | undefined,
): FrameworkUsageNotes {
  const subpath = tagToSubpath(tagName);
  const changeProp = formControl ? eventToReactProp(formControl.changeEvent) : undefined;
  const inputProp =
    formControl?.inputEvent !== undefined
      ? eventToReactProp(formControl.inputEvent)
      : undefined;

  return {
    package: "@nysds/react",
    import: `import { ${className} } from "@nysds/react/${subpath}";`,
    events:
      "Events map to onNys* props (nys-change -> onNysChange). The handler receives the typed CustomEvent, so e.detail autocompletes.",
    forms: formControl
      ? `Form control (${formControl.kind}). For a controlled component, bind ${formControl.kind} and update state from ${changeProp}${
          inputProp ? ` (or ${inputProp} for every keystroke)` : ""
        }; re-rendering with the same ${FORM_CONTROL_LABEL[formControl.kind]} snaps the element back to your state. See get_guide({ topic: "installation", framework: "react" }) for React Hook Form and uncontrolled-form patterns.`
      : undefined,
  };
}

export function buildAngularUsageNotes(
  tagName: string,
  className: string,
  formControl: CEMFormControl | undefined,
): FrameworkUsageNotes {
  const subpath = tagToSubpath(tagName);
  const angularClass = `${className}Component`;
  const changeOutput = formControl ? eventToAngularOutput(formControl.changeEvent) : undefined;

  return {
    package: "@nysds/angular",
    import: `import { ${angularClass} } from "@nysds/angular/${subpath}";`,
    events: `Events map to camelCase outputs (nys-change -> (nysChange)); event.detail is typed.${
      changeOutput ? ` This component's change output is (${changeOutput}).` : ""
    }`,
    forms: formControl
      ? "Implements ControlValueAccessor: works with [(ngModel)], formControlName (Reactive Forms), and Signal Forms [formField] with no CUSTOM_ELEMENTS_SCHEMA. Add the nysControlErrors directive to let Angular own validation display instead of the component's own errorMessage/showError. See get_guide({ topic: \"installation\", framework: \"angular\" })."
      : undefined,
  };
}
