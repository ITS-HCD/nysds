import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysIconlist = forwardRef((props, forwardedRef) => {
  const { divider, id, ...filteredProps } = props;

  return React.createElement(
    "nys-iconlist",
    {
      ...filteredProps,
      id: props.id,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      divider: props.divider ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
