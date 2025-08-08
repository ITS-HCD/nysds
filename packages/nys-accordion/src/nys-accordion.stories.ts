import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-accordion";

// Define the structure of the args used in the stories
interface NysAccordionArgs {
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
  args: {
    id: "accordion1",
    name: "accordion1",
  },
  render: (args) => html`
    <nys-accordion .id=${args.id} .name=${args.name}></nys-accordion>
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
