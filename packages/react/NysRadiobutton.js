import React, { forwardRef, useRef, useEffect } from "react";
import "@nysds/nys-radiobutton";
import { useEventListener, useProperties } from "./react-utils.js";

export const NysRadiobutton = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
  const {
    checked,
    disabled,
    required,
    tile,
    other,
    showOtherError,
    hideLabel,
    label,
    description,
    id,
    name,
    value,
    form,
    size,
    labelledby,
    validity,
    ...filteredProps
  } = props;

  /** Event listeners - run once */
  useEventListener(ref, "nys-change", props.onNysChange);
  useEventListener(ref, "nys-focus", props.onNysFocus);
  useEventListener(ref, "nys-blur", props.onNysBlur);
  useEventListener(ref, "nys-other-input", props.onNysOtherInput);

  /** Properties - run whenever a property has changed */
  useProperties(ref, "validity", props.validity);

  return React.createElement(
    "nys-radiobutton",
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
      label: props.label,
      description: props.description,
      id: props.id,
      name: props.name,
      value: props.value,
      form: props.form,
      size: props.size,
      labelledby: props.labelledby,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      checked: props.checked ? true : undefined,
      disabled: props.disabled ? true : undefined,
      required: props.required ? true : undefined,
      tile: props.tile ? true : undefined,
      other: props.other ? true : undefined,
      showOtherError: props.showOtherError ? true : undefined,
      hideLabel: props.hideLabel ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
