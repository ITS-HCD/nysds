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
    <div class="pagination-wrapper">
      <p id="page-text">Displaying content of page ${args.currentPage}</p>
      <nys-pagination
        .id=${args.id}
        .name=${args.name}
        .currentPage=${args.currentPage}
        .totalPages=${args.totalPages}
        @nys-change=${(e: CustomEvent) => {
          const p = document.getElementById("page-text");
          if (p) {
            p.textContent = "Displaying content of page " + e.detail.page;
          }
        }}
      ></nys-pagination>
    </div>
    <style>
      .pagination-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    </style>
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
