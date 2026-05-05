import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysErrorMessage = forwardRef((props, forwardedRef) => {
  const { showError, showDivider, id, errorMessage, ...filteredProps } = props;

  return React.createElement(
    "nys-errormessage",
    {
      ...filteredProps,
      id: props.id,
      errorMessage: props.errorMessage,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      showError: props.showError ? true : undefined,
      showDivider: props.showDivider ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
