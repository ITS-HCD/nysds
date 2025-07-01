import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-stepper";
import "./nys-step";

// Define the structure of the args used in the stories
interface NysStepperArgs {
  id: string;
  name: string;
  label: string;
  onClick: () => void;
}

const meta: Meta<NysStepperArgs> = {
  title: "Components/Stepper",
  component: "nys-stepper",
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
type Story = StoryObj<NysStepperArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "stepper1",
    name: "stepper1",
  },
  render: (args) => html`
    <nys-stepper .id=${args.id} .name=${args.name} label="Stepper Label">
      <nys-step label="First"></nys-step>
      <nys-step label="Second" selected></nys-step>
      <nys-step label="Third" current></nys-step>
      <nys-step label="Fourth"></nys-step>
      <nys-step label="Fifth"></nys-step>
    </nys-stepper>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-stepper
  id="stepper1"
  name="stepper1"
></nys-stepper>`,
        type: "auto",
      },
    },
  },
};
