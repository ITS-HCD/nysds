import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysRadiogroup = forwardRef((props, forwardedRef) => {
  const {
    required,
    optional,
    showError,
    tile,
    inverted,
    id,
    name,
    errorMessage,
    label,
    description,
    tooltip,
    form,
    size,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-radiogroup",
    {
      ...filteredProps,
      id: props.id,
      name: props.name,
      errorMessage: props.errorMessage,
      label: props.label,
      description: props.description,
      tooltip: props.tooltip,
      form: props.form,
      size: props.size,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      required: props.required ? true : undefined,
      optional: props.optional ? true : undefined,
      showError: props.showError ? true : undefined,
      tile: props.tile ? true : undefined,
      inverted: props.inverted ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
