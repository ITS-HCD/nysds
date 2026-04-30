import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysIcon = forwardRef((props, forwardedRef) => {
  const { ariaLabel, color, flip, name, rotate, size, ...filteredProps } =
    props;

  return React.createElement(
    "nys-icon",
    {
      ...filteredProps,
      ariaLabel: props.ariaLabel,
      color: props.color,
      flip: props.flip,
      name: props.name,
      rotate: props.rotate,
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
