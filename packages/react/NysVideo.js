import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysVideo = forwardRef((props, forwardedRef) => {
  const {
    autoplay,
    disabled,
    id,
    titleText,
    videourl,
    size,
    loading,
    starttime,
    thumbnail,
    ...filteredProps
  } = props;

  return React.createElement(
    "nys-video",
    {
      ...filteredProps,
      id: props.id,
      titleText: props.titleText,
      videourl: props.videourl,
      size: props.size,
      loading: props.loading,
      starttime: props.starttime,
      thumbnail: props.thumbnail,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      autoplay: props.autoplay ? true : undefined,
      disabled: props.disabled ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
