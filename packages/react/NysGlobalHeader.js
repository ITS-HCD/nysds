import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysGlobalHeader = forwardRef((props, forwardedRef) => {
  const { nysLogo, agencyName, appName, homepageLink, ...filteredProps } =
    props;

  return React.createElement(
    "nys-globalheader",
    {
      ...filteredProps,
      agencyName: props.agencyName,
      appName: props.appName,
      homepageLink: props.homepageLink,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      nysLogo: props.nysLogo ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
