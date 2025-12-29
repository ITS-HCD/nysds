import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_PAGINATION>", {
  props: {
    // Pagination in figma contains props that toggles buttons in design. It's different to how this web component props should be displayed.
    // Therefore, we hardcode the props to match the consistency of the design.
  },
  example: () => html`
    <nys-pagination
      id="pagination"
      name="pagination"
      currentPage="4"
      totalPages="10"
    >
    </nys-pagination>
  `,
});
