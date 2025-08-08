import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-accordion";

// Define the structure of the args used in the stories
interface NysAccordionArgs {
  id: string;
  heading: string;
  expanded: boolean;
  bordered: boolean;
}

const meta: Meta<NysAccordionArgs> = {
  title: "Components/Accordion",
  component: "nys-accordion",
  argTypes: {
    id: { control: "text" },
    heading: { control: "text" },
    expanded: { control: "boolean", default: false },
    bordered: { control: "boolean", default: false },
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
  args: {
    id: "accordion1",
    heading: "accordion1",
    expanded: false,
    bordered: false,
  },
  render: (args) => html`
    <nys-accordion
      .id=${args.id}
      .heading=${args.heading}
      .expanded=${args.expanded}
      .bordered=${args.bordered}
    ></nys-accordion>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion
  id="accordion1"
  name="accordion1"
></nys-accordion>`,
        type: "auto",
      },
    },
  },
};
