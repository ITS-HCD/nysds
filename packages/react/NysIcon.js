import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysIcon = forwardRef((props, forwardedRef) => {
  const { name, ariaLabel, rotate, flip, color, size, ...filteredProps } =
    props;

  return React.createElement(
    "nys-icon",
    {
      ...filteredProps,
      name: props.name,
      ariaLabel: props.ariaLabel,
      rotate: props.rotate,
      flip: props.flip,
      color: props.color,
      size: props.size,
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
