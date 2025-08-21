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
      md: "sm",
    }),
    prefixIcon: figma.boolean("Prefix Icon"),
    suffixIcon: figma.boolean("Suffix Icon"),
    prefix: figma.string("Prefix"),
    label: figma.string("Label"),
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
