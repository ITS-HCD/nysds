// @nysds/internals — shared ElementInternals + ARIA infrastructure for NYSDS
// components. Side-effect free: defines no custom elements, runs no import-time
// code. Not published.

export { generateId } from "./id";
export type { AriaRelation, AriaTargets, FormValue } from "./types";
export {
  supportsElementRefs,
  associateControl,
  associateControlRefs,
  associateHost,
} from "./aria-associate";
export {
  IdentifiedMixin,
  NysElement,
  type IdentifiedInterface,
  type Constructor,
} from "./identified-mixin";
export {
  ReflectsAriaMixin,
  NysReflectsAriaElement,
  type ReflectsAriaInterface,
} from "./reflects-aria-mixin";
export {
  FormControlMixin,
  NysFormControlElement,
  type FormControlInterface,
} from "./form-control-mixin";
// Test-only DOM-walking utility (regression guard for #1819). Harmless to
// export from the main entry point: nothing in production component source
// imports it, so bundlers tree-shake it out of every component's own build.
export { findUnregisteredChildren } from "./test-helpers";
