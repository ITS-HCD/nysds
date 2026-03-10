import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysLabel = forwardRef((props, forwardedRef) => {
  const { inverted, label, description, flag, tooltip, ...filteredProps } =
    props;

  return React.createElement(
    "nys-label",
    {
      ...filteredProps,
      for: props.for,
      label: props.label,
      description: props.description,
      flag: props.flag,
      tooltip: props.tooltip,
      class: props.className,
      exportparts: props.exportparts,
      part: props.part,
      tabindex: props.tabIndex,
      inverted: props.inverted ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
