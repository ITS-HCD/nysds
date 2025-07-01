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
    label: "Register for Design System Office Hours",
  },
  render: (args) => html`
    <div style="display:flex;">
      <nys-stepper .id=${args.id} .name=${args.name} label=${args.label}>
        <nys-step label="Personal Details"></nys-step>
        <nys-step label="Team Info" selected></nys-step>
        <nys-step label="Usage Survey" current></nys-step>
        <nys-step label="Newsletter Opt-In"></nys-step>
      </nys-stepper>
      <div
        style="background: var(--nys-color-theme-weak); width: -webkit-fill-available; justify-content: center; display: flex; align-items: center; height: -webkit-fill-available;"
      >
        page content
      </div>
    </div>
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
