import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-datepicker";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysDatepickerArgs {
  id: string;
  name: string;
  value: string;
  disabled: boolean;
  required: boolean;
  optional: boolean;
  showError: boolean;
  errorMessage: string;
  form: string | null;

  type: string;
  label: string;
  description: string;
  placeholder: string;
  min: string;
  max: string;
}

const meta: Meta<NysDatepickerArgs> = {
  title: "Components/Datepicker",
  component: "nys-datepicker",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    showError: { control: "boolean" },
    errorMessage: { control: "text" },
    form: { control: "text" },

    type: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    placeholder: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysDatepickerArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "datepicker1",
    name: "datepicker1",
    value: "",
    disabled: false,
    required: false,
    optional: false,
    showError: false,
    errorMessage: "",
    form: null,
    type: "date",
    label: "Date of birth",
    description: "Enter in MM/DD/YYYY format",
    placeholder: "",
    min: "",
    max: "",
  },
  render: (args) => html`
    <style>
      .datepicker-container {
        padding: 5rem 0;
      }
    </style>

    <div class="datepicker-container">
      <nys-datepicker
        id=${args.id}
        name=${args.name}
        .value=${args.value}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?optional=${args.optional}
        ?showError=${args.showError}
        errorMessage=${args.errorMessage}
        form=${args.form ?? ""}
        type=${args.type}
        label=${args.label}
        description=${args.description}
        placeholder=${args.placeholder}
        min=${args.min}
        max=${args.max}
      ></nys-datepicker>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  id="datepicker1"
  name="datepicker1"
  type="date"
  label="Date of birth"
  description="Enter in MM/DD/YYYY format"
></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};
