import React, { forwardRef, useRef, useEffect } from "react";
import "@nysds/nys-unavheader";
import { useEventListener } from "./react-utils.js";

export const NysUnavHeader = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    trustbarVisible,
    searchDropdownVisible,
    languageVisible,
    isSearchFocused,
    hideTranslate,
    hideSearch,
    searchUrl,
    landmarkLabel,
    languages,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-language-select", props.onNysLanguageSelect);
  useEventListener(ref, "nys-search-submit", props.onNysSearchSubmit);

  return React.createElement(
    "nys-unavheader",
    {
      ref: (node) => {
        ref.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      ...filteredProps,
      searchUrl: props.searchUrl,
      landmarkLabel: props.landmarkLabel,
      languages: props.languages,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      trustbarVisible: props.trustbarVisible ? true : undefined,
      searchDropdownVisible: props.searchDropdownVisible ? true : undefined,
      languageVisible: props.languageVisible ? true : undefined,
      isSearchFocused: props.isSearchFocused ? true : undefined,
      hideTranslate: props.hideTranslate ? true : undefined,
      hideSearch: props.hideSearch ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
