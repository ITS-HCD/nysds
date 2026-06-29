import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-skipnav";

const meta: Meta = {
  title: "Components/Skipnav",
  component: "nys-skipnav",
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
    return html` <nys-skipnav></nys-skipnav> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-skipnav></nys-skipnav>`,
        type: "auto",
      },
    },
  },
};

export const CustomTarget: Story = {
  render: () => {
    return html`
      <nys-skipnav href="#content-area"></nys-skipnav>
      <p id="content-area">...</p>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-skipnav href="#content-area"></nys-skipnav>
<p id="content-area">...</p>`,
        type: "auto",
      },
    },
  },
};
