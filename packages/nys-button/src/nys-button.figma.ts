import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BUTTON>", {
  props: {
    label: figma.string("Label Text"),
    size: figma.enum("Size", {
      sm: "sm",
      md: "md", //default
      lg: "lg",
    }),
    variant: figma.enum("Variant", {
      Outline: "outline",
      Ghost: "ghost",
      Text: "text",
    }),
    inverted: figma.boolean("Inverted"),
    disabled: figma.boolean("Disabled"),
    prefixIcon: figma.children("Prefix Icon"),
    suffixIcon: figma.children("Suffix Icon"),
  },
  example: (props) => html`
    <!--
  - Use fullWidth attribute to fill parent container
  - Update 'type' attribute to change button type: submit, reset, button (default)
  - Update 'form' attribute to associate with a form
  - Add 'href' attribute to make it a link
  - ⚠️ Icon names are not populated, replace with actual icon names
-->
    <nys-button
      label="${props.label}"
      size="${props.size}"
      variant="${props.variant}"
      inverted="${props.inverted}"
      disabled="${props.disabled}"
      ${props.prefixIcon}
      ${props.suffixIcon}
    ></nys-button>
  `,
});

// figma.connect("https://www.figma.com/design/0ogYpymUPQQfhELthntNbt/%F0%9F%92%A0-NYSDS-%2F-Components?m=auto&node-id=2205-1627&t=hlgC7mfYt6d2hrE9-1", {
//   props: { icon: figma.instance("shape") },
//   example: (props) => html`${props.icon}`,
// });

// figma.connect("<FIGMA_ICON_FIXED>", {
//   props: { icon: figma.instance("shape") },
//   example: (props) => html`${props.icon}`,
// });

/*
prefixIcon: figma.instance("Prefix Icon"),
suffixIcon: figma.instance("Suffix Icon"),

prefixIcon: figma.nestedProps("Prefix Icon", {
  shape: figma.string("shape"),
}),
suffixIcon: figma.nestedProps("Suffix Icon", {
  shape: figma.string("shape"),
}),

prefixIcon="${props.prefixIcon.shape}"
suffixIcon="${props.suffixIcon.shape}"

    prefixIcon: figma.boolean("Prefix Icon", {
      true: figma.children("Prefix Icon"),
      false: undefined,
    }),
    suffixIcon: figma.boolean("Suffix Icon", {
      true: figma.children("Suffix Icon"),
      false: undefined,
    }),



*/
