import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysGlobalFooter = forwardRef((props, forwardedRef) => {
  const { id, agencyName, agencySubheading, homepageLink, ...filteredProps } =
    props;

  return React.createElement(
    "nys-globalfooter",
    {
      ...filteredProps,
      id: props.id,
      agencyName: props.agencyName,
      agencySubheading: props.agencySubheading,
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
