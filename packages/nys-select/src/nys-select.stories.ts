import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-select";

// Define the structure of the args used in the stories
interface NysSelectArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  placeholder: string;
  disabled: boolean;
  required: boolean;
  form: string;
  clearable: boolean;
  size: string;
  options: string[];
  errorMessage: String;
}

const meta: Meta<NysSelectArgs> = {
  title: "Components/Select",
  component: "nys-select",
  argTypes: {},
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

export const Blank: Story = {
  args: {
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "",
    placeholder: "",
    disabled: false,
    required: false,
    form: "",
    clearable: false,
    size: "",
    options: ["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"],
    errorMessage: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .clearable=${args.clearable}
      .size=${args.size}
      .options=${args.options}
      .errorMessage=${args.errorMessage}
    ></nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-select></nys-select>`,
        type: "auto",
      },
    },
  },
};

export const disabled: Story = {
  args: {
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "",
    placeholder: "",
    disabled: false,
    required: false,
    form: "",
    clearable: false,
    size: "",
    options: ["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"],
    errorMessage: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .clearable=${args.clearable}
      .size=${args.size}
      .options=${args.options}
      .errorMessage=${args.errorMessage}
    ></nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-select></nys-select>`,
        type: "auto",
      },
    },
  },
};
