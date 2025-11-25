import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_MODAL>", {
  props: {
    mandatory: figma.boolean("Mandatory"),
    modalHeader: figma.nestedProps("Modal Header", {
      heading: figma.string("Heading"),
      subheading: figma.boolean("Subheading", {
        true: figma.string("↳ Subheading"),
        false: undefined,
      }),
    }),

    modalBody: figma.boolean("Body", {
      true: html`<div slot="body"><p>Modal content goes here</p></div>`,
      false: undefined,
    }),

    modalFooter: figma.nestedProps("Modal Footer (Mobile)", {
      primaryButton: figma.boolean("Primary Button", {
        true: html`<nys-button label="Confirm"></nys-button>`,
        false: undefined,
      }),
      secondaryButton: figma.boolean("Secondary Button", {
        true: html`<nys-button label="Cancel" variant="outline"></nys-button>`,
        false: undefined,
      }),
    }),
  },
  example: (props) =>
    html` <nys-modal
      heading=${props.modalHeader.heading}
      subheading=${props.modalHeader.subheading}
      open
      ?mandatory=${props.mandatory}
    >
      ${props.modalBody}
      <div slot="actions">
        ${props.modalFooter.primaryButton} ${props.modalFooter.secondaryButton}
      </div>
    </nys-modal>`,
});
