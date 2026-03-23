import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener, useProperties } from "./react-utils.js";

export const NysButton = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    fullWidth,
    inverted,
    circle,
    disabled,
    id,
    name,
    size,
    variant,
    label,
    ariaLabel,
    ariaControls,
    prefixIcon,
    suffixIcon,
    icon,
    form,
    value,
    ariaDescription,
    type,
    href,
    target,
    onClick,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-click", props.onNysClick);

  /** Properties - run whenever a property has changed */
  useProperties(ref, "onClick", props.onClick);

  return React.createElement(
    "nys-button",
    {
      ref: (node) => {
        ref.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      ...filteredProps,
      id: props.id,
      name: props.name,
      size: props.size,
      variant: props.variant,
      label: props.label,
      ariaLabel: props.ariaLabel,
      ariaControls: props.ariaControls,
      prefixIcon: props.prefixIcon,
      suffixIcon: props.suffixIcon,
      icon: props.icon,
      form: props.form,
      value: props.value,
      ariaDescription: props.ariaDescription,
      type: props.type,
      href: props.href,
      target: props.target,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      fullWidth: props.fullWidth ? true : undefined,
      inverted: props.inverted ? true : undefined,
      circle: props.circle ? true : undefined,
      disabled: props.disabled ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
