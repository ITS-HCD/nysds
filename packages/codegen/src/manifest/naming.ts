/**
 * Naming rules (README section 4.1 of the framework-support plan is
 * normative). Logic lives in `cem-plugins/lib/core.mjs`; this module
 * re-exports it with types.
 */
export {
  NYS_PREFIX,
  NYS_BLUR_EVENT,
  pascalize,
  tagToClass,
  classToAngularClass,
  eventToReactProp,
  eventToAngularOutput,
  tagToSubpath,
  tagToPackage,
} from "../../cem-plugins/lib/core.mjs";
