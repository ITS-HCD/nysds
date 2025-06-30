import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-stepper";
import "./nys-step";

// Define the structure of the args used in the stories
interface NysStepperArgs {
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
      <div slot="actions">
        <nys-button label="Save"></nys-button>
        <nys-button label="Exit"></nys-button>
      </div>
      <nys-step label="Step 1"></nys-step>
      <nys-step label="Step 2"></nys-step>
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
