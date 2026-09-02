/**
 * HTML example to JSX snippet.
 */
import type { Manifest, ComponentMeta, PropMeta } from "../manifest/types.js";
import { eventToReactProp } from "../manifest/naming.js";
import {
  parseHtmlFragment,
  isElement,
  isText,
  isComment,
  childNodesOf,
  type P5Node,
  type P5Element,
} from "./parse.js";
import {
  buildContext,
  propLookup,
  isNysTag,
  isInlineHandler,
  isSilentGlobalAttr,
  dropScriptOrStyle,
  warnInlineHandler,
  warnUnknownAttr,
  isNumericLiteral,
  type FormsMode,
  type TransformContext,
  type TransformResult,
} from "./shared.js";

const INLINE_TEXT_MAX = 60;

export function toJsx(
  html: string,
  manifest: Manifest,
  formsMode: FormsMode = "none",
): TransformResult {
  const context = buildContext(manifest, formsMode);
  const lines = renderNodes(context, parseHtmlFragment(html), 0);
  return {
    code: lines.length > 0 ? lines.join("\n") + "\n" : "",
    language: "jsx",
    warnings: context.warnings,
    unsupported: context.unsupported,
    imports: [...context.imports].sort(),
  };
}

function renderNodes(
  context: TransformContext,
  nodes: P5Node[],
  depth: number,
): string[] {
  const indent = "  ".repeat(depth);
  const lines: string[] = [];
  for (const node of nodes) {
    if (isText(node)) {
      const text = node.value.replace(/\s+/g, " ").trim();
      if (text) lines.push(indent + escapeJsxText(text));
      continue;
    }
    if (isComment(node)) {
      lines.push(`${indent}{/* ${node.data.trim()} */}`);
      continue;
    }
    if (isElement(node)) {
      lines.push(...renderElement(context, node, depth));
    }
  }
  return lines;
}

function renderElement(
  context: TransformContext,
  element: P5Element,
  depth: number,
): string[] {
  if (dropScriptOrStyle(context, element)) return [];

  const indent = "  ".repeat(depth);
  const tagName = element.tagName;
  let component: ComponentMeta | undefined;
  if (isNysTag(tagName)) {
    component = context.byTag.get(tagName);
    if (!component) {
      context.warnings.push(
        `Unknown component <${tagName}> is not in the manifest; passed through unchanged.`,
      );
    }
  }
  const jsxName = component ? component.className : tagName;
  if (component) context.imports.add(component.className);

  const formControl =
    component && context.formsMode !== "none"
      ? component.formControl
      : undefined;
  const controlledAttr =
    formControl?.kind === "value"
      ? "value"
      : formControl?.kind === "checked"
        ? "checked"
        : undefined;
  const isControlled =
    controlledAttr !== undefined &&
    element.attrs.some((attr) => attr.name === controlledAttr);

  const attrParts: string[] = [];
  for (const attr of element.attrs) {
    if (isInlineHandler(attr.name)) {
      warnInlineHandler(context, attr.name, tagName);
      continue;
    }
    if (isControlled && attr.name === controlledAttr) continue;
    if (attr.name === "class") {
      attrParts.push(jsxStringAttr("className", attr.value));
      continue;
    }
    if (attr.name === "style") {
      const style = styleToJsx(context, attr.value, tagName);
      if (style) attrParts.push(style);
      continue;
    }
    if (attr.name === "slot") {
      attrParts.push(jsxStringAttr("slot", attr.value));
      continue;
    }
    if (component) {
      const prop = propLookup(context, component).get(attr.name);
      if (prop) {
        attrParts.push(jsxPropAttr(prop, attr.value));
        continue;
      }
      if (isSilentGlobalAttr(attr.name)) {
        attrParts.push(jsxStringAttr(attr.name, attr.value));
        continue;
      }
      warnUnknownAttr(context, attr.name, tagName);
      attrParts.push(jsxStringAttr(attr.name, attr.value));
      continue;
    }
    // Native or unknown element.
    if (attr.name === "for") {
      attrParts.push(jsxStringAttr("htmlFor", attr.value));
      continue;
    }
    attrParts.push(jsxStringAttr(attr.name, attr.value));
  }

  if (isControlled && formControl && controlledAttr) {
    const stateName = controlledAttr;
    const setter = `set${stateName[0].toUpperCase()}${stateName.slice(1)}`;
    attrParts.push(`${stateName}={${stateName}}`);
    attrParts.push(
      `${eventToReactProp(formControl.changeEvent)}={(e) => ${setter}(e.detail.${stateName})}`,
    );
  }

  const attrsText = attrParts.length > 0 ? ` ${attrParts.join(" ")}` : "";
  const children = childNodesOf(element);
  const childLines = renderNodes(context, children, depth + 1);

  if (childLines.length === 0) {
    return [`${indent}<${jsxName}${attrsText} />`];
  }

  const onlyText = children.every(
    (node) => !isElement(node) && !isComment(node),
  );
  if (onlyText && childLines.length === 1) {
    const text = childLines[0].trim();
    if (text.length <= INLINE_TEXT_MAX) {
      return [`${indent}<${jsxName}${attrsText}>${text}</${jsxName}>`];
    }
  }

  return [
    `${indent}<${jsxName}${attrsText}>`,
    ...childLines,
    `${indent}</${jsxName}>`,
  ];
}

function escapeJsxText(text: string): string {
  return /[{}]/.test(text) ? `{${JSON.stringify(text)}}` : text;
}

function jsxStringAttr(name: string, value: string): string {
  return value.includes('"')
    ? `${name}={${JSON.stringify(value)}}`
    : `${name}="${value}"`;
}

function jsxPropAttr(prop: PropMeta, value: string): string {
  if (prop.isBoolean) {
    return value === "false" ? `${prop.name}={false}` : prop.name;
  }
  if (prop.isNumber && isNumericLiteral(value)) {
    return `${prop.name}={${value}}`;
  }
  if (!prop.isPrimitive && (value.startsWith("{") || value.startsWith("["))) {
    return `${prop.name}={${value}}`;
  }
  return jsxStringAttr(prop.name, value);
}

/** Converts an inline style string to a JSX style object. */
function styleToJsx(
  context: TransformContext,
  value: string,
  tagName: string,
): string | undefined {
  const declarations = value
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean);
  const pairs: string[] = [];
  for (const declaration of declarations) {
    const colon = declaration.indexOf(":");
    if (colon === -1) {
      context.warnings.push(
        `Dropped unparseable style attribute on <${tagName}>.`,
      );
      return undefined;
    }
    const property = declaration
      .slice(0, colon)
      .trim()
      .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    const propertyValue = declaration.slice(colon + 1).trim();
    pairs.push(`${property}: ${JSON.stringify(propertyValue)}`);
  }
  if (pairs.length === 0) return undefined;
  return `style={{ ${pairs.join(", ")} }}`;
}
