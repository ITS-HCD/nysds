import figma, { html } from "@figma/code-connect/html";

// figma.connect("<FIGMA_TAB>", {
//   props: {
//     label: figma.string("Label"),
//     active: figma.boolean("Active"),
//     disabled: figma.boolean("Disabled"),
//   },
//   example: (props) =>
//     html`<nys-tab
//       label="${props.label}"
//       ?selected="${props.active}"
//       ?disabled="${props.disabled}"
//     ></nys-tab>`,
// });

figma.connect("<FIGMA_TAB>", {
  example: () => html`
    <nys-tab label="Overview" selected></nys-tab>
    <nys-tab label="Details"></nys-tab>
    <nys-tab label="Settings" disabled></nys-tab>
  `,
});
