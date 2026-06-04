import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysVerticalnav = forwardRef((props, forwardedRef) => {
  const { hideHeader, id, navHeader, headerLevel, ...filteredProps } = props;

  return React.createElement(
    "nys-verticalnav",
    {
      ...filteredProps,
      id: props.id,
      navHeader: props.navHeader,
      headerLevel: props.headerLevel,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      hideHeader: props.hideHeader ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
