import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-badge";

// Define the structure of the args used in the stories
interface NysBadgeArgs {
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

const meta: Meta<NysBadgeArgs> = {
  title: "Components/Badge",
  component: "nys-badge",
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
type Story = StoryObj<NysBadgeArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "badge1",
    name: "badge1",
  },
  render: (args) => html`
    <nys-badge .id=${args.id} .name=${args.name}></nys-badge>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge
  id="badge1"
  name="badge1"
></nys-badge>`,
        type: "auto",
      },
    },
  },
};
