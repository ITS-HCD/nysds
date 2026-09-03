import React, { forwardRef } from "react";
import "@nysds/nys-accordion";

export const NysAccordion = forwardRef((props, forwardedRef) => {
  const { singleSelect, bordered, id, headingLevel, ...filteredProps } = props;

  return React.createElement(
    "nys-accordion",
    {
      ...filteredProps,
      id: props.id,
      headingLevel: props.headingLevel,
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
