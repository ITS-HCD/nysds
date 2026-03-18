import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysAccordion = forwardRef((props, forwardedRef) => {
  const { singleSelect, bordered, id, ...filteredProps } = props;

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
      singleSelect: props.singleSelect ? true : undefined,
      bordered: props.bordered ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
