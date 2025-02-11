import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-errormessage";

// Define the structure of the args used in the stories
interface NysErrorMessageArgs {}

const meta: Meta<NysErrorMessageArgs> = {
  title: "Components/ErrorMessage",
  component: "nys-errormessage",
  argTypes: {},
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysErrorMessageArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {},
  render: () => html``,
  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};
