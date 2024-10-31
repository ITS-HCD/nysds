import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-radiobutton";

// Define the structure of the args used in the stories
interface NysRadiobuttonArgs {
  checked: boolean;
  disabled: boolean;
  label: string;
  description: string;
  id: string;
  name: string;
  value: string;
  required: boolean;
}

const meta: Meta<NysRadiobuttonArgs> = {
  title: "Components/Radiobutton",
  component: "nys-radiobutton",
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
type Story = StoryObj<NysRadiobuttonArgs>;

// Define stories without using args

// Story: Unchecked
export const Unchecked: Story = {
  args: {
    checked: false,
    disabled: false,
    label: "Albany",
    description: "Upstate New York",
    value: "albany",
    name: "office",
  },
  render: (args) => html`
    <p>What is your primary work location?</p>
    <nys-radiobutton
      .checked=${args.checked}
      .disabled=${args.disabled}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
    ></nys-radiobutton>
    <nys-radiobutton
      .checked=${false}
      .disabled=${args.disabled}
      .label=${"Manhatten"}
      .description=${"New York City"}
      .name=${args.name}
      .value=${"manhatten"}
    ></nys-radiobutton>
  `,
  parameters: {
    docs: {
      source: {
        code: `<p>What is your primary work location?</p>
  <nys-radiobutton
  label="Albany"
  description="Upstate New York"
  name="office"
  value="albany"
></nys-radiobutton>
<nys-radiobutton
  label="Manhatten"
  description="New York City"
  name="office"
  value="manhatten"
></nys-radiobutton> `,
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
    <nys-radiobutton
      .checked=${args.checked}
      .disabled=${args.disabled}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
    ></nys-radiobutton>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiobutton
  checked
  label="I attest that the information provided is accurate and complete."
  name="confirm"
  value="confirm-accuracy"
></nys-radiobutton>
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
    <nys-radiobutton
      .checked=${args.checked}
      .disabled=${args.disabled}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
    ></nys-radiobutton>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiobutton
  disabled
  label="Register for Early Voting"
  description="This option is currently unavailable."
  name="earlyVoting"
  value="early-voting"
></nys-radiobutton>
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
    label: "Software Engineer 1",
    description: "<1 year experience",
    name: "title",
    value: "eng-1",
  },
  render: (args) => html`
    <p>
      Current title. Note: You cannot change your title, if you believe you are
      ready to be promoted talk to your supervisor.
    </p>
    <nys-radiobutton
      .checked=${args.checked}
      .disabled=${args.disabled}
      .label=${args.label}
      .description=${args.description}
      .id=${args.id}
      .name=${args.name}
      .value=${args.value}
    ></nys-radiobutton>
    <nys-radiobutton
      .checked=${false}
      .disabled=${args.disabled}
      .label=${"Software Engineer 2"}
      .description=${"1-3 years experience"}
      .id=${args.id}
      .name=${args.name}
      .value=${"eng-2"}
    ></nys-radiobutton>
    <nys-radiobutton
      .checked=${false}
      .disabled=${args.disabled}
      .label=${"Software Engineer 3"}
      .description=${"3-5 years experience"}
      .id=${args.id}
      .name=${args.name}
      .value=${"eng-3"}
    ></nys-radiobutton>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiobutton
  checked
  disabled
  label="Subscribe to NYS Government Updates"
  description="Get notified via email about important updates and services."
  id="subscribe-radiobutton-disabled-checked"
  name="subscribe"
  value="email-updates"
></nys-radiobutton>
        `.trim(),
      },
    },
  },
};
