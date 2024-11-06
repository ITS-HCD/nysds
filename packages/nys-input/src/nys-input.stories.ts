import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-input";

// Define the structure of the args used in the stories
interface NysInputArgs {
  checked: boolean;
  disabled: boolean;
  label: string;
  description: string;
  id: string;
  name: string;
  value: string;
  required: boolean;
}

const meta: Meta<NysInputArgs> = {
  title: "Components/Input",
  component: "nys-input",
  argTypes: {},
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysInputArgs>;

// Define stories without using args

// Story: Unchecked
export const example: Story = {
  args: {},
  render: () => html`<nys-input></nys-input>`,
  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};
