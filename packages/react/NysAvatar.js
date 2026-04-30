import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysAvatar = forwardRef((props, forwardedRef) => {
  const {
    disabled,
    interactive,
    lazy,
    ariaLabel,
    color,
    icon,
    id,
    image,
    initials,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-avatar",
    {
      ...filteredProps,
      ariaLabel: props.ariaLabel,
      color: props.color,
      icon: props.icon,
      id: props.id,
      image: props.image,
      initials: props.initials,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      disabled: props.disabled ? true : undefined,
      interactive: props.interactive ? true : undefined,
      lazy: props.lazy ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
