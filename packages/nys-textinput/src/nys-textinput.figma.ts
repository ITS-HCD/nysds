import figma, { html } from "@figma/code-connect/html";

// Omit any prop that is default (as it doesn't need to be passed to code)
figma.connect("<FIGMA_TEXTINPUT>", {
  props: {
    type: figma.nestedProps("Type", {
      width: figma.enum("Width", {
        sm: "sm",
        md: "md",
        full: "full",
      }),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      value: figma.boolean("Show Input", {
        true: figma.string("Input"),
        false: undefined,
      }),
      placeholder: figma.boolean("Placeholder", {
        true: figma.string("↳ Placeholder"),
        false: undefined,
      }),
    }),
  },
  example: (props) =>
    html` <!-- Replace "name" value with the name of your form field -->
      <nys-textinput
        width="${props.type.width}"
        value="${props.type.value}"
        placeholder="${props.type.placeholder}"
        name="(REPLACE)"
        disabled="${props.type.disabled}"
      ></nys-textinput>`,
});
