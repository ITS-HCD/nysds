import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysCard = forwardRef((props, forwardedRef) => {
  const { id, name, ...filteredProps } = props;

  return React.createElement(
    "nys-card",
    {
      ...filteredProps,
      id: props.id,
      name: props.name,
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
