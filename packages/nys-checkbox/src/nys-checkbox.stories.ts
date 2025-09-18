import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-checkbox";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

// Define the structure of the args used in the stories
interface NysCheckboxArgs {
  id: string;
  name: string;
  checked: boolean;
  label: string;
  description: string;
  size: "sm" | "md";
  tile: boolean;
  disabled: boolean;
  value: string;
  required: boolean;
  optional: boolean;
  showError: boolean;
  errorMessage: string;
  form: string | null;
}

const meta: Meta<NysCheckboxArgs> = {
  title: "Components/Checkbox",
  component: "nys-checkbox",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    checked: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    size: { control: "select", options: ["sm", "md"] },
    tile: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    value: { control: "text" },
    showError: { control: "boolean" },
    errorMessage: { control: "text" },
    form: { control: "text" },
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

// Story: Basic
export const Basic: Story = {
  args: {
    checked: true,
    disabled: false,
    required: false,
    label: "Adirondacks",
    description: "",
    name: "landmarks",
    value: "adirondacks",
    showError: false,
    errorMessage: "",
    tile: false,
    optional: false,
  },
  render: (args) => html`
    <nys-checkboxgroup
      label="Select your favorite New York landmarks"
      description="Choose from the options below"
      size=${args.size}
      .tile=${args.tile}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .form=${args.form}
    >
      <nys-checkbox
        .checked=${args.checked}
        .disabled=${args.disabled}
        .required=${args.required}
        .optional=${args.optional}
        .label=${args.label}
        .description=${args.description}
        .name=${args.name}
        .value=${args.value}
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="finger-lakes"
        label="Finger Lakes"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="catskills"
        label="Catskills"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="niagara-falls"
        label="Niagara Falls"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="coney-island"
        label="Coney Island"
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="mount-greylock"
        label="Mount Greylock"
        description="This is disabled because it's not in New York."
        disabled
      ></nys-checkbox>
    </nys-checkboxgroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup
  label="Select your favorite New York landmarks"
  description="Choose from the options below"
>
  <nys-checkbox
    label="Adirondacks"
    name="landmarks"
    value="adirondacks"
    errorMessage="You must select this box to continue"
    checked
  ></nys-checkbox>
  <nys-checkbox name="landmarks" value="finger-lakes" label="Finger Lakes" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="catskills" label="Catskills" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara-falls" label="Niagara Falls" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="coney-island" label="Coney Island"></nys-checkbox>
  <nys-checkbox label="Mount Greylock" description="This is disabled because it's not in New York." disabled></nys-checkbox>
</nys-checkboxgroup>

        `,
        type: "auto",
      },
    },
  },
};

// Story: Grouping
export const Grouping: Story = {
  args: {
    required: true,
    label: "Public Benefits Eligibility",
    description: "Choose from the options below",
  },
  render: (args) => html`
    <div style="display: flex; gap: 8px;">
      <nys-checkboxgroup
        style="flex: 1;"
        label=${args.label}
        description=${args.description}
        size=${args.size}
        .tile=${args.tile}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
        .form=${args.form}
        .required=${args.required}
        .optional=${args.optional}
      >
        <nys-checkbox
          name="benefits"
          value="snap"
          label="SNAP"
          description="The Supplemental Nutrition Assistance Program (SNAP)"
        ></nys-checkbox>
        <nys-checkbox
          name="benefits"
          value="medicaid"
          label="Medicaid"
        ></nys-checkbox>
        <nys-checkbox
          name="benefits"
          value="housing_assistance"
          label="Housing Assistance"
        ></nys-checkbox>
        <nys-checkbox
          name="benefits"
          value="none"
          label="None of the above"
        ></nys-checkbox>
      </nys-checkboxgroup>
      <nys-checkboxgroup
        style="flex: 1;"
        label="Do you attest to the following:"
      >
        <p slot="description">
          Description as a
          <a href="https://www.ny.gov/" target="__blank">slot</a>
        </p>
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
  label="Public Benefits Eligibility"
  description="Choose from the options below"
  required
>
  <nys-checkbox
    name="benefits"
    value="snap"
    label="SNAP (Food Assistance)"
  ></nys-checkbox>
  <nys-checkbox
    name="benefits"
    value="medicaid"
    label="Medicaid"
  ></nys-checkbox>
  <nys-checkbox
    name="benefits"
    value="housing_assistance"
    label="Housing Assistance"
  ></nys-checkbox>
  <nys-checkbox
    name="benefits"
    value="none"
    label="None of the above"
  ></nys-checkbox>
</nys-checkboxgroup>
<nys-checkboxgroup label="Do you attest to the following:">
  <p slot="description">Description as a <a href="https://www.ny.gov/" target="__blank">slot</a></p>
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
        `,
        type: "auto",
      },
    },
  },
};

// Story: Disabled
export const Disabled: Story = {
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
      .optional=${args.optional}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .form=${args.form}
    ></nys-checkbox>
    <nys-checkbox
      checked
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .form=${args.form}
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
<nys-checkbox
  disabled
  checked
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

export const Size: Story = {
  args: {
    checked: true,
    label: "Adirondacks",
    description: "",
    name: "landmarks",
    value: "adirondacks",
    size: "sm",
  },
  render: (args) => html`
    <nys-checkboxgroup
      label="Select your favorite New York landmarks"
      description="Choose from the options below"
      size=${args.size}
      .tile=${args.tile}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .form=${args.form}
    >
      <nys-checkbox
        .checked=${args.checked}
        .disabled=${args.disabled}
        .required=${args.required}
        .optional=${args.optional}
        .label=${args.label}
        .description=${args.description}
        .name=${args.name}
        .value=${args.value}
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="finger-lakes"
        label="Finger Lakes"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="catskills"
        label="Catskills"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="niagara-falls"
        label="Niagara Falls"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="coney-island"
        label="Coney Island"
      ></nys-checkbox>
      <nys-checkbox
        label="Mount Greylock"
        description="This is disabled because it's not in New York."
        disabled
      ></nys-checkbox>
    </nys-checkboxgroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup
  label="Select your favorite New York landmarks"
  description="Choose from the options below"
  size="sm"
>
  <nys-checkbox
    name="landmarks"
    value="adirondacks"
    label="Adirondacks"
    errorMessage="You must select this box to continue"
    checked
  ></nys-checkbox>
  <nys-checkbox name="landmarks" value="finger-lakes" label="Finger Lakes" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="catskills" label="Catskills" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara-falls" label="Niagara Falls" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="coney-island" label="Coney Island"></nys-checkbox>
  <nys-checkbox label="Mount Greylock" description="This is disabled because it's not in New York." disabled></nys-checkbox>
</nys-checkboxgroup>

        `,
        type: "auto",
      },
    },
  },
};

export const Tile: Story = {
  args: {
    checked: true,
    label: "Adirondacks",
    description: "",
    name: "landmarks",
    value: "adirondacks",
    tile: true,
  },
  render: (args) => html`
    <nys-checkboxgroup
      label="Select your favorite New York landmarks"
      description="Choose from the options below"
      size=${args.size}
      .tile=${args.tile}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .form=${args.form}
    >
      <nys-checkbox
        .checked=${args.checked}
        .disabled=${args.disabled}
        .required=${args.required}
        .optional=${args.optional}
        .label=${args.label}
        .description=${args.description}
        .name=${args.name}
        .value=${args.value}
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="finger-lakes"
        label="Finger Lakes"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="catskills"
        label="Catskills"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="niagara-falls"
        label="Niagara Falls"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="coney-island"
        label="Coney Island"
      ></nys-checkbox>
      <nys-checkbox
        label="Mount Greylock"
        description="This is disabled because it's not in New York."
        disabled
      ></nys-checkbox>
    </nys-checkboxgroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup
  label="Select your favorite New York landmarks"
  description="Choose from the options below"
  size="sm"
>
  <nys-checkbox
    name="landmarks"
    value="adirondacks"
    label="Adirondacks"
    errorMessage="You must select this box to continue"
    checked
  ></nys-checkbox>
  <nys-checkbox name="landmarks" value="finger-lakes" label="Finger Lakes" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="catskills" label="Catskills" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara-falls" label="Niagara Falls" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="coney-island" label="Coney Island"></nys-checkbox>
  <nys-checkbox label="Mount Greylock" description="This is disabled because it's not in New York." disabled></nys-checkbox>
</nys-checkboxgroup>

        `,
        type: "auto",
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
      .optional=${args.optional}
      .label=${args.label}
      .description=${args.description}
      .id=${args.id}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .form=${args.form}
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
      .optional=${args.optional}
      .label=${args.label}
      .description=${args.description}
      .id=${args.id}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .form=${args.form}
      .tile=${args.tile}
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
      .optional=${args.optional}
      .label=${args.label}
      .id=${args.id}
      .name=${args.name}
      .value=${args.value}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .form=${args.form}
    >
      <p slot="description">
        ${args.description}<a href="https://www.ny.gov/" target="__blank"
          >here</a
        >
      </p>
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
  <p slot="description"> Read about previous updates
    <a href="https://www.ny.gov/" target="__blank">here</a>
  </p>
</nys-checkbox>
        `.trim(),
      },
    },
  },
};

export const Optional: Story = {
  args: {
    checked: true,
    disabled: false,
    label: "Adirondacks",
    description: "",
    name: "landmarks",
    value: "adirondacks",
    showError: false,
    errorMessage: "",
    optional: true,
  },

  render: (args) => html`
    <nys-checkboxgroup
      label="Select your favorite New York landmarks"
      description="Choose from the options below"
      size=${args.size}
      .tile=${args.tile}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .form=${args.form}
      .required=${args.required}
      .optional=${args.optional}
    >
      <nys-checkbox
        .checked=${args.checked}
        .disabled=${args.disabled}
        .label=${args.label}
        .description=${args.description}
        .name=${args.name}
        .value=${args.value}
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="finger-lakes"
        label="Finger Lakes"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="catskills"
        label="Catskills"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="niagara-falls"
        label="Niagara Falls"
        checked
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="coney-island"
        label="Coney Island"
      ></nys-checkbox>
      <nys-checkbox
        name="landmarks"
        value="mount-greylock"
        label="Mount Greylock"
        description="This is disabled because it's not in New York."
        disabled
      ></nys-checkbox>
    </nys-checkboxgroup>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup
  label="Select your favorite New York landmarks"
  description="Choose from the options below"
  optional
>
  <nys-checkbox
    label="Adirondacks"
    name="landmarks"
    value="adirondacks"
    errorMessage="You must select this box to continue"
    checked
  ></nys-checkbox>
  <nys-checkbox name="landmarks" value="finger-lakes" label="Finger Lakes" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="catskills" label="Catskills" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara-falls" label="Niagara Falls" checked></nys-checkbox>
  <nys-checkbox name="landmarks" value="coney-island" label="Coney Island"></nys-checkbox>
  <nys-checkbox label="Mount Greylock" description="This is disabled because it's not in New York." disabled></nys-checkbox>
</nys-checkboxgroup>

        `,

        type: "auto",
      },
    },
  },
};
