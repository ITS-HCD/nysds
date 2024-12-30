import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-checkbox";
import "./nys-checkboxgroup";

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
  showError: boolean;
  errorMessage: string;
}

const meta: Meta<NysCheckboxArgs> = {
  title: "Components/Checkbox",
  component: "nys-checkbox",
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    id: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    showError: { control: "boolean" },
    errorMessage: { control: "text" },
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
    required: false,
    label: "Join our Monthly Newsletter",
    description: "Receive the latest news and updates in your inbox.",
    name: "subscribe",
    value: "monthly-news",
    showError: false,
    errorMessage: "You must select this box to continue.",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .required=${args.required}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
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
    required: false,
    label: "I attest that the information provided is accurate and complete.",
    description: "",
    name: "confirm",
    value: "confirm-accuracy",
    showError: false,
    errorMessage: "You must select this box to continue.",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .required=${args.required}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
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
    required: false,
    label: "Register for Early Voting",
    description: "This option is currently unavailable.",
    name: "earlyVoting",
    value: "early-voting",
    showError: false,
    errorMessage: "You must select this box to continue.",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .required=${args.required}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
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
    required: false,
    label: "Subscribe to NYS Government Updates",
    description: "Get notified via email about important updates and services.",
    id: "subscribe-checkbox-disabled-checked",
    name: "subscribe",
    value: "email-updates",
    showError: false,
    errorMessage: "You must select this box to continue.",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .required=${args.required}
      .label=${args.label}
      .description=${args.description}
      .id=${args.id}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
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

// Story: Error Message
export const Required: Story = {
  args: {
    checked: false,
    disabled: false,
    required: true,
    label: "Subscribe to NYS Government Updates",
    description: "Get notified via email about important updates and services.",
    id: "subscribe-checkbox-disabled-checked",
    name: "subscribe",
    value: "email-updates",
    showError: false,
    errorMessage: "You must select this box to continue.",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .required=${args.required}
      .label=${args.label}
      .description=${args.description}
      .id=${args.id}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-checkbox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkbox
  label="Subscribe to NYS Government Updates"
  description="Get notified via email about important updates and services."
  id="subscribe-checkbox-disabled-checked"
  name="subscribe"
  value="email-updates"
  required
></nys-checkbox>
        `.trim(),
      },
    },
  },
};

// Story: Error Message
export const ErrorMessage: Story = {
  args: {
    checked: false,
    disabled: false,
    required: false,
    label: "Subscribe to NYS Government Updates",
    description: "Get notified via email about important updates and services.",
    id: "subscribe-checkbox-disabled-checked",
    name: "subscribe",
    value: "email-updates",
    showError: true,
    errorMessage: "You must select this box to continue.",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .required=${args.required}
      .label=${args.label}
      .description=${args.description}
      .id=${args.id}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-checkbox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkbox
  label="Subscribe to NYS Government Updates"
  description="Get notified via email about important updates and services."
  id="subscribe-checkbox-disabled-checked"
  name="subscribe"
  value="email-updates"
  showError
  errorMessage="You must select this box to continue."
></nys-checkbox>
        `.trim(),
      },
    },
  },
};

// Story: Slot Description
export const Slot: Story = {
  args: {
    checked: false,
    disabled: false,
    required: false,
    label: "Subscribe to NYS Government Updates",
    description: "Read about previous updates ",
    id: "subscribe-updates",
    name: "subscribe",
    value: "email-updates",
    showError: false,
    errorMessage: "You must select this box to continue.",
  },
  render: (args) => html`
    <nys-checkbox
      .checked=${args.checked}
      .disabled=${args.disabled}
      .required=${args.required}
      .label=${args.label}
      .id=${args.id}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <label slot="description"
        >${args.description}
        <a href="https://www.ny.gov/" target="__blank">here</a></label
      >
    </nys-checkbox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkbox
  label="Subscribe to NYS Government Updates"
  id="subscribe-updates"
  name="subscribe"
  value="email-updates"
>
  <label slot="description">
  Read about previous updates <a href="https://www.ny.gov/" target="__blank">here</a>
  </label>
</nys-checkbox>
        `.trim(),
      },
    },
  },
};

// Story: Checkbox Group
export const CheckboxGroup: Story = {
  args: {
    label: "Do you attest to the following:",
    description: "Description as a ",
    id: "attest-group",
    name: "attest-group",
    showError: false,
    required: true,
    errorMessage: "You must select both options to continue.",
  },
  render: (args) => html`
    <div style="display: flex;">
      <nys-checkboxgroup
        style="flex: 1;"
        .label=${args.label}
        .description="${args.description} prop"
        .id=${args.id}
        .name=${args.name}
        .required=${args.required}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
      >
        <nys-checkbox
          label="I have read the terms and conditions."
          id="terms-conditions"
          name="terms"
          value="terms-conditions"
        ></nys-checkbox>
        <nys-checkbox
          label="I will not sue you."
          id="legal"
          name="legal"
          value="legal"
        ></nys-checkbox>
      </nys-checkboxgroup>
      <nys-checkboxgroup
        style="flex: 1;"
        .label=${args.label}
        .id=${args.id}
        .name=${args.name}
        .required=${args.required}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
      >
        <label slot="description"
          >${args.description}
          <a href="https://www.ny.gov/" target="__blank">slot</a></label
        >
        <nys-checkbox
          label="I have read the terms and conditions."
          id="terms-conditions"
          name="terms"
          value="terms-conditions"
        ></nys-checkbox>
        <nys-checkbox
          label="I will not sue you."
          id="legal"
          name="legal"
          value="legal"
        ></nys-checkbox>
      </nys-checkboxgroup>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup
  label="Do you attest to the following:"
  description="Description as a prop"
>
  <nys-checkbox
    label="I have read the terms and conditions."
    id="terms-conditions"
    name="terms"
    value="terms-conditions"
  ></nys-checkbox>
  <nys-checkbox
    label="I will not sue you."
    id="legal"
    name="legal"
    value="legal"
  ></nys-checkbox>
</nys-checkboxgroup>
<nys-checkboxgroup
  label="Do you attest to the following:"
>
  <label slot="description"
    >Description as a 
    <a href="https://www.ny.gov/" target="__blank">slot</a></label
  >
  <nys-checkbox
    label="I have read the terms and conditions."
    id="terms-conditions"
    name="terms"
    value="terms-conditions"
  ></nys-checkbox>
  <nys-checkbox
    label="I will not sue you."
    id="legal"
    name="legal"
    value="legal"
  ></nys-checkbox>
</nys-checkboxgroup>
        `.trim(),
      },
    },
  },
};
