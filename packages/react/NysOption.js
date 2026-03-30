import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysOption = forwardRef((props, forwardedRef) => {
  const { disabled, selected, hidden, value, label, ...filteredProps } = props;

  return React.createElement(
    "nys-option",
    {
      ...filteredProps,
      value: props.value,
      label: props.label,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      disabled: props.disabled ? true : undefined,
      selected: props.selected ? true : undefined,
      hidden: props.hidden ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
