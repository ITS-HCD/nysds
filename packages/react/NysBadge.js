import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysBadge = forwardRef((props, forwardedRef) => {
  const {
    prefixIcon,
    suffixIcon,
    id,
    intent,
    label,
    name,
    prefixLabel,
    size,
    variant,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-badge",
    {
      ...filteredProps,
      id: props.id,
      intent: props.intent,
      label: props.label,
      name: props.name,
      prefixLabel: props.prefixLabel,
      size: props.size,
      variant: props.variant,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      prefixicon: props.prefixIcon ? true : undefined,
      suffixicon: props.suffixIcon ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
