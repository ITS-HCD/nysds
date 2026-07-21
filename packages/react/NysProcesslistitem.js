import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysProcesslistitem = forwardRef((props, forwardedRef) => {
  const { label, description, ...filteredProps } = props;

  return React.createElement(
    "nys-processlistitem",
    {
      ...filteredProps,
      label: props.label,
      description: props.description,
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
