import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-pagination";

const meta: Meta = {
  title: "Components/Pagination",
  component: "nys-pagination",
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
    return html`
      <nys-pagination currentPage="5" totalPages="10"></nys-pagination>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-pagination currentPage="5" totalPages="10"></nys-pagination>`,
        type: "auto",
      },
    },
  },
};

export const FirstPage: Story = {
  render: () => {
    return html`
      <nys-pagination currentPage="1" totalPages="10"></nys-pagination>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-pagination currentPage="1" totalPages="10"></nys-pagination>`,
        type: "auto",
      },
    },
  },
};

export const LastPage: Story = {
  render: () => {
    return html`
      <nys-pagination currentPage="10" totalPages="10"></nys-pagination>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-pagination currentPage="10" totalPages="10"></nys-pagination>`,
        type: "auto",
      },
    },
  },
};
