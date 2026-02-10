import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-dropdown";

// Define the structure of the args used in the stories
interface NysDropdownArgs {
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

const meta: Meta<NysDropdownArgs> = {
  title: "Components/Dropdown",
  component: "nys-dropdown",
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
type Story = StoryObj<NysDropdownArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "dropdown1",
    name: "dropdown1",
  },
  render: (args) => html`
    <nys-dropdown .id=${args.id} .name=${args.name}></nys-dropdown>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-dropdown
  id="dropdown1"
  name="dropdown1"
></nys-dropdown>`,
        type: "auto",
      },
    },
  },
};
