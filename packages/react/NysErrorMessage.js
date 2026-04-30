import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysErrorMessage = forwardRef((props, forwardedRef) => {
  const { showDivider, showError, errorMessage, id, ...filteredProps } = props;

  return React.createElement(
    "nys-errormessage",
    {
      ...filteredProps,
      errorMessage: props.errorMessage,
      id: props.id,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      showDivider: props.showDivider ? true : undefined,
      showError: props.showError ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
