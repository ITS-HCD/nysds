import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-textinput";

// Define the structure of the args used in the stories
interface NysSelectArgs {
  id: string;
  name: string;
  type: string;
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
  size: string;
  step: string;
  min: string;
  max: string;
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
    type: "",
    label: "",
    description: "",
    placeholder: "",
    value: "",
    disabled: false,
    readonly: false,
    required: false,
    form: "",
    pattern: "",
    maxlength: "",
    size: "",
    step: "",
    min: "",
    max: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
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
      .size=${args.size}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
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
