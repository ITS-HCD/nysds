import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-textinput";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysTextinputArgs {
  id: string;
  name: string;
  type: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
  label: string;
  description: string;
  placeholder: string;
  value: string;
  tooltip: string;
  form: string | null;
  pattern: string;
  maxlength: number | null;
  ariaLabel: string;
  width: "sm" | "md" | "lg" | "full";
  step: number | null;
  min: number | null;
  max: number | null;
  errorMessage: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  optional: boolean;
  inverted: boolean;
  showError: boolean;
}

const meta: Meta<NysTextinputArgs> = {
  title: "Components/Textinput",
  component: "nys-textinput",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    type: {
      control: "select",
      options: ["email", "number", "password", "search", "tel", "text", "url"],
    },
    label: { control: "text" },
    description: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    tooltip: { control: "text" },
    form: { control: "text" },
    pattern: { control: "text" },
    maxlength: { control: "text" },
    ariaLabel: { control: "text" },
    width: { control: "select", options: ["sm", "md", "lg", "full"] },
    step: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    errorMessage: { control: "text" },
    disabled: { control: "boolean", default: false },
    readonly: { control: "boolean", default: false },
    required: { control: "boolean", default: false },
    optional: { control: "boolean", default: false },
    inverted: { control: "boolean", default: false },
    showError: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysTextinputArgs>;

export const Basic: Story = {
  args: {
    required: true,
    label: "Full Name",
  },
  render: (args) => {
    return html`
      <nys-textinput
        .id=${args.id}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?required=${args.required}
        ?optional=${args.optional}
        ?inverted=${args.inverted}
        ?showError=${args.showError}
        .name=${args.name}
        .type=${args.type}
        .label=${args.label}
        .description=${args.description}
        .placeholder=${args.placeholder}
        .value=${args.value}
        .tooltip=${args.tooltip}
        .form=${args.form}
        .pattern=${args.pattern}
        .maxlength=${args.maxlength}
        .ariaLabel=${args.ariaLabel}
        .width=${args.width}
        .step=${args.step}
        .min=${args.min}
        .max=${args.max}
        .errorMessage=${args.errorMessage}
      ></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Full Name" required></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const RequiredEmail: Story = {
  render: () => {
    return html`
      <nys-textinput
        type="email"
        label="Email Address"
        required
      ></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput type="email" label="Email Address" required></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const PhoneWithMasking: Story = {
  render: () => {
    return html`
      <nys-textinput type="tel" label="Phone Number"></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput type="tel" label="Phone Number"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const SearchWithButton: Story = {
  render: () => {
    return html`
      <nys-textinput type="search" placeholder="Search">
        <nys-button
          slot="endButton"
          label="Search"
          prefixIcon="search"
        ></nys-button>
      </nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput type="search" placeholder="Search">
  <nys-button slot="endButton" label="Search" prefixIcon="search"></nys-button>
</nys-textinput>`,
        type: "auto",
      },
    },
  },
};
