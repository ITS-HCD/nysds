import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-dropdownmenu";

// Define the structure of the args used in the stories
interface NysDropdownmenuArgs {
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

const meta: Meta<NysDropdownmenuArgs> = {
  title: "Components/Dropdownmenu",
  component: "nys-dropdownmenu",
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
type Story = StoryObj<NysDropdownmenuArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "dropdownmenu1",
    name: "dropdownmenu1",
  },
  render: (args) => html`
    <nys-dropdownmenu .id=${args.id} .name=${args.name}></nys-dropdownmenu>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-dropdownmenu
  id="dropdownmenu1"
  name="dropdownmenu1"
></nys-dropdownmenu>`,
        type: "auto",
      },
    },
  },
};
