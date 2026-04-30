import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener, useProperties } from "./react-utils.js";

export const NysButton = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    circle,
    disabled,
    fullWidth,
    inverted,
    ariaControls,
    ariaDescription,
    ariaLabel,
    form,
    href,
    icon,
    id,
    label,
    name,
    prefixIcon,
    size,
    suffixIcon,
    target,
    type,
    value,
    variant,
    onClick,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-click", props.onNysClick);
  useEventListener(ref, "nys-focus", props.onNysFocus);

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
      ariaControls: props.ariaControls,
      ariaDescription: props.ariaDescription,
      ariaLabel: props.ariaLabel,
      form: props.form,
      href: props.href,
      icon: props.icon,
      id: props.id,
      label: props.label,
      name: props.name,
      prefixIcon: props.prefixIcon,
      size: props.size,
      suffixIcon: props.suffixIcon,
      target: props.target,
      type: props.type,
      value: props.value,
      variant: props.variant,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      circle: props.circle ? true : undefined,
      disabled: props.disabled ? true : undefined,
      fullWidth: props.fullWidth ? true : undefined,
      inverted: props.inverted ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
