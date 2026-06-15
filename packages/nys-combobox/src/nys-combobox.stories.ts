import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-combobox";

// Define the structure of the args used in the stories
interface NysComboboxArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  value: string;
  tooltip: string;
  form: string | null;
  width: "md" | "lg" | "full";
  errorMessage: string;
  disabled: boolean;
  required: boolean;
  optional: boolean;
  inverted: boolean;
  showError: boolean;
}

const meta: Meta<NysComboboxArgs> = {
  title: "Components/Combobox",
  component: "nys-combobox",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    value: { control: "text" },
    tooltip: { control: "text" },
    form: { control: "text" },
    width: { control: "select", options: ["md", "lg", "full"] },
    errorMessage: { control: "text" },
    disabled: { control: "boolean", default: false },
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
type Story = StoryObj<NysComboboxArgs>;

export const Basic: Story = {
  args: {
    label: "Select your favorite fruit",
    value: "apple",
  },
  render: (args) => {
    return html`
      <nys-combobox
        .id=${args.id}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?optional=${args.optional}
        ?inverted=${args.inverted}
        ?showError=${args.showError}
        .name=${args.name}
        .label=${args.label}
        .description=${args.description}
        .value=${args.value}
        .tooltip=${args.tooltip}
        .form=${args.form}
        .width=${args.width}
        .errorMessage=${args.errorMessage}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const OptionGroups: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select a fruit">
        <optgroup label="Citrus">
          <option value="lemon">Lemon</option>
          <option value="orange">Orange</option>
        </optgroup>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select a fruit">
  <optgroup label="Citrus">
    <option value="lemon">Lemon</option>
    <option value="orange">Orange</option>
  </optgroup>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select your favorite fruit" disabled>
        <option value="apple">Apple</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" disabled>
  <option value="apple">Apple</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const ErrorState: Story = {
  render: () => {
    return html`
      <nys-combobox
        label="Select your favorite fruit"
        showError
        errorMessage="Error message"
      >
        <option value="apple">Apple</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" showError errorMessage="Error message">
  <option value="apple">Apple</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};
