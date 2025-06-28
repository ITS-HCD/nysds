import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-fileinput";

// Define the structure of the args used in the stories
interface NysFileinputArgs {
  id?: string;
  name?: string;
  label?: string;
  description?: string;
  multiple?: boolean;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
}

const meta: Meta<NysFileinputArgs> = {
  title: "Components/Fileinput",
  component: "nys-fileinput",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    multiple: { control: "boolean" },
    accept: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
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
type Story = StoryObj<NysFileinputArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "fileinput1",
    name: "fileinput1",
    label: "Upload a file",
    description: "Accepted formats: PDF, JPG, PNG",
    multiple: false,
    accept: "image/png, image/jpeg, image/*,.pdf",
    required: false,
    disabled: false,
    errorMessage: "",
  },
  render: (args) => html`
    <nys-fileinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      ?multiple=${args.multiple}
      .accept=${args.accept}
      ?required=${args.required}
      ?disabled=${args.disabled}
      .errorMessage=${args.errorMessage}
    ></nys-fileinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput
  id="fileinput1"
  name="fileinput1"
  label="Upload a file"
  description="Accepted formats: PDF, JPG"
  accept="image/png, image/jpeg, image/*,.pdf"
></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};