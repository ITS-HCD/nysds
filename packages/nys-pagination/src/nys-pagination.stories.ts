import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-pagination";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysPaginationArgs {
  id: string;
  name: string;
  size: string;
  fullWidth: boolean;
  variant: string;
  inverted: boolean;
  label: string;
  prefixIcon: string;
  suffixIcon: string;
  disabled: boolean;
  form: string | null;
  value: string;
  type: string;
  href: string;
  onClick: () => void;
}

const meta: Meta<NysPaginationArgs> = {
  title: "Components/Pagination",
  component: "nys-pagination",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
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
  },
  render: (args) => html`
    <nys-pagination .id=${args.id} .name=${args.name}></nys-pagination>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-pagination
  id="pagination1"
  name="pagination1"
></nys-pagination>`,
        type: "auto",
      },
    },
  },
};
