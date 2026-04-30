import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysSkipnav = forwardRef((props, forwardedRef) => {
  const { href, id, ...filteredProps } = props;

  return React.createElement(
    "nys-skipnav",
    {
      ...filteredProps,
      href: props.href,
      id: props.id,
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
