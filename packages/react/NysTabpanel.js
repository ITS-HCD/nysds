import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysTabpanel = forwardRef((props, forwardedRef) => {
  const { id, ...filteredProps } = props;

  return React.createElement(
    "nys-tabpanel",
    {
      ...filteredProps,
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
