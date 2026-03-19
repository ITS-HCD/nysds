import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysBadge = forwardRef((props, forwardedRef) => {
  const {
    emilyTest,
    prefixIcon,
    suffixIcon,
    id,
    name,
    size,
    intent,
    prefixLabel,
    label,
    variant,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-badge",
    {
      ...filteredProps,
      id: props.id,
      name: props.name,
      size: props.size,
      intent: props.intent,
      prefixLabel: props.prefixLabel,
      label: props.label,
      variant: props.variant,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      emilyTest: props.emilyTest ? true : undefined,
      prefixicon: props.prefixIcon ? true : undefined,
      suffixicon: props.suffixIcon ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
