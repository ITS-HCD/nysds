import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysVerticalnavGroup = forwardRef((props, forwardedRef) => {
  const { expanded, disabled, active, label, ...filteredProps } = props;

  return React.createElement(
    "nys-verticalnavgroup",
    {
      ...filteredProps,
      label: props.label,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      expanded: props.expanded ? true : undefined,
      disabled: props.disabled ? true : undefined,
      active: props.active ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
