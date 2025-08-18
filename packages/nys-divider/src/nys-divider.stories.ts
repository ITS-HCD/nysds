import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-divider";

// Define the structure of the args used in the stories
interface NysDividerArgs {
  size: string;
  inverted: boolean;
  vertical: boolean;
}

const meta: Meta<NysDividerArgs> = {
  title: "Components/Divider",
  component: "nys-divider",
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    inverted: { control: "boolean" },
    vertical: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysDividerArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {},
  render: (args) => html`
    <div>sample content</div>
    <nys-divider
      .size=${args.size}
      .inverted=${args.inverted}
      .vertical=${args.vertical}
    ></nys-divider>
    <div>sample content</div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-divider></nys-divider>`,
        type: "auto",
      },
    },
  },
};
