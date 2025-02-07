import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-fileinput";

// Define the structure of the args used in the stories
interface NysFileinputArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  placeholder: string;
  value: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  form: string;
  pattern: string;
  maxlength: string;
  width: string;
  step: string;
  min: string;
  max: string;
  showError: boolean;
  errorMessage: string;
}

const meta: Meta<NysFileinputArgs> = {
  title: "Components/Fileinput",
  component: "nys-fileinput",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    form: { control: "text" },
    pattern: { control: "text" },
    maxlength: { control: "text" },
    width: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      defaultValue: { summary: "md" },
    },
    step: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
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
type Story = StoryObj<NysFileinputArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    label: "Label",
    value: "",
  },
  render: (args) => html`
    <nys-fileinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-fileinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-fileinput label="Label"></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};
