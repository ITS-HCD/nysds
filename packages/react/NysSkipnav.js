import React, { forwardRef } from "react";
import "../../dist/nys-skipnav.js";

export const NysSkipnav = forwardRef((props, forwardedRef) => {
  const { id, href, ...filteredProps } = props;

  return React.createElement(
    "nys-skipnav",
    {
      ...filteredProps,
      id: props.id,
      href: props.href,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      style: { ...props.style },
    },
    props.children,
  );
});
