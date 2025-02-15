import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BUTTONS_BUTTON>", {
  props: {
    labelText: figma.string("Label Text"),
    size: figma.enum("Size", {
      sm: "sm",
      md: "md",
      lg: "lg",
    }),
    variant: figma.enum("Variant", {
      Filled: "filled",
      Outline: "outline",
      Ghost: "ghost",
      Text: "text",
    }),
    inverted: figma.boolean("Inverted"),
    disabled: figma.boolean("Disabled"),
  },
  example: (props) => html`
    <nys-button
      label="${props.labelText}"
      size="${props.size}"
      variant="${props.variant}"
      ?inverted="${props.inverted}"
      ?disabled="${props.disabled}"
    ></nys-button>
  `,
});
