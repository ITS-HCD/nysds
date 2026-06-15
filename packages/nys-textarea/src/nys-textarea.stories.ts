import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-textarea";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

// Define the structure of the args used in the stories
interface NysTextareaArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  placeholder: string;
  value: string;
  tooltip: string;
  form: string | null;
  maxlength: number | null;
  width: "sm" | "md" | "lg" | "full";
  rows: number;
  resize: "vertical" | "none";
  errorMessage: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  optional: boolean;
  inverted: boolean;
  showError: boolean;
}

const meta: Meta<NysTextareaArgs> = {
  title: "Components/Textarea",
  component: "nys-textarea",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    tooltip: { control: "text" },
    form: { control: "text" },
    maxlength: { control: "text" },
    width: { control: "select", options: ["sm", "md", "lg", "full"] },
    rows: { control: "number" },
    resize: { control: "select", options: ["vertical", "none"] },
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
type Story = StoryObj<NysTextareaArgs>;

export const BasicTextarea: Story = {
  args: {
    label: "Comments",
    rows: "4",
  },
  render: (args) => {
    return html`
      <nys-textarea
        .id=${args.id}
        ?disabled=${args["disabled"]}
        ?readonly=${args["readonly"]}
        ?required=${args["required"]}
        ?optional=${args["optional"]}
        ?inverted=${args["inverted"]}
        ?showError=${args["showError"]}
        .name=${args["name"]}
        .label=${args["label"]}
        .description=${args["description"]}
        .placeholder=${args["placeholder"]}
        .value=${args["value"]}
        .tooltip=${args["tooltip"]}
        .form=${args["form"]}
        .maxlength=${args["maxlength"]}
        .width=${args["width"]}
        .rows=${args["rows"]}
        .resize=${args["resize"]}
        .errorMessage=${args["errorMessage"]}
      ></nys-textarea>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Comments" rows="4"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const RequiredWithDescription: Story = {
  render: () => {
    return html`
      <nys-textarea
        label="Describe the incident"
        description="Please provide details"
        required
      ></nys-textarea>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea
  label="Describe the incident"
  description="Please provide details"
  required
></nys-textarea>`,
        type: "auto",
      },
    },
  },
};
