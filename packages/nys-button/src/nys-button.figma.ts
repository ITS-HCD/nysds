import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BUTTON>", {
  props: {
    labelText: figma.string("Label Text"),
    size: figma.enum("Size", {
      sm: "sm",
      // md: "md",
      lg: "lg",
    }),
    variant: figma.enum("Variant", {
      Outline: "outline",
      Ghost: "ghost",
      Text: "text",
    }),
    inverted: figma.boolean("Inverted"),
    disabled: figma.boolean("Disabled"),
    prefixIcon: figma.boolean("Prefix Icon", {
      true: "icon_name_REPLACE",
      false: undefined,
    }),
    suffixIcon: figma.boolean("Suffix Icon", {
      true: "icon_name_REPLACE",
      false: undefined,
    }),
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
      label="${props.labelText}"
      size="${props.size}"
      variant="${props.variant}"
      inverted="${props.inverted}"
      disabled="${props.disabled}"
      prefixIcon="${props.prefixIcon}"
      suffixIcon="${props.suffixIcon}"
    ></nys-button>
  `,
});

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
*/
