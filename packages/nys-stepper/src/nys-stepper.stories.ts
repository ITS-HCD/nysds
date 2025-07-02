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
      <nys-stepper
        .id=${args.id}
        .name=${args.name}
        label=${args.label}
        contentTarget="stepper-content"
      >
        <nys-step label="Personal Details" href="/personal.html"></nys-step>
        <nys-step label="Team Info" selected href="/team.html"></nys-step>
        <nys-step label="Usage Survey" current href="/survey.html"></nys-step>
        <nys-step label="Newsletter Opt-In" href="/newsletter.html"></nys-step>
        <div slot="actions">
          <nys-button variant="outline" label="Save & Exit"></nys-button>
        </div>
      </nys-stepper>
      <div
        id="stepper-content"
        style="background: var(--nys-color-theme-weak); width: -webkit-fill-available; height: -webkit-fill-available;"
      >
        Loading...
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
