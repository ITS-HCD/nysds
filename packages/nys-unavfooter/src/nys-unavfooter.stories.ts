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
  render: () => {
    return html` <nys-unavfooter></nys-unavfooter> `;
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
