import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-card";
import "@nysds/nys-badge";
import "@nysds/nys-button";
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
    subheading: "",
    description: "A short description of the card's subject.",
    media: "",
    inset: false,
    elevated: false,
    mediaAccent: "",
  },
  render: (args) => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
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
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card heading="Heading" description="A short description of the card's subject."></nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const Preheading: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card
          preheading="Preheading"
          heading="Heading"
          description="A short description of the card's subject."
        ></nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card
    preheading="Preheading"
    heading="Heading"
    description="A short description of the card's subject."
  ></nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const HeadingLevel: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card
          heading="Heading"
          headingLevel="h3"
          description="Set the heading level to fit the page's heading hierarchy."
        ></nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card
    heading="Heading"
    headingLevel="h3"
    description="Set the heading level to fit the page's heading hierarchy."
  ></nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const Subheading: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card
          heading="Heading"
          subheading="Subheading"
          description="A short description of the card's subject."
        ></nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card
    heading="Heading"
    subheading="Subheading"
    description="A short description of the card's subject."
  ></nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const Media: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card heading="Heading" description="A card with a media image.">
          <img
            slot="media"
            src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
          />
        </nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card heading="Heading" description="A card with a media image.">
    <img
      slot="media"
      src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
    />
  </nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const InsetMedia: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card
          heading="Heading"
          description="Inset adds padding around the media to visually contain it."
          inset
        >
          <img
            slot="media"
            src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
          />
        </nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card
    heading="Heading"
    description="Inset adds padding around the media to visually contain it."
    inset
  >
    <img
      slot="media"
      src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
    />
  </nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const MediaAccent: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card
          heading="Heading"
          description="A card with a media image and a date accent."
        >
          <img
            slot="media"
            src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
          />
          <span slot="media-accent">Oct 16</span>
        </nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card heading="Heading" description="A card with a media image and a date accent.">
    <img
      slot="media"
      src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
    />
    <span slot="media-accent">Oct 16</span>
  </nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const InsetMediaAccent: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card
          heading="Heading"
          description="A card with a media image and a date accent."
          inset
        >
          <img
            slot="media"
            src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
          />
          <span slot="media-accent">10/16</span>
        </nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card heading="Heading" description="A card with a media image and a date accent." inset>
    <img
      slot="media"
      src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop"
    />
    <span slot="media-accent">10/16</span>
  </nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const Elevated: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card
          heading="Heading"
          description="Elevated adds a drop shadow to give the card a raised appearance."
          elevated
        ></nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card
    heading="Heading"
    description="Elevated adds a drop shadow to give the card a raised appearance."
    elevated
  ></nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const FooterSlot: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card
          heading="Heading"
          description="A card with actions in the footer slot."
        >
          <nys-button slot="footer" label="Learn more"></nys-button>
        </nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card heading="Heading" description="A card with actions in the footer slot.">
    <nys-button slot="footer" label="Learn more"></nys-button>
  </nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const TopSlot: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card
          heading="Heading"
          description="A card with content in the top slot."
        >
          <nys-badge slot="top" label="New" intent="success"></nys-badge>
        </nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card heading="Heading" description="A card with content in the top slot.">
    <nys-badge slot="top" label="New" intent="success"></nys-badge>
  </nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};

export const IconList: Story = {
  render: () => {
    return html`
      <div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
        <nys-card heading="What's included">
          <nys-iconlist divider>
            <nys-iconlistitem icon="check">First item</nys-iconlistitem>
            <nys-iconlistitem icon="check">Second item</nys-iconlistitem>
            <nys-iconlistitem icon="check">Third item</nys-iconlistitem>
          </nys-iconlist>
        </nys-card>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3">
  <nys-card heading="What's included">
    <nys-iconlist divider>
      <nys-iconlistitem icon="check">First item</nys-iconlistitem>
      <nys-iconlistitem icon="check">Second item</nys-iconlistitem>
      <nys-iconlistitem icon="check">Third item</nys-iconlistitem>
    </nys-iconlist>
  </nys-card>
</div>`,
        type: "auto",
      },
    },
  },
};
