import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-pagination";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysPaginationArgs {
  id: string;
  name: string;
  currentPage: number;
  totalPages: number;
}

const meta: Meta<NysPaginationArgs> = {
  title: "Components/Pagination",
  component: "nys-pagination",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    currentPage: { control: "number" },
    totalPages: { control: "number" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysPaginationArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "pagination1",
    name: "pagination1",
    currentPage: 4,
    totalPages: 10,
  },
  render: (args) => html`
    <nys-pagination
      .id=${args.id}
      .name=${args.name}
      .currentPage=${args.currentPage}
      .totalPages=${args.totalPages}
    ></nys-pagination>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-pagination
  id="pagination1"
  name="pagination1"
  currentPage=4
  totalPages=10
></nys-pagination>`,
        type: "auto",
      },
    },
  },
};
