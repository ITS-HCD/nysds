/**
 * @nysds/codegen public API.
 *
 * One package that reads the custom elements manifest and derives every
 * framework artifact: metadata for generators, naming rules, and the HTML
 * to JSX / Angular snippet transformer. The CEM plugins ship separately as
 * `@nysds/codegen/cem-plugins`.
 */
export { loadManifest } from "./manifest/load.js";
export { listComponents, normalizeTypeText } from "./manifest/components.js";
export { parseFormControlTag } from "./manifest/form-control.js";
export {
  isPublicMember,
  isPublicProp,
  isExposedEvent,
} from "./manifest/filters.js";
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
} from "./manifest/naming.js";
export type {
  Manifest,
  ManifestModule,
  ComponentMeta,
  PropMeta,
  EventMeta,
  SlotMeta,
  FormControlMeta,
} from "./manifest/types.js";
export {
  transformExample,
  toJsx,
  toAngular,
} from "./transform/index.js";
export type {
  TransformExampleInput,
  TransformResult,
  FormsMode,
} from "./transform/index.js";
