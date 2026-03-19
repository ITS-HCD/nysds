import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysGlobalHeader = forwardRef((props, forwardedRef) => {
  const { appName, agencyName, homepageLink, ...filteredProps } = props;

  return React.createElement(
    "nys-globalheader",
    {
      ...filteredProps,
      appName: props.appName,
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
