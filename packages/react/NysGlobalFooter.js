import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysGlobalFooter = forwardRef((props, forwardedRef) => {
  const { agencyName, homepageLink, ...filteredProps } = props;

  return React.createElement(
    "nys-globalfooter",
    {
      ...filteredProps,
      agencyName: props.agencyName,
      homepageLink: props.homepageLink,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      style: { ...props.style },
    },
    props.children,
  );
});
