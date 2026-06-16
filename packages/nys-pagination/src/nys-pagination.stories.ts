import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-pagination";

// Define the structure of the args used in the stories
interface NysPaginationArgs {
  id: string;
  name: string;
  currentPage: number;
  totalPages: number;
  _twoBeforeLast: boolean;
}

const meta: Meta<NysPaginationArgs> = {
  title: "Components/Pagination",
  component: "nys-pagination",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    currentPage: { control: "number" },
    totalPages: { control: "number" },
    _twoBeforeLast: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysPaginationArgs>;

export const Basic: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
  render: (args) => {
    return html`
      <nys-pagination
        .id=${args.id}
        ?_twoBeforeLast=${args["_twoBeforeLast"]}
        .name=${args["name"]}
        .currentPage=${args["currentPage"]}
        .totalPages=${args["totalPages"]}
      ></nys-pagination>
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
