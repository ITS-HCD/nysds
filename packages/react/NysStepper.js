import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysStepper = forwardRef((props, forwardedRef) => {
  const { isCompactExpanded, counterText, id, label, name, ...filteredProps } =
    props;

  return React.createElement(
    "nys-stepper",
    {
      ...filteredProps,
      counterText: props.counterText,
      id: props.id,
      label: props.label,
      name: props.name,
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
