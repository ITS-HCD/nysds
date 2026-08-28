import React, { forwardRef } from "react";
import "@nysds/nys-processlist";

export const NysProcesslist = forwardRef((props, forwardedRef) => {
  const { strong, neutral, id, size, initialStep, ...filteredProps } = props;

  return React.createElement(
    "nys-processlist",
    {
      ...filteredProps,
      id: props.id,
      size: props.size,
      initialStep: props.initialStep,
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
