import figma, { html } from "@figma/code-connect/html";

type BadgeProps = {
  intent: "neutral" | "error" | "success" | "warning";
  size: "sm" | "md";
  prefixIcon: string;
  suffixIcon: string;
  prefixLabel: string;
  label: string;
};

figma.connect<BadgeProps>("<FIGMA_BADGE>", {
  props: {
    intent: figma.enum("Intent", {
      "🔘 Neutral": "neutral",
      "🟢 Success": "success",
      "🟡 Warning": "warning",
      "🔴 Error": "error",
    }),
    size: figma.enum("Size", {
      sm: "sm",
      md: "md",
    }),
    prefixIcon: figma.boolean("Prefix Icon"),
    suffixIcon: figma.boolean("Suffix Icon"),
    prefixLabel: figma.string("↳ Prefix Label"),
    label: figma.string("Label"),
  },
  example: (props) => html`
    <nys-badge
      label=${props.label}
      intent=${props.intent}
      size=${props.size}
      prefixIcon=${props.prefixIcon}
      suffixIcon=${props.suffixIcon}
      prefixLabel=${props.prefixLabel}
    ></nys-badge>
  `,
});
