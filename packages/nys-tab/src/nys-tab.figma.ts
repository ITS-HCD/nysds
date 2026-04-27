import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_TAB>", {
  props: {
    label: figma.string("Label"),
    active: figma.boolean("Active"),
    disabled: figma.boolean("Disabled"),
  },
  example: ({ label, active, disabled }) =>
    html`<nys-tab
      label="${label}"
      ?selected="${active}"
      ?disabled="${disabled}"
    ></nys-tab>`,
});
