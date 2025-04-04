import figma, { html } from "@figma/code-connect/html";

// Omit any prop that is default (as it doesn't need to be passed to code)
figma.connect("<FIGMA_TOGGLE>", {
  props: {
    size: figma.enum("Size", {
      sm: "sm",
      // md: "md", // Default
    }),
    checked: figma.enum("Checked", {
      Yes: true,
      No: false,
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    noIcon: figma.boolean("Icon", {
      // Invert the boolean
      true: false,
      false: true,
    }),
    label: figma.boolean("Label", {
      true: figma.string("↳ Label"),
      false: undefined,
    }),
    description: figma.boolean("Description", {
      true: figma.string("↳ Description"),
      false: undefined,
    }),
  },
  example: (props) =>
    html` <!-- Update 'name' and 'value' attributes -->
      <nys-toggle
        size="${props.size}"
        label="${props.label}"
        description="${props.description}"
        noIcon="${props.noIcon}"
        disabled="${props.disabled}"
        checked="${props.checked}"
        name="---REPLACE_THIS---"
        value="---REPLACE_THIS---"
      >
      </nys-toggle>`,
});
