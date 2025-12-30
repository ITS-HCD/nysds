import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-datepicker";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-icon";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysDatepickerArgs {
  id: string;
  name: string;
  value?: Date | string | undefined;
  disabled: boolean;
  required: boolean;
  optional: boolean;
  showError: boolean;
  errorMessage: string;
  form: string | null;

  type: string;
  label: string;
  description: string;
  startDate: string;
  hideTodayButton: boolean;
  hideClearButton: boolean;
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
    startDate: { control: "text" },
    hideTodayButton: { control: "boolean" },
    hideClearButton: { control: "boolean" },
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
    value: undefined,
    disabled: false,
    required: false,
    optional: false,
    showError: false,
    errorMessage: "",
    form: null,
    type: "date",
    label: "Date of birth",
    description: "Enter in MM/DD/YYYY format",
    startDate: "",
    hideTodayButton: false,
    hideClearButton: false,
  },
  render: (args) => html`
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
        startDate=${args.startDate}
        ?hideTodayButton=${args.hideTodayButton}
        ?hideClearButton=${args.hideClearButton}
      ></nys-datepicker>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  id="myDatepicker"
  name="myDatepicker"
  type="date"
  label="Date of birth"
  description="Enter in MM/DD/YYYY format"
></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const WithCustomStartDate: Story = {
  args: {
    ...Basic.args,
    id: "datepicker-startdate",
    name: "datepicker-startdate",
    label: "Project start date",
    description: "Calendar opens to a predefined month",
    startDate: "2024-01-01",
  },
  render: Basic.render,
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  label="Project start date"
  startDate="2024-01-01"
></nys-datepicker>`,
      },
    },
  },
};

export const WithoutTodayAndClearButtons: Story = {
  args: {
    ...Basic.args,
    id: "datepicker-no-actions",
    name: "datepicker-no-actions",
    label: "Select a date",
    description: "Today and Clear buttons are hidden",
    hideTodayButton: true,
    hideClearButton: true,
  },
  render: Basic.render,
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  label="Select a date"
  hideTodayButton
  hideClearButton
></nys-datepicker>`,
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    id: "datepicker-disabled",
    name: "datepicker-disabled",
    label: "Disabled datepicker",
    description: "This field is not editable",
    disabled: true,
    value: "2025-01-15",
  },
  render: Basic.render,
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  label="Disabled datepicker"
  disabled
  value="2025-01-15"
></nys-datepicker>`,
      },
    },
  },
};