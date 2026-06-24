import React, { forwardRef } from "react";
import "../../dist/nys-tab.js";

export const NysTabgroup = forwardRef((props, forwardedRef) => {
  const { id, name, ...filteredProps } = props;

  return React.createElement(
    "nys-tabgroup",
    {
      ...filteredProps,
      id: props.id,
      name: props.name,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      style: { ...props.style },
    },
    props.children,
  );
});
