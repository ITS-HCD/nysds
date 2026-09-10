import figma, { html } from "@figma/code-connect/html";

// The published "NYS Card [Preview]" component exposes no top-level properties;
// its text/boolean props live on the nested "Card" (_Card Subcomponent) and
// "_Card Content" instances, so they are reached via nestedProps.
figma.connect("<FIGMA_CARD>", {
  props: {
    card: figma.nestedProps("Card", {
      elevated: figma.enum("Elevated", {
        True: true,
      }),
    }),
    content: figma.nestedProps("_Card Content", {
      preheading: figma.boolean("PreHeading", {
        true: figma.string("PreHeading Text"),
        false: undefined,
      }),
      heading: figma.string("Heading Text"),
      subheading: figma.boolean("Subheading", {
        true: figma.string("Subheading Text"),
        false: undefined,
      }),
      description: figma.boolean("Description", {
        true: figma.string("Text"),
        false: undefined,
      }),
    }),
  },
  example: (props) => html`
    <nys-card
      heading=${props.content.heading}
      preheading=${props.content.preheading}
      subheading=${props.content.subheading}
      description=${props.content.description}
      elevated=${props.card.elevated}
    ></nys-card>
  `,
});
