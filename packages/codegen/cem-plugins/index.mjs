/**
 * CEM plugin entry point. Imported by
 * `src/scripts/custom-elements-manifest.config.mjs` as
 * `@nysds/codegen/cem-plugins`. Register `formControlPlugin()` before
 * `reactPlugin()` and `angularPlugin()` so the wrappers see the
 * `formControl` metadata.
 */
export { formControlPlugin } from "./form-control.mjs";
export { reactPlugin } from "./react.mjs";
export { angularPlugin } from "./angular.mjs";
export { depsPlugin } from "./deps.mjs";
