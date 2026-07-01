import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysNygovid = forwardRef((props, forwardedRef) => {
  return React.createElement(
    "nys-nygovid",
    {
      ...props,
      signin: props.undefined,
      find: props.undefined,
      create: props.undefined,
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
