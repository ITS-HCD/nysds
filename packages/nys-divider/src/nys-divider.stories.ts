import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-divider";

// Define the structure of the args used in the stories
interface NysDividerArgs {
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
  form: string;
  value: string;
  type: string;
  href: string;
  onClick: () => void;
}

const meta: Meta<NysDividerArgs> = {
  title: "Components/Divider",
  component: "nys-divider",
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
type Story = StoryObj<NysDividerArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "divider1",
    name: "divider1",
  },
  render: (args) => html`
    <nys-divider .id=${args.id} .name=${args.name}></nys-divider>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-divider
  id="divider1"
  name="divider1"
></nys-divider>`,
        type: "auto",
      },
    },
  },
};
