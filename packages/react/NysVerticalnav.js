import React, { forwardRef } from "react";
import "@nysds/nys-verticalnav";

export const NysVerticalnav = forwardRef((props, forwardedRef) => {
  const { hideHeading, expanded, id, heading, headingLevel, ...filteredProps } =
    props;

  return React.createElement(
    "nys-verticalnav",
    {
      ...filteredProps,
      id: props.id,
      heading: props.heading,
      headingLevel: props.headingLevel,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      hideHeading: props.hideHeading ? true : undefined,
      expanded: props.expanded ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
