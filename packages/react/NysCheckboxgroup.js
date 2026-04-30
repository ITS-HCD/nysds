import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysCheckboxgroup = forwardRef((props, forwardedRef) => {
  const {
    inverted,
    optional,
    required,
    showError,
    tile,
    description,
    errorMessage,
    form,
    id,
    label,
    name,
    size,
    tooltip,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-checkboxgroup",
    {
      ...filteredProps,
      description: props.description,
      errorMessage: props.errorMessage,
      form: props.form,
      id: props.id,
      label: props.label,
      name: props.name,
      size: props.size,
      tooltip: props.tooltip,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      inverted: props.inverted ? true : undefined,
      optional: props.optional ? true : undefined,
      required: props.required ? true : undefined,
      showError: props.showError ? true : undefined,
      tile: props.tile ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
