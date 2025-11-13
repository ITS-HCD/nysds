import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMAtooltip>", {
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
      position="${props.position}"
    ></nys-tooltip>
  `,
});
