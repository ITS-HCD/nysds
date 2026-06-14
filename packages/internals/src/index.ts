// @nysds/internals — shared ElementInternals + ARIA infrastructure for NYSDS
// components. Side-effect free: defines no custom elements, runs no import-time
// code. Not published.

export { generateId } from "./id";
export type { AriaRelation, AriaTargets, FormValue } from "./types";
export {
  supportsElementRefs,
  associateControl,
  associateHost,
} from "./aria-associate";
export {
  ReflectsAriaMixin,
  NysReflectsAriaElement,
  type ReflectsAriaInterface,
  type Constructor,
} from "./reflects-aria-mixin";
export {
  FormControlMixin,
  NysFormControlElement,
  type FormControlInterface,
} from "./form-control-mixin";
