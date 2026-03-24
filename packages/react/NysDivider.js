import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysDivider = forwardRef((props, forwardedRef) => {
  const { inverted, ...filteredProps } = props;

  return React.createElement(
    "nys-divider",
    {
      ...filteredProps,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      inverted: props.inverted ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
