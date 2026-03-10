import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tab";

// Define the structure of the args used in the stories
interface NysTabArgs {
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

const meta: Meta<NysTabArgs> = {
  title: "Components/Tab",
  component: "nys-tab",
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
type Story = StoryObj<NysTabArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "tab1",
    name: "tab1",
  },
  render: (args) => html`
    <nys-tab .id=${args.id} .name=${args.name}></nys-tab>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-tab
  id="tab1"
  name="tab1"
></nys-tab>`,
        type: "auto",
      },
    },
  },
};
