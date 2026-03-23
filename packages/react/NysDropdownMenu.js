import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysDropdownMenu = forwardRef((props, forwardedRef) => {
  const { showDropdown, position, ...filteredProps } = props;

  return React.createElement(
    "nys-dropdownmenu",
    {
      ...filteredProps,
      for: props.for,
      position: props.position,
      class: props.className,
      exportparts: props.exportparts,
      part: props.part,
      tabindex: props.tabIndex,
      showDropdown: props.showDropdown ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
