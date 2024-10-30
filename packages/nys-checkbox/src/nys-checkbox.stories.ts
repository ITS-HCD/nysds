import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-checkbox";

// Define the structure of the args used in the stories
interface NysCheckboxArgs {
  checked: boolean;
  disabled: boolean;
  label: string;
  description: string;
  id: string;
  name: string;
  value: string;
  required: boolean;
}

const meta: Meta<NysCheckboxArgs> = {
  title: "Components/Checkbox",
  component: "nys-checkbox",
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    id: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    required: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysCheckboxArgs>;

// Define stories without using args

// Story: Unchecked
export const Unchecked: Story = {
  args: {
    checked: false,
    disabled: false,
    label: "Join our Monthly Newsletter",
    description: "Receive the latest news and updates in your inbox.",
    name: "subscribe",
    value: "monthly-news",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
    ></nys-checkbox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-checkbox
  label="Join our Monthly Newsletter"
  description="Receive the latest news and updates in your inbox."
  name="subscribe"
  value="monthly-news"
  ></nys-checkbox>
        `,
        type: "auto",
      },
    },
  },
};

// Story: Checked
export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
    label: "I attest that the information provided is accurate and complete.",
    description: "",
    name: "confirm",
    value: "confirm-accuracy",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
    ></nys-checkbox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkbox
  checked
  label="I attest that the information provided is accurate and complete."
  name="confirm"
  value="confirm-accuracy"
></nys-checkbox>
        `.trim(),
      },
    },
  },
};

// Story: Disabled and Unchecked
export const DisabledUnchecked: Story = {
  args: {
    checked: false,
    disabled: true,
    label: "Register for Early Voting",
    description: "This option is currently unavailable.",
    name: "earlyVoting",
    value: "early-voting",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
    ></nys-checkbox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkbox
  disabled
  label="Register for Early Voting"
  description="This option is currently unavailable."
  name="earlyVoting"
  value="early-voting"
></nys-checkbox>
        `.trim(),
      },
    },
  },
};

// Story: Disabled and Checked
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    label: "Subscribe to NYS Government Updates",
    description: "Get notified via email about important updates and services.",
    id: "subscribe-checkbox-disabled-checked",
    name: "subscribe",
    value: "email-updates",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .label=${args.label}
      .description=${args.description}
      .id=${args.id}
      .name=${args.name}
      .value=${args.value}
    ></nys-checkbox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkbox
  checked
  disabled
  label="Subscribe to NYS Government Updates"
  description="Get notified via email about important updates and services."
  id="subscribe-checkbox-disabled-checked"
  name="subscribe"
  value="email-updates"
></nys-checkbox>
        `.trim(),
      },
    },
  },
};
