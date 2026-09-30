import type { Manifest } from "../manifest/types.js";
import type { FormsMode, TransformResult } from "./shared.js";
import { toJsx } from "./to-jsx.js";
import { toAngular } from "./to-angular.js";

export type { FormsMode, TransformResult } from "./shared.js";
export { toJsx } from "./to-jsx.js";
export { toAngular } from "./to-angular.js";

export interface TransformExampleInput {
  /** The canonical HTML example. */
  html: string;
  framework: "react" | "angular";
  manifest: Manifest;
  /**
   * How form components render. `"none"` (default) keeps snippets static;
   * `"template"` emits `[(ngModel)]` (Angular) or the controlled pattern
   * (React); `"reactive"` emits `formControlName` (Angular).
   */
  formsMode?: FormsMode;
}

/** Transforms one HTML example into a framework snippet. */
export function transformExample(
  input: TransformExampleInput,
): TransformResult {
  const formsMode = input.formsMode ?? "none";
  return input.framework === "react"
    ? toJsx(input.html, input.manifest, formsMode)
    : toAngular(input.html, input.manifest, formsMode);
}
