// Barrel export for @nysds/angular.
//
// The generated barrel (src/generated/index.ts) is written by the
// @nysds/codegen Angular CEM plugin on every `npm run cem`. When a file
// exists at src/overrides/<tag>.component.ts, the plugin skips that
// component and the generated barrel re-exports the override instead.
export * from "./generated/index";
export * from "./lib/forms/index";
export { NysAngularModule } from "./generated/nys-angular.module";
