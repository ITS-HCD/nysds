import React, { forwardRef, useRef, useEffect } from "react";
import "../../dist/nysds.es.js";
import { useEventListener } from "./react-utils.js";

export const NysVideo = forwardRef((props, forwardedRef) => {
  const ref = useRef(null);
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

  /** Event listeners - run once */
  useEventListener(ref, "nys-video-play", props.onNysVideoPlay);

  return React.createElement(
    "nys-video",
    {
      ref: (node) => {
        ref.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
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
