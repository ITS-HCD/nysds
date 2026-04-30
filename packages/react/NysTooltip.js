import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysTooltip = forwardRef((props, forwardedRef) => {
  const { inverted, id, position, text, ...filteredProps } = props;

  return React.createElement(
    "nys-tooltip",
    {
      ...filteredProps,
      for: props.for,
      id: props.id,
      position: props.position,
      text: props.text,
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
