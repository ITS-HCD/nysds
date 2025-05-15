import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_SKIPNAV>", {
  props: {
    href: figma.string("#main-content"),
  },
  example: (props) => html`<nys-skipnav href="${props.href}"></nys-skipnav> `,
});
