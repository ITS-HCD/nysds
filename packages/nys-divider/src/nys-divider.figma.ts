import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_DIVIDER>", {
  props: {
    inverted: figma.boolean("Inverted"),
  },
  example: (props) =>
    html` <nys-divider inverted="${props.inverted}"></nys-divider>`,
});
