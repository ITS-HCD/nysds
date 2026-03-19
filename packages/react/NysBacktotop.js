import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysBacktotop = forwardRef((props, forwardedRef) => {
  const { visible, position, ...filteredProps } = props;

  return React.createElement(
    "nys-backtotop",
    {
      ...filteredProps,
      position: props.position,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      visible: props.visible ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
