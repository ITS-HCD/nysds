import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_DATEPICKER>", {
  props: {
    width: figma.enum("Width", {
      md: "md",
      lg: "lg",
      full: "full",
    }),
  },
  example: (props) => html`
    <nys-datepicker width=${props.width}></nys-datepicker>
  `,
});
