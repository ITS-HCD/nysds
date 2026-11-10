/**
 * HTML example to Angular template snippet.
 */
import type { Manifest, ComponentMeta, PropMeta } from "../manifest/types.js";
import { classToAngularClass } from "../manifest/naming.js";
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
  modelFieldName,
  type FormsMode,
  type TransformContext,
  type TransformResult,
} from "./shared.js";

const INLINE_TEXT_MAX = 60;

/** Native elements with no closing tag. */
const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

export function toAngular(
  html: string,
  manifest: Manifest,
  formsMode: FormsMode = "none",
): TransformResult {
  const context = buildContext(manifest, formsMode);
  const lines = renderNodes(context, parseHtmlFragment(html), 0);
  return {
    code: lines.length > 0 ? lines.join("\n") + "\n" : "",
    language: "html",
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
      if (text) lines.push(indent + text);
      continue;
    }
    if (isComment(node)) {
      lines.push(`${indent}<!-- ${node.data.trim()} -->`);
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
  if (component) {
    context.imports.add(classToAngularClass(component.className));
  }

  const formControl =
    component && context.formsMode !== "none"
      ? component.formControl
      : undefined;

  const attrParts: string[] = [];
  for (const attr of element.attrs) {
    if (isInlineHandler(attr.name)) {
      warnInlineHandler(context, attr.name, tagName);
      continue;
    }
    if (
      formControl &&
      ((formControl.kind === "value" && attr.name === "value") ||
        (formControl.kind === "checked" && attr.name === "checked"))
    ) {
      // The form binding owns the value.
      continue;
    }
    if (
      attr.name === "class" ||
      attr.name === "slot" ||
      attr.name === "style"
    ) {
      attrParts.push(htmlAttr(attr.name, attr.value));
      continue;
    }
    if (component) {
      const prop = propLookup(context, component).get(attr.name);
      if (prop) {
        attrParts.push(angularPropAttr(prop, attr.value));
        continue;
      }
      if (isSilentGlobalAttr(attr.name)) {
        attrParts.push(htmlAttr(attr.name, attr.value));
        continue;
      }
      warnUnknownAttr(context, attr.name, tagName);
      attrParts.push(htmlAttr(attr.name, attr.value));
      continue;
    }
    attrParts.push(htmlAttr(attr.name, attr.value));
  }

  if (formControl && component) {
    const field = modelFieldName(element, component);
    if (context.formsMode === "template") {
      attrParts.push(`[(ngModel)]="model.${field}"`);
    } else if (context.formsMode === "reactive") {
      attrParts.push(`formControlName="${field}"`);
    }
  }

  const attrsText = attrParts.length > 0 ? ` ${attrParts.join(" ")}` : "";
  if (VOID_ELEMENTS.has(tagName)) {
    return [`${indent}<${tagName}${attrsText}>`];
  }

  const children = childNodesOf(element);
  const childLines = renderNodes(context, children, depth + 1);

  if (childLines.length === 0) {
    return [`${indent}<${tagName}${attrsText}></${tagName}>`];
  }

  const onlyText = children.every(
    (node) => !isElement(node) && !isComment(node),
  );
  if (onlyText && childLines.length === 1) {
    const text = childLines[0].trim();
    if (text.length <= INLINE_TEXT_MAX) {
      return [`${indent}<${tagName}${attrsText}>${text}</${tagName}>`];
    }
  }

  return [
    `${indent}<${tagName}${attrsText}>`,
    ...childLines,
    `${indent}</${tagName}>`,
  ];
}

function htmlAttr(name: string, value: string): string {
  if (value === "") return name;
  return value.includes('"') ? `${name}='${value}'` : `${name}="${value}"`;
}

function angularPropAttr(prop: PropMeta, value: string): string {
  if (prop.isBoolean) {
    return value === "false" ? `[${prop.name}]="false"` : prop.name;
  }
  if (prop.isNumber && isNumericLiteral(value)) {
    return `[${prop.name}]="${value}"`;
  }
  if (!prop.isPrimitive && value !== "") {
    return value.includes('"')
      ? `[${prop.name}]='${value}'`
      : `[${prop.name}]="${value}"`;
  }
  return htmlAttr(prop.name, value);
}
