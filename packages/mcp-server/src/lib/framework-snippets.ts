/**
 * Framework snippet generation
 *
 * Turns a component's canonical HTML examples into React and Angular
 * snippets using `@nysds/codegen`'s `transformExample` — the same
 * transformer the docs site and Storybook autodocs use, so an AI assistant
 * asking the MCP server sees exactly the same code a developer sees on
 * designsystem.ny.gov.
 */

import { transformExample, type Manifest, type FormsMode } from "@nysds/codegen";
import { getCEM, type CEMExample, type CEMFormControl } from "./cem-parser.js";

export type FrameworkFilter = "html" | "react" | "angular";

export interface FrameworkSnippet {
  code: string;
  imports: string[];
  warnings: string[];
  unsupported: boolean;
}

export interface ExampleWithSnippets {
  title: string;
  html: string;
  react: FrameworkSnippet;
  angular: FrameworkSnippet;
}

function toSnippet(result: {
  code: string;
  imports: string[];
  warnings: string[];
  unsupported: boolean;
}): FrameworkSnippet {
  return {
    code: result.code,
    imports: result.imports,
    warnings: result.warnings,
    unsupported: result.unsupported,
  };
}

/**
 * Builds React and Angular snippets for every HTML example on a component.
 *
 * When `framework` names one target explicitly, that framework's snippet
 * uses its most idiomatic forms binding for a form-control component —
 * React's controlled pattern (`value` + `onNys*`), Angular's
 * `formControlName` (Reactive Forms). The unrequested framework, and every
 * snippet when `framework` is `"html"` (the default), stays a plain
 * attribute-for-attribute conversion so the default response isn't
 * surprising.
 */
export function buildExampleSnippets(
  examples: CEMExample[] | undefined,
  framework: FrameworkFilter,
  formControl: CEMFormControl | undefined,
): ExampleWithSnippets[] {
  if (!examples || examples.length === 0) return [];

  const manifest = getCEM() as unknown as Manifest;
  const reactFormsMode: FormsMode =
    framework === "react" && formControl ? "template" : "none";
  const angularFormsMode: FormsMode =
    framework === "angular" && formControl ? "reactive" : "none";

  return examples
    .filter((example) => !example.lang || example.lang === "html")
    .map((example) => ({
      title: example.title,
      html: example.code,
      react: toSnippet(
        transformExample({
          html: example.code,
          framework: "react",
          manifest,
          formsMode: reactFormsMode,
        }),
      ),
      angular: toSnippet(
        transformExample({
          html: example.code,
          framework: "angular",
          manifest,
          formsMode: angularFormsMode,
        }),
      ),
    }));
}
