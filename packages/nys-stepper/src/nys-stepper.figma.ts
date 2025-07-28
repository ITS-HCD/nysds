import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_STEPPER>", {
  props: {
    label: figma.string("Label"),
  },
  example: (props) => html`
    <nys-stepper label="${props.label}"></nys-stepper>
  `,
});
