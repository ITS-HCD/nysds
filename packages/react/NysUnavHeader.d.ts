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

  /** Localize project key. If provided, the component will load and initialize LocalizeJS automatically. */
  translateKey?: NysUnavHeaderElement["translateKey"];

  /** Accessible name for the `banner` landmark this header renders.
Defaults to `"New York State"`.

A page pairing this header with `nys-globalheader` carries two `banner`
landmarks; distinct names are what keep landmark navigation useful instead of
announcing "banner, banner". Override only when your wording is clearer for
your audience — and keep it distinct from the agency header's name, which
comes from that header's visible title.

A blank value falls back to the default rather than leaving the landmark
unnamed. */
  landmarkLabel?: NysUnavHeaderElement["landmarkLabel"];

  /** The list of languages this site can be translated to, default to use Localize */
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

  /** Fired when a language is selected. Detail: `{language: {code, label, url?}}`. Cancelable; `preventDefault()` overrides the default Localize integration. */
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
 *  - **nys-language-select** - Fired when a language is selected. Detail: `{language: {code, label, url?}}`. Cancelable; `preventDefault()` overrides the default Localize integration.
 * - **nys-search-submit** - Fired when a search is submitted. Detail: `{query}`. Cancelable; `preventDefault()` overrides the default search redirect.
 */
export const NysUnavHeader: React.ForwardRefExoticComponent<NysUnavHeaderProps>;
