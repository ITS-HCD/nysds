import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-nygovid";

// Define the structure of the args used in the stories
interface NysNygovidArgs {
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

const meta: Meta<NysNygovidArgs> = {
  title: "Components/Nygovid",
  component: "nys-nygovid",
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
type Story = StoryObj<NysNygovidArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "nygovid1",
    name: "nygovid1",
  },
  render: (args) => html`
    <nys-nygovid .id=${args.id} .name=${args.name}></nys-nygovid>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-nygovid
  id="nygovid1"
  name="nygovid1"
></nys-nygovid>`,
        type: "auto",
      },
    },
  },
};
