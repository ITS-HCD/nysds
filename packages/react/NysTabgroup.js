import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysTabgroup = forwardRef((props, forwardedRef) => {
  const { id, name, orientation, ...filteredProps } = props;

  return React.createElement(
    "nys-tabgroup",
    {
      ...filteredProps,
      id: props.id,
      name: props.name,
      orientation: props.orientation,
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
