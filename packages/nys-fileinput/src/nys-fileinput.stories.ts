import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-fileinput";

// Define the structure of the args used in the stories
interface NysFileinputArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  form: string | null;
  tooltip: string;
  accept: string;
  errorMessage: string;
  width: "lg" | "full";
  multiple: boolean;
  disabled: boolean;
  required: boolean;
  optional: boolean;
  showError: boolean;
  dropzone: boolean;
  inverted: boolean;
}

const meta: Meta<NysFileinputArgs> = {
  title: "Components/Fileinput",
  component: "nys-fileinput",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    form: { control: "text" },
    tooltip: { control: "text" },
    accept: { control: "text" },
    errorMessage: { control: "text" },
    width: { control: "select", options: ["lg", "full"] },
    multiple: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
    required: { control: "boolean", default: false },
    optional: { control: "boolean", default: false },
    showError: { control: "boolean", default: false },
    dropzone: { control: "boolean", default: false },
    inverted: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysFileinputArgs>;

export const Basic: Story = {
  args: {
    required: true,
    label: "Upload document",
    accept: ".pdf,.doc",
  },
  render: (args) => {
    return html`
      <nys-fileinput
        .id=${args.id}
        ?multiple=${args.multiple}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?optional=${args.optional}
        ?showError=${args.showError}
        ?dropzone=${args.dropzone}
        ?inverted=${args.inverted}
        .name=${args.name}
        .label=${args.label}
        .description=${args.description}
        .form=${args.form}
        .tooltip=${args.tooltip}
        .accept=${args.accept}
        .errorMessage=${args.errorMessage}
        .width=${args.width}
      ></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput label="Upload document" accept=".pdf,.doc" required></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const MultipleFilesWithDropzone: Story = {
  render: () => {
    return html`
      <nys-fileinput
        label="Upload images"
        accept="image/*"
        multiple
        dropzone
      ></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput label="Upload images" accept="image/*" multiple dropzone></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};
