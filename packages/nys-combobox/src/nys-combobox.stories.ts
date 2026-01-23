import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-combobox";

// Define the structure of the args used in the stories
interface NysComboboxArgs {
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

const meta: Meta<NysComboboxArgs> = {
  title: "Components/Combobox",
  component: "nys-combobox",
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
type Story = StoryObj<NysComboboxArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "combobox1",
    name: "combobox1",
  },
  render: (args) => html`
    <nys-combobox .id=${args.id} .name=${args.name}></nys-combobox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox
  id="combobox1"
  name="combobox1"
></nys-combobox>`,
        type: "auto",
      },
    },
  },
};
