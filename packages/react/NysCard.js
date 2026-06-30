import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysCard = forwardRef((props, forwardedRef) => {
  const {
    inset,
    elevated,
    id,
    preheading,
    heading,
    subheading,
    description,
    media,
    mediaAccent,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-card",
    {
      ...filteredProps,
      id: props.id,
      preheading: props.preheading,
      heading: props.heading,
      subheading: props.subheading,
      description: props.description,
      media: props.media,
      mediaAccent: props.mediaAccent,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      inset: props.inset ? true : undefined,
      elevated: props.elevated ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
