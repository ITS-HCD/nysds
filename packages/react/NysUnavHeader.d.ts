import React from "react";
import { NysUnavHeader as NysUnavHeaderElement } from "../../dist/nysds.es.js";

export type { NysUnavHeaderElement };

export interface NysUnavHeaderProps extends Pick<
  React.AllHTMLAttributes<HTMLElement>,
  | "children"
  | "dir"
  | "hidden"
  | "id"
  | "lang"
  | "slot"
  | "style"
  | "title"
  | "translate"
  | "onClick"
  | "onFocus"
  | "onBlur"
> {
  /** Internal: Whether trust bar panel is expanded. */
  trustbarVisible?: boolean;

  /** Internal: Whether search dropdown is visible (mobile). */
  searchDropdownVisible?: boolean;

  /** Internal: Whether language dropdown is visible. */
  languageVisible?: boolean;

  /** Internal: Whether search input is focused. */
  isSearchFocused?: boolean;

  /** Hides the translation dropdown. */
  hideTranslate?: boolean;

  /** Hides the search functionality. */
  hideSearch?: boolean;

  /** The URL endpoint of the search, make sure to include the query param. */
  searchUrl?: NysUnavHeaderElement["searchUrl"];

  /** The list of languages this site can be translated to, default to use Smartling */
  languages?: NysUnavHeaderElement["languages"];

  /** A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the class selectors or functions like the method `Document.getElementsByClassName()`. */
  className?: string;

  /** Contains a space-separated list of the part names of the element that should be exposed on the host element. */
  exportparts?: string;

  /** Used for labels to link them with their inputs (using input id). */
  htmlFor?: string;

  /** Used to help React identify which items have changed, are added, or are removed within a list. */
  key?: number | string;

  /** Contains a space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the ::part pseudo-element. */
  part?: string;

  /** A mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component. */
  ref?: any;

  /** Allows developers to make HTML elements focusable, allow or prevent them from being sequentially focusable (usually with the `Tab` key, hence the name) and determine their relative ordering for sequential focus navigation. */
  tabIndex?: number;

  /** Fired when a language is selected. Detail: `{language: {code, label, url?}}`. Cancelable; `preventDefault()` overrides the default Smartling redirect. */
  onNysLanguageSelect?: (event: CustomEvent) => void;

  /** Fired when a search is submitted. Detail: `{query}`. Cancelable; `preventDefault()` overrides the default search redirect. */
  onNysSearchSubmit?: (event: CustomEvent) => void;
}

/**
 * Universal NYS header with trust bar, search, and translation. Required site-wide.
 * ---
 *
 *
 * ### **Events:**
 *  - **nys-language-select** - Fired when a language is selected. Detail: `{language: {code, label, url?}}`. Cancelable; `preventDefault()` overrides the default Smartling redirect.
 * - **nys-search-submit** - Fired when a search is submitted. Detail: `{query}`. Cancelable; `preventDefault()` overrides the default search redirect.
 *
 * ### **Slots:**
 *  - _default_ - Default slot for `nys-alert` elements displayed below the header. Only `nys-alert` children are accepted; others are removed.
 */
export const NysUnavHeader: React.ForwardRefExoticComponent<NysUnavHeaderProps>;
