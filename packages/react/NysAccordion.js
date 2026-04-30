import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysAccordion = forwardRef((props, forwardedRef) => {
  const { bordered, singleSelect, id, ...filteredProps } = props;

  return React.createElement(
    "nys-accordion",
    {
      ...filteredProps,
      id: props.id,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      bordered: props.bordered ? true : undefined,
      singleSelect: props.singleSelect ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
