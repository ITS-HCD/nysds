import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_AVATAR>", {
  props: {
    initials: figma.string("Initials"),
    interactive: figma.boolean("Interactive"),
    disabled: figma.boolean("Disabled"),
  },
  example: (props) => html`
    <nys-avatar
      initials="${props.initials}"
      interactive="${props.interactive}"
      disabled="${props.disabled}"
    ></nys-avatar>
  `,
});
