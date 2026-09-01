import React, { forwardRef } from "react";
import "@nysds/nys-iconlist/nys-iconlistitem";

export const NysIconlistitem = forwardRef((props, forwardedRef) => {
  const { divider, icon, ...filteredProps } = props;

  return React.createElement(
    "nys-iconlistitem",
    {
      ...filteredProps,
      icon: props.icon,
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
