import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysTooltip = forwardRef((props, forwardedRef) => {
  const { inverted, id, text, position, ...filteredProps } = props;

  return React.createElement(
    "nys-tooltip",
    {
      ...filteredProps,
      id: props.id,
      text: props.text,
      for: props.for,
      position: props.position,
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
