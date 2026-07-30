import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysProcesslist = forwardRef((props, forwardedRef) => {
  const {
    strong,
    neutral,
    id,
    size,
    initialStep,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-processlist",
    {
      ...filteredProps,
      id: props.id,
      size: props.size,
      initialStep: props.initialStep,
      "aria-label": props.ariaLabel || props["aria-label"],
      "aria-labelledby": props.ariaLabelledBy || props["aria-labelledby"],
      "aria-describedby": props.ariaDescribedBy || props["aria-describedby"],
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      strong: props.strong ? true : undefined,
      neutral: props.neutral ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
