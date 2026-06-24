import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-label";
import "@nysds/nys-tooltip";

const meta: Meta = {
  title: "Components/Label",
  component: "nys-label",
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
  render: () => {
    return html` <nys-label label="This is a basic nys-label"></nys-label> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="This is a basic nys-label"></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-label label="This form is required" flag="required"></nys-label>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="This form is required" flag="required"></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html`
      <nys-label label="This form is required" flag="optional"></nys-label>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="This form is required" flag="optional"></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const Description: Story = {
  render: () => {
    return html`
      <nys-label label="Label Text" description="Description text"></nys-label>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="Label Text" description="Description text"></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  render: () => {
    return html`
      <nys-label label="Label Text">
        <p slot="description">
          Rich text description passed in
          <strong>HERE</strong>
        </p>
      </nys-label>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="Label Text">
  <p slot="description">
    Rich text description passed in
    <strong>HERE</strong>
  </p>
</nys-label>`,
        type: "auto",
      },
    },
  },
};

export const WithTooltip: Story = {
  render: () => {
    return html`
      <nys-label id="label-id" label="This label has a tooltip"></nys-label>
      <nys-tooltip for="label-id" text="Tooltip text in here"></nys-tooltip>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label id="label-id" label="This label has a tooltip"></nys-label>
<nys-tooltip for="label-id" text="Tooltip text in here"></nys-tooltip>`,
        type: "auto",
      },
    },
  },
};
