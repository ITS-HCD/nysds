import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_CHECKBOX>", {
  props: {
    label: figma.string("↳ Label"),
    description: figma.string("↳ Description"),
    required: figma.boolean("Required"),
    size: figma.enum("Size", {
      sm: "sm",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    multilineDescription: figma.boolean("Multiline / Description"),
    checked: figma.boolean("Checked"),
    error: figma.boolean("Error"),
  },
  example: (props) =>
    html` <nys-checkbox
      label="${props.label}"
      description="${props.description}"
      size="${props.size}"
      required="${props.required}"
      checked="${props.checked}"
      disabled="${props.disabled}"
    ></nys-checkbox>`,
});
