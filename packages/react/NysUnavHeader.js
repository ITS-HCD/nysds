import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysUnavHeader = forwardRef((props, forwardedRef) => {
  const {
    hideSearch,
    hideTranslate,
    isSearchFocused,
    languageVisible,
    searchDropdownVisible,
    trustbarVisible,
    languages,
    searchUrl,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-unavheader",
    {
      ...filteredProps,
      languages: props.languages,
      searchUrl: props.searchUrl,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      hideSearch: props.hideSearch ? true : undefined,
      hideTranslate: props.hideTranslate ? true : undefined,
      isSearchFocused: props.isSearchFocused ? true : undefined,
      languageVisible: props.languageVisible ? true : undefined,
      searchDropdownVisible: props.searchDropdownVisible ? true : undefined,
      trustbarVisible: props.trustbarVisible ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
