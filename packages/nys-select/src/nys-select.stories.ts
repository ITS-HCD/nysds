import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-select";

// Define the structure of the args used in the stories
interface NysSelectArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  value: string;
  disabled: boolean;
  required: boolean;
  form: string;
  size: string;
  options: string;
  hasError: boolean;
  errorMessage: String;
}

const meta: Meta<NysSelectArgs> = {
  title: "Components/Select",
  component: "nys-select",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    form: { control: "text" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    hasError: { control: "boolean" },
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
type Story = StoryObj<NysSelectArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "",
    value: "",
    disabled: false,
    required: false,
    form: "",
    size: "",
    hasError: false,
    errorMessage: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .size=${args.size}
      .hasError=${args.hasError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough">
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>        
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "",
    value: "",
    disabled: true,
    required: false,
    form: "",
    size: "",
    hasError: false,
    errorMessage: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .size=${args.size}
      .hasError=${args.hasError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" disabled>
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  args: {
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "",
    value: "",
    disabled: false,
    required: true,
    form: "",
    size: "",
    hasError: false,
    errorMessage: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .size=${args.size}
      .hasError=${args.hasError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" required>
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Size: Story = {
  args: {
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "Valid sizes are xs, sm, md, lg, and xl",
    value: "",
    disabled: false,
    required: true,
    form: "",
    size: "xs",
    hasError: false,
    errorMessage: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .size=${args.size}
      .hasError=${args.hasError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select 
  label="Select your favorite borough"
  description="Valid sizes are xs, sm, md, lg, and xl"
  size="xs"
>
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  args: {
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "",
    value: "",
    disabled: false,
    required: false,
    form: "",
    size: "",
    hasError: true,
    errorMessage: "This is an error message",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .size=${args.size}
      .hasError=${args.hasError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select 
  label="Select your favorite borough"
  errorMessage="This is an error message"
  hasError
>
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};
