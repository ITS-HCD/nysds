import figma, { html } from "@figma/code-connect/html";

// Omit any prop that is default (as it doesn't need to be passed to code)
// TODO: Need to address varying props across different subcomponents
figma.connect("<FIGMA_TEXTINPUT>", {
  props: {
    width: figma.enum<"sm" | "md" | "lg" | "full">("Width", {
      sm: "sm",
      md: "md",
      lg: "lg",
      full: "full",
    }),
    label: figma.nestedProps("Label", {
      text: figma.string("Label"),
      optional: figma.boolean("Optional"),
      required: figma.boolean("Required"),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    input: figma.nestedProps("Input", {
      disabled: figma.boolean("Disabled"),
      value: figma.boolean("Value", {
        true: figma.string("↳ Value"),
        false: undefined,
      }),
      placeholder: figma.boolean("Placeholder", {
        true: figma.string("↳ Placeholder"),
        false: undefined,
      }),
      showError: figma.boolean("Error"),
    }),
    error: figma.nestedProps("Error", {
      message: figma.string("Error Message"),
    }),
  },
  example: (props) =>
    html`<!-- Update 'name' attribute -->
      <nys-textinput
        width="${props.width}"
        label="${props.label.text}"
        ?required="${props.label.required}"
        ?optional="${props.label.optional}"
        description="${props.label.description}"
        value="${props.input.value}"
        placeholder="${props.input.placeholder}"
        ?disabled="${props.input.disabled}"
        ?showError="${props.input.showError}"
        errorMessage="${props.error.message}"
        name="---REPLACE_THIS---"
      ></nys-textinput>`,
});
