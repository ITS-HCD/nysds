import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-stepper";
import "./nys-step";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysStepperArgs {
  id: string;
  name: string;
  label: string;
  isCompact?: boolean;
  onClick: () => void;
}

const meta: Meta<NysStepperArgs> = {
  title: "Components/Stepper",
  component: "nys-stepper",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    isCompact: { control: "boolean" },
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
  label="Register for Design System Office Hours"
  contentTarget="stepper-content"
>
  <nys-step label="Personal Details" href="/personal.html"></nys-step>
  <nys-step label="Team Info" selected href="/team.html"></nys-step>
  <nys-step label="Usage Survey" current href="/survey.html"></nys-step>
  <nys-step label="Newsletter Opt-In" href="/newsletter.html"></nys-step>
  <div id="stepper-content" slot="actions">
    <nys-button variant="outline" label="Save & Exit"></nys-button>
  </div>
</nys-stepper>`,
        type: "auto",
      },
    },
  },
};

export const Compact: Story = {
  args: {
    id: "stepper2",
    name: "stepper2",
    label: "Register for Design System Office Hours",
    isCompact: true,
  },

  render: (args) => html`
    <div style="display:flex; flex-direction: column; max-width: 480px">
      <nys-stepper
        .id=${args.id}
        .name=${args.name}
        label=${args.label}
        contentTarget="stepper-content2"
        .isCompact=${args.isCompact}
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
        id="stepper-content2"
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
  id="stepper2"
  name="stepper2"
  label="Register for Design System Office Hours"
  contentTarget="stepper-content"
  isCompact
>
  <nys-step label="Personal Details" href="/personal.html"></nys-step>
  <nys-step label="Team Info" selected href="/team.html"></nys-step>
  <nys-step label="Usage Survey" current href="/survey.html"></nys-step>
  <nys-step label="Newsletter Opt-In" href="/newsletter.html"></nys-step>
  <div id="stepper-content" slot="actions">
    <nys-button variant="outline" label="Save & Exit"></nys-button>
  </div>
</nys-stepper>`,

        type: "auto",
      },
    },
  },
};
