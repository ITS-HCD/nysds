import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BADGE>", {
  props: {
    intent: figma.enum("Intent", {
      "🔘 Neutral": "neutral",
      "🟢 Success": "success",
      "🟡 Warning": "warning",
      "🔴 Error": "error",
    }),
    variant: figma.enum("Variant", {
      Default: "",
      Strong: "strong",
    }),
    size: figma.enum("Size", {
      sm: "sm",
      md: "md",
    }),
    prefixIcon: figma.boolean("Prefix Icon"),
    suffixIcon: figma.boolean("Suffix Icon"),
    prefixLabel: figma.boolean("Prefix Label", {
      true: figma.string("↳ Prefix Label"),
      false: undefined,
    }),
    label: figma.string("Label"),
  },
  example: (props) => html`
    <nys-badge
      label=${props.label}
      intent=${props.intent}
      variant=${props.variant}
      size=${props.size}
      prefixIcon=${props.prefixIcon}
      suffixIcon=${props.suffixIcon}
      prefixLabel=${props.prefixLabel}
    ></nys-badge>
  `,
});
