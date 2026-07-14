import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-card";
import "@nysds/nys-button";
import "@nysds/nys-badge";
import "@nysds/nys-iconlist";

const meta: Meta = {
  title: "Components/Card",
  component: "nys-card",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    preheading: "",
    heading: "Heading",
    subheading: "Subheading",
    description: "A short description of the card's subject.",
    media: "",
    inset: false,
    elevated: false,
    mediaAccent: "",
  },
  render: (args) => {
    return html`
      <nys-card
        preheading=${args.preheading}
        heading=${args.heading}
        subheading=${args.subheading}
        description=${args.description}
        media=${args.media}
        ?inset=${args.inset}
        ?elevated=${args.elevated}
        mediaAccent=${args.mediaAccent}
      ></nys-card>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-card
  heading="Heading"
  subheading="Subheading"
  description="A short description of the card's subject."
></nys-card>`,
        type: "auto",
      },
    },
  },
};

export const Preheading: Story = {
  render: () => {
    return html`
      <nys-card
        preheading="Preheading"
        heading="Heading"
        subheading="Subheading"
      ></nys-card>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-card preheading="Preheading" heading="Heading" subheading="Subheading"></nys-card>`,
        type: "auto",
      },
    },
  },
};

export const Media: Story = {
  render: () => {
    return html`
      <nys-card
        media="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
        heading="Heading"
        subheading="Subheading"
        description="A card with a media image at the top."
      ></nys-card>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-card
  media="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
  heading="Heading"
  subheading="Subheading"
  description="A card with a media image at the top."
></nys-card>`,
        type: "auto",
      },
    },
  },
};

export const InsetMedia: Story = {
  render: () => {
    return html`
      <nys-card
        media="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
        heading="Heading"
        description="Inset adds padding around the media to visually contain it."
        inset
      ></nys-card>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-card
  media="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
  heading="Heading"
  description="Inset adds padding around the media to visually contain it."
  inset
></nys-card>`,
        type: "auto",
      },
    },
  },
};

export const Elevated: Story = {
  render: () => {
    return html`
      <nys-card
        heading="Heading"
        subheading="Subheading"
        description="Elevated adds a drop shadow to give the card a raised appearance."
        elevated
      ></nys-card>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-card
  heading="Heading"
  subheading="Subheading"
  description="Elevated adds a drop shadow to give the card a raised appearance."
  elevated
></nys-card>`,
        type: "auto",
      },
    },
  },
};

export const FooterSlot: Story = {
  render: () => {
    return html`
      <nys-card
        heading="Heading"
        description="A card with actions in the footer slot."
      >
        <nys-button slot="footer" label="Learn more"></nys-button>
      </nys-card>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-card heading="Heading" description="A card with actions in the footer slot.">
  <nys-button slot="footer" label="Learn more"></nys-button>
</nys-card>`,
        type: "auto",
      },
    },
  },
};

export const TopSlot: Story = {
  render: () => {
    return html`
      <nys-card heading="Heading" subheading="Subheading">
        <nys-badge slot="top" label="New" intent="success"></nys-badge>
      </nys-card>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-card heading="Heading" subheading="Subheading">
  <nys-badge slot="top" label="New" intent="success"></nys-badge>
</nys-card>`,
        type: "auto",
      },
    },
  },
};

export const RichContent: Story = {
  render: () => {
    return html`
      <nys-card heading="What's included">
        <nys-iconlist divider>
          <nys-iconlistitem icon="check">First item</nys-iconlistitem>
          <nys-iconlistitem icon="check">Second item</nys-iconlistitem>
          <nys-iconlistitem icon="check">Third item</nys-iconlistitem>
        </nys-iconlist>
        <nys-button slot="footer" label="Get started"></nys-button>
      </nys-card>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-card heading="What's included">
  <nys-iconlist divider>
    <nys-iconlistitem icon="check">First item</nys-iconlistitem>
    <nys-iconlistitem icon="check">Second item</nys-iconlistitem>
    <nys-iconlistitem icon="check">Third item</nys-iconlistitem>
  </nys-iconlist>
  <nys-button slot="footer" label="Get started"></nys-button>
</nys-card>`,
        type: "auto",
      },
    },
  },
};
