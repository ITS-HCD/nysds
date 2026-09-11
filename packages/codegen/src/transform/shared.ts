/**
 * Rules shared by both emitters: component lookup, attribute
 * classification, and the script/style/inline-handler policy.
 */
import type { ComponentMeta, Manifest, PropMeta } from "../manifest/types.js";
import { listComponents } from "../manifest/components.js";
import { NYS_PREFIX } from "../manifest/naming.js";
import { isElement, textContent, type P5Element } from "./parse.js";

export type FormsMode = "none" | "template" | "reactive";

export interface TransformResult {
  /** The transformed snippet. Imports are listed separately. */
  code: string;
  language: "jsx" | "html";
  warnings: string[];
  /**
   * True when the example depends on something the target framework snippet
   * cannot express (imperative script against a component, inline handlers).
   * The code is still returned as a best effort.
   */
  unsupported: boolean;
  /**
   * Names the docs partial needs to import: component class names for
   * React, Angular component class names for Angular.
   */
  imports: string[];
}

export interface TransformContext {
  byTag: Map<string, ComponentMeta>;
  propLookups: Map<string, Map<string, PropMeta>>;
  warnings: string[];
  imports: Set<string>;
  unsupported: boolean;
  formsMode: FormsMode;
}

export function buildContext(
  manifest: Manifest,
  formsMode: FormsMode,
): TransformContext {
  const byTag = new Map<string, ComponentMeta>();
  for (const component of listComponents(manifest)) {
    byTag.set(component.tag, component);
  }
  return {
    byTag,
    propLookups: new Map(),
    warnings: [],
    imports: new Set(),
    unsupported: false,
    formsMode,
  };
}

/**
 * Props indexed by lowercased attribute name and lowercased property name.
 * parse5 lowercases attribute names, so a camelCase manifest attribute
 * (`errorMessage`) arrives as `errormessage`.
 */
export function propLookup(
  context: TransformContext,
  component: ComponentMeta,
): Map<string, PropMeta> {
  let lookup = context.propLookups.get(component.tag);
  if (!lookup) {
    lookup = new Map();
    for (const prop of component.props) {
      if (prop.attribute) lookup.set(prop.attribute.toLowerCase(), prop);
      if (!lookup.has(prop.name.toLowerCase())) {
        lookup.set(prop.name.toLowerCase(), prop);
      }
    }
    context.propLookups.set(component.tag, lookup);
  }
  return lookup;
}

/** True for a component tag from this design system. */
export function isNysTag(tagName: string): boolean {
  return tagName.startsWith(NYS_PREFIX);
}

/** True for `onclick`-style inline handler attributes. */
export function isInlineHandler(attrName: string): boolean {
  return /^on[a-z]/.test(attrName);
}

/** Global attributes that pass through without a warning. */
export function isSilentGlobalAttr(attrName: string): boolean {
  return (
    attrName === "id" ||
    attrName === "name" ||
    attrName === "part" ||
    attrName.startsWith("data-") ||
    attrName.startsWith("aria-")
  );
}

/**
 * Handles `<script>`, `<style>`, and inline handlers for both emitters.
 * Returns true when the element was consumed (dropped) by the policy.
 */
export function dropScriptOrStyle(
  context: TransformContext,
  element: P5Element,
): boolean {
  if (element.tagName !== "script" && element.tagName !== "style") {
    return false;
  }
  context.warnings.push(
    `Dropped <${element.tagName}> block: examples must be declarative markup.`,
  );
  if (
    element.tagName === "script" &&
    textContent(element).includes(NYS_PREFIX)
  ) {
    context.unsupported = true;
  }
  return true;
}

export function warnInlineHandler(
  context: TransformContext,
  attrName: string,
  tagName: string,
): void {
  context.warnings.push(
    `Inline handler "${attrName}" on <${tagName}> cannot be transformed.`,
  );
  context.unsupported = true;
}

export function warnUnknownAttr(
  context: TransformContext,
  attrName: string,
  tagName: string,
): void {
  context.warnings.push(
    `Unknown attribute "${attrName}" on <${tagName}> passed through unchanged.`,
  );
}

/** True when an attribute value is a numeric literal. */
export function isNumericLiteral(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value);
}

/**
 * The name a form model field gets in generated form bindings, taken from
 * the example's own `name` (then `id`) attribute, then the component
 * subpath.
 */
export function modelFieldName(
  element: P5Element,
  component: ComponentMeta,
): string {
  const byName = element.attrs.find((attr) => attr.name === "name")?.value;
  if (byName) return byName;
  const byId = element.attrs.find((attr) => attr.name === "id")?.value;
  if (byId) return byId;
  return component.subpath;
}

export function elementChildren(element: P5Element): P5Element[] {
  return element.childNodes.filter(isElement);
}
