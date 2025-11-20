import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-table";

// Define the structure of the args used in the stories
interface NysTableArgs {
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

const meta: Meta<NysTableArgs> = {
  title: "Components/Table",
  component: "nys-table",
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
type Story = StoryObj<NysTableArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "table1",
    name: "table1",
  },
  render: (args) => html`
    <nys-table .id=${args.id} .name=${args.name}></nys-table>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-table
  id="table1"
  name="table1"
></nys-table>`,
        type: "auto",
      },
    },
  },
};
