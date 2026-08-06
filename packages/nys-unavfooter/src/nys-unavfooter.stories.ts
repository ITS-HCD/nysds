import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-unavfooter";

const meta: Meta = {
  title: "Components/Unavfooter",
  component: "nys-unavfooter",
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
    landmarkLabel: "New York State",
  },
  render: (args) => {
    return html`
      <nys-unavfooter landmarkLabel=${args.landmarkLabel}></nys-unavfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavfooter></nys-unavfooter>`,
        type: "auto",
      },
    },
  },
};

export const CustomLandmarkLabel: Story = {
  render: () => {
    return html`
      <!-- Renames the contentinfo landmark. Keep it distinct from the agency footer's. -->
      <nys-unavfooter landmarkLabel="Statewide"></nys-unavfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Renames the contentinfo landmark. Keep it distinct from the agency footer's. -->
<nys-unavfooter landmarkLabel="Statewide"></nys-unavfooter>`,
        type: "auto",
      },
    },
  },
};
