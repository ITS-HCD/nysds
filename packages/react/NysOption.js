import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysOption = forwardRef((props, forwardedRef) => {
  const { disabled, hidden, selected, label, value, ...filteredProps } = props;

  return React.createElement(
    "nys-option",
    {
      ...filteredProps,
      label: props.label,
      value: props.value,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      disabled: props.disabled ? true : undefined,
      hidden: props.hidden ? true : undefined,
      selected: props.selected ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
