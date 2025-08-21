import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_AVATAR>", {
  props: {
    initials: figma.string("Initials"),
    ariaLabel: figma.string("Aria Label"),
  },
  example: (props) => html`
    <nys-avatar
      initials="${props.initials}"
      ariaLabel="${props.ariaLabel}"
    ></nys-avatar>
  `,
});
