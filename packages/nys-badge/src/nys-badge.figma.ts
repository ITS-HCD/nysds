import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BADGE>", {
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
    prefixIcon: figma.string("Prefix Icon"),
    suffixIcon: figma.string("Suffix Icon"),
    prefix: figma.string("Prefix Label"),
    label: figma.string("Prefix Label"),
  },
  example: (props) => html`
    <nys-badge
      label="${props.label}"
      intent="${props.intent}"
      size="${props.size}"
      ?prefixIcon="${props.prefixIcon}"
      ?suffixIcon="${props.suffixIcon}"
      prefix="${props.prefix}"
    ></nys-badge>
  `,
});
