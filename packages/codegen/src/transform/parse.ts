import { parseFragment } from "parse5";
import type { DefaultTreeAdapterMap } from "parse5";

export type P5Node = DefaultTreeAdapterMap["childNode"];
export type P5Element = DefaultTreeAdapterMap["element"];
export type P5Text = DefaultTreeAdapterMap["textNode"];
export type P5Comment = DefaultTreeAdapterMap["commentNode"];

/**
 * Parses an HTML fragment (a docs `preview` block or an `@example` block)
 * into parse5 nodes. parse5 lowercases element and attribute names, matching
 * what a browser does to the same markup.
 */
export function parseHtmlFragment(html: string): P5Node[] {
  return parseFragment(html).childNodes as P5Node[];
}

export function isElement(node: P5Node): node is P5Element {
  return "tagName" in node;
}

export function isText(node: P5Node): node is P5Text {
  return node.nodeName === "#text";
}

export function isComment(node: P5Node): node is P5Comment {
  return node.nodeName === "#comment";
}

/** Child nodes, reading through `<template>` content. */
export function childNodesOf(element: P5Element): P5Node[] {
  const template = element as Partial<DefaultTreeAdapterMap["template"]>;
  if (template.content) {
    return template.content.childNodes as P5Node[];
  }
  return element.childNodes as P5Node[];
}

/** Concatenated text content of an element's direct text children. */
export function textContent(element: P5Element): string {
  return childNodesOf(element)
    .filter(isText)
    .map((node) => node.value)
    .join("");
}
