import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BUTTONS_BUTTON>", {
  props: {
    labelText: figma.string("Label Text"),
    size: figma.enum("Size", {
      sm: "sm",
      lg: "lg",
    }),
    variant: figma.enum("Variant", {
      outline: "outline",
      ghost: "ghost",
      text: "text",
    }),
    inverted: figma.boolean("Inverted"),
    disabled: figma.boolean("Disabled"),
    /*
    prefixIcon: figma.instance("Prefix Icon"),
    suffixIcon: figma.instance("Suffix Icon"),
    
    prefixIcon: figma.nestedProps("Prefix Icon", {
      shape: figma.string("shape"),
    }),
    suffixIcon: figma.nestedProps("Suffix Icon", {
      shape: figma.string("shape"),
    }),
    */
  },
  example: (props) => html`
    <nys-button
      label="${props.labelText}"
      size="${props.size}"
      variant="${props.variant}"
      inverted="${props.inverted}"
      disabled="${props.disabled}"
    ></nys-button>
  `,
});