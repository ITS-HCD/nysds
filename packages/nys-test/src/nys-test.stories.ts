import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-test";

// Define the structure of the args used in the stories
interface NysTestArgs {
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

const meta: Meta<NysTestArgs> = {
  title: "Components/Test",
  component: "nys-test",
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
type Story = StoryObj<NysTestArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "test1",
    name: "test1",
  },
  render: (args) => html`
    <nys-test .id=${args.id} .name=${args.name}></nys-test>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-test
  id="test1"
  name="test1"
></nys-test>`,
        type: "auto",
      },
    },
  },
};
