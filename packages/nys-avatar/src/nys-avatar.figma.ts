import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_AVATAR>", {
  props: {
    initials: figma.string("Initials"),
  },
  example: (props) => html`
    <nys-avatar initials="${props.initials}"></nys-avatar>
  `,
});