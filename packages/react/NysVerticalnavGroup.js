import React, { forwardRef } from "react";
import "../../dist/nysds.es.js";

export const NysVerticalnavGroup = forwardRef((props, forwardedRef) => {
<<<<<<< HEAD
  const ref = useRef(null);
  const { expanded, disabled, active, id, label, ...filteredProps } = props;
=======
  const { expanded, disabled, active, label, ...filteredProps } = props;
>>>>>>> 317e64b8f150634941aaac4ef6a4ea9063a4fff7

  return React.createElement(
    "nys-verticalnavgroup",
    {
      ...filteredProps,
      id: props.id,
      label: props.label,
      class: props.className,
      exportparts: props.exportparts,
      for: props.htmlFor,
      part: props.part,
      tabindex: props.tabIndex,
      expanded: props.expanded ? true : undefined,
      disabled: props.disabled ? true : undefined,
      active: props.active ? true : undefined,
      style: { ...props.style },
    },
    props.children,
  );
});
