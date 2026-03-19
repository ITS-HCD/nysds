import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysAvatar = forwardRef((props, forwardedRef) => {
  const {
    interactive,
    disabled,
    lazy,
    id,
    ariaLabel,
    image,
    initials,
    icon,
    color,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-avatar",
    {
      ...filteredProps,
      id: props.id,
      ariaLabel: props.ariaLabel,
      image: props.image,
      initials: props.initials,
      icon: props.icon,
      color: props.color,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      interactive: props.interactive ? true : undefined,
      disabled: props.disabled ? true : undefined,
      lazy: props.lazy ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
