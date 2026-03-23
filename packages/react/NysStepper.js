import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysStepper = forwardRef((props, forwardedRef) => {
  const { isCompactExpanded, id, name, label, counterText, ...filteredProps } =
    props;

  return React.createElement(
    "nys-stepper",
    {
      ...filteredProps,
      id: props.id,
      name: props.name,
      label: props.label,
      counterText: props.counterText,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      isCompactExpanded: props.isCompactExpanded ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
