import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-button";

// Define the structure of the args used in the stories
interface NysButtonArgs {
  id: string;
  name: string;
}

const meta: Meta<NysButtonArgs> = {
  title: "Components/Button",
  component: "nys-button",
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
type Story = StoryObj<NysButtonArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {},
  render: (args) => html`
    <nys-button .id=${args.id} .name=${args.name}></nys-button>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-button></nys-button>`,
        type: "auto",
      },
    },
  },
};
