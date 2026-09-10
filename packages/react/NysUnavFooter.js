import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysUnavFooter = forwardRef((props, forwardedRef) => {
  const { landmarkLabel, ...filteredProps } = props;

  return React.createElement(
    "nys-unavfooter",
    {
      ...filteredProps,
      landmarkLabel: props.landmarkLabel,
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
