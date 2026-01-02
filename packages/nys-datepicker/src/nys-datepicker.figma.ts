import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_DATEPICKER>", {
  props: {
    width: figma.enum("Width", {
      md: "md",
      lg: "lg",
      full: "full",
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
  },
  example: (props) => html`
    <nys-datepicker
      label="${props.label.text}"
      description="${props.label.description}"
      width=${props.width}
      required=${props.label.required}
      optional=${props.label.optional}
    ></nys-datepicker>
  `,
});
