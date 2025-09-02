import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_ACCORDIONITEM>", {
  props: {
    heading: figma.string("Heading"),
    expanded: figma.boolean("Expanded"),
  },
  example: (props) => html`
    <nys-accordionitem heading="${props.heading}" expanded=${props.expanded}>
      <p>
        This is example accordion content. Customize the content inside the
        slot.
      </p>
    </nys-accordionitem>
  `,
});

figma.connect("<FIGMA_ACCORDION>", {
  props: {
    singleSelect: figma.boolean("Single Select"),
    bordered: figma.boolean("Bordered"),
    expanded: figma.boolean("Expanded"),
  },
  example: (props) => html`
    <nys-accordion
      singleSelect=${props.singleSelect}
      bordered=${props.bordered}
    >
      <nys-accordionitem
        id="accordion1"
        heading="Accordion One"
        ${props.expanded}
      >
        <p>This is the content of accordion one.</p>
      </nys-accordionitem>
      <nys-accordionitem id="accordion2" heading="Accordion Two">
        <p>This is the content of accordion two.</p>
      </nys-accordionitem>
      <nys-accordionitem id="accordion3" heading="Accordion Three">
        <p>This is the content of accordion three.</p>
      </nys-accordionitem>
    </nys-accordion>
  `,
});
