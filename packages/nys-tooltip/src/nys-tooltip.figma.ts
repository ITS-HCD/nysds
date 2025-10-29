import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_TOOLTIP>", {
  props: {
    text: figma.string("Text"),
    inverted: figma.boolean("Inverted"),
    position: figma.enum("Position", {
      top: "top",
      bottom: "bottom",
      left: "left",
      right: "right",
    }),
  },
  example: (props) => html`
    <nys-tooltip
      text="${props.text}"
      ?inverted="${props.inverted}"
      position="${props.position as any}"
    ></nys-tooltip>
  `,
});
