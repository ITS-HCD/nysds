import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_ACCORDION>", {
  props: {
    heading: figma.string("Heading"),
    expanded: figma.boolean("Expanded"),
    bordered: figma.boolean("Bordered"),
  },
  example: (props) => html`
    <nys-accordion
      heading="${props.heading}"
      expanded=${props.expanded}
      bordered=${props.bordered}
    >
      <p>
        This is example accordion content. Customize the content inside the
        slot.
      </p>
    </nys-accordion>
  `,
});

figma.connect("<FIGMA_ACCORDIONGROUP>", {
  props: {
    singleSelect: figma.boolean("Single Select"),
    bordered: figma.boolean("Bordered"),
  },
  example: (props) => html`
    <nys-accordiongroup
      singleSelect=${props.singleSelect}
      bordered=${props.bordered}
    >
      <nys-accordion id="accordion1" heading="Accordion One" expanded>
        <p>This is the content of accordion one.</p>
      </nys-accordion>
      <nys-accordion id="accordion2" heading="Accordion Two">
        <p>This is the content of accordion two.</p>
      </nys-accordion>
      <nys-accordion id="accordion3" heading="Accordion Three">
        <p>This is the content of accordion three.</p>
      </nys-accordion>
    </nys-accordiongroup>
  `,
});
