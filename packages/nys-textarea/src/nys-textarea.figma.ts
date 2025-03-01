import figma, { html } from "@figma/code-connect/html";

// Omit any value that is default (doesn't need to be passed to code)
figma.connect("<FIGMA_TEXTAREA>", {
  props: {
    width: figma.enum("Width", {
      sm: "sm",
      md: "md",
      lg: "lg",
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
      resize: figma.boolean("Resizable"),
      value: figma.boolean("Input", {
        true: figma.string("↳ Input"),
        false: undefined,
      }),
      description: figma.boolean("Input", {
        true: figma.string("↳ Input"),
        false: undefined,
      }),
      placeholder: figma.boolean("Placeholder", {
        true: figma.string("↳ Placeholder"),
        false: undefined,
      }),
      rows: figma.enum("Rows", {
        "2": "2",
        // "4": "4", // Default
        "6": "6",
      }),
      showError: figma.boolean("Error"),
    }),
    error: figma.nestedProps("Error", {
      message: figma.string("Error Message"),
    }),
  },
  example: (props) =>
    html`<!-- Update 'name' attribute -->
      <nys-textarea
        width="${props.width}"
        label="${props.label.text}"
        required="${props.label.required}"
        optional="${props.label.optional}"
        description="${props.label.description}"
        value="${props.input.value}"
        placeholder="${props.input.placeholder}"
        rows="${props.input.rows}"
        disabled="${props.input.disabled}"
        resize="${props.input.resize}"
        showError="${props.input.showError}"
        errorMessage="${props.error.message}"
        name="---REPLACE_THIS---"
      ></nys-textarea>`,
});
