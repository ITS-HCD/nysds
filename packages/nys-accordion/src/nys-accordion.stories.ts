import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-accordion";

// Define the structure of the args used in the stories
interface NysAccordionArgs {
  id: string;
  name: string;
}

const meta: Meta<NysAccordionArgs> = {
  title: "Components/Accordion",
  component: "nys-accordion",
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
type Story = StoryObj<NysAccordionArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {},
  render: () => html` <nys-accordion></nys-accordion> `,
  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};
