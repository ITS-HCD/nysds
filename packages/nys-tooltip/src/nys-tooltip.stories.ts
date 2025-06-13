import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tooltip";

// Define the structure of the args used in the stories
interface NysTooltipArgs {
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

const meta: Meta<NysTooltipArgs> = {
  title: "Components/Tooltip",
  component: "nys-tooltip",
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
type Story = StoryObj<NysTooltipArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "tooltip1",
    name: "tooltip1",
  },
  render: (args) => html`
    <nys-tooltip .id=${args.id} .name=${args.name}></nys-tooltip>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-tooltip
  id="tooltip1"
  name="tooltip1"
></nys-tooltip>`,
        type: "auto",
      },
    },
  },
};
