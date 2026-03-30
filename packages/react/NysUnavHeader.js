import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysUnavHeader = forwardRef((props, forwardedRef) => {
  const {
    trustbarVisible,
    searchDropdownVisible,
    languageVisible,
    isSearchFocused,
    hideTranslate,
    hideSearch,
    searchUrl,
    languages,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-unavheader",
    {
      ...filteredProps,
      searchUrl: props.searchUrl,
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
