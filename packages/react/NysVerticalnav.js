import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysVerticalnav = forwardRef((props, forwardedRef) => {
  const { hideHeader, expanded, id, header, headerLevel, ...filteredProps } =
    props;

  return React.createElement(
    "nys-verticalnav",
    {
      ...filteredProps,
      id: props.id,
      header: props.header,
      headerLevel: props.headerLevel,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      hideHeader: props.hideHeader ? true : undefined,
      expanded: props.expanded ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
