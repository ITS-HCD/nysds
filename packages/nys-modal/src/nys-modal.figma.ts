import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_MODAL>", {
  props: {
    modalHeader: figma.nestedProps("_Modal Header", {
      heading: figma.string("Header"),
      subheading: figma.boolean("Show subheader", {
        true: figma.string("Subhead"),
        false: undefined,
      }),
    }),

    modalContent: figma.nestedProps("_Modal Content", {}),

    modalFooter: figma.nestedProps("_Modal Footer", {
      primaryButton: figma.boolean("Show Primary Button"),
      secondaryButton: figma.boolean("Show Secondary Button"),
    }),
  },
  example: (props) =>
    html` <nys-modal
      heading=${props.modalHeader.heading}
      subheading=${props.modalHeader.subheading as any}
      ?open=${true}
    >
      <div slot="body">
        <!-- Example modal content -->
        ${props.modalContent ? html`<p>Modal content goes here</p>` : ""}
      </div>
      <div slot="actions">
        ${props.modalFooter.primaryButton
          ? html`<nys-button label="Confirm"></nys-button>`
          : ""}
        ${props.modalFooter.secondaryButton
          ? html`<nys-button label="Cancel" variant="outline"></nys-button>`
          : ""}
      </div>
    </nys-modal>`,
});
