import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BUTTON>", {
  props: {
    label: figma.string("Label Text"),
    size: figma.enum("Size", {
      sm: "sm",
      md: "md",
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
    ariaDescription: figma.string("Aria Description"),
    circle: figma.boolean("Circle"),
    icon: figma.children("Icon"),
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
      size="${props.size as any}"
      variant="${props.variant as any}"
      ?inverted="${props.inverted}"
      ?disabled="${props.disabled}"
      ${props.prefixIcon as any}
      ${props.suffixIcon as any}
      ?circle="${props.circle}"
      ${props.icon as any}
      ariaDescription="${props.ariaDescription}"
    ></nys-button>
  `,
});
