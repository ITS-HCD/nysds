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
  width: string;
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
    width: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      defaultValue: { summary: "md" },
    },
    showError: { control: "boolean" },
    errorMessage: { control: "text" },
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
      .width=${args.width}
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
