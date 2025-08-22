import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_FILEINPUT>", {
  props: {
    width: figma.enum("Width", {
      full: "full",
      lg: "lg",
    }),
    label: figma.nestedProps("Label", {
      text: figma.string("Label"),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
      required: figma.boolean("Required"),
      optional: figma.boolean("Optional"),
    }),
    input: figma.nestedProps("Input", {
      disabled: figma.boolean("Disabled"),
      multiple: figma.boolean("Multiple"),
      dropzone: figma.boolean("Dropzone"),
      accept: figma.enum("Accepted File Types/Accept", {
        none: "",
        Image: "image/*",
        CSV: ".csv",
        "Word Doc": ".doc,.docx",
        Video: "video/*",
        PDF: "application/pdf",
        "All / Any": "*/*",
      }),
      showError: figma.boolean("Error"),
    }),
    error: figma.nestedProps("Error", {
      message: figma.string("Error Message"),
    }),
  },
  example: (props) => html`
    <nys-fileinput
      width="${props.width}"
      label="${props.label.text}"
      description="${props.label.description}"
      ?required=${props.label.required}
      ?optional=${props.label.optional}
      ${props.input.multiple}
      accept="${props.input.accept}"
      ?disabled=${props.input.disabled}
      ?dropzone=${props.input.dropzone}
      ?showError=${props.input.showError}
      errorMessage="${props.error.message}"
      name="(REPLACE_NAME)"
    ></nys-fileinput>
  `,
});
