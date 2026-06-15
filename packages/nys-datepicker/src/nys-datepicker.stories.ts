import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-datepicker";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

// Define the structure of the args used in the stories
interface NysDatepickerArgs {
  id: string;
  name: string;
  width: "md" | "lg" | "full";
  errorMessage: string;
  form: string | null;
  tooltip: string;
  type: string;
  label: string;
  description: string;
  startDate: string;
  minDate: string;
  maxDate: string;
  value: string | Date | undefined;
  hideTodayButton: boolean;
  hideClearButton: boolean;
  disabled: boolean;
  required: boolean;
  optional: boolean;
  showError: boolean;
  inverted: boolean;
}

const meta: Meta<NysDatepickerArgs> = {
  title: "Components/Datepicker",
  component: "nys-datepicker",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    width: { control: "select", options: ["md", "lg", "full"] },
    errorMessage: { control: "text" },
    form: { control: "text" },
    tooltip: { control: "text" },
    type: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    startDate: { control: "text" },
    minDate: { control: "text" },
    maxDate: { control: "text" },
    value: { control: "text" },
    hideTodayButton: { control: "boolean", default: false },
    hideClearButton: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
    required: { control: "boolean", default: false },
    optional: { control: "boolean", default: false },
    showError: { control: "boolean", default: false },
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
type Story = StoryObj<NysDatepickerArgs>;

export const Basic: Story = {
  args: {
    name: "my-datepicker",
    label: "Schedule an appointment",
    description: "Enter in MM/DD/YYYY format",
  },
  render: (args) => {
    return html`
      <nys-datepicker
        .id=${args.id}
        ?hideTodayButton=${args["hideTodayButton"]}
        ?hideClearButton=${args["hideClearButton"]}
        ?disabled=${args["disabled"]}
        ?required=${args["required"]}
        ?optional=${args["optional"]}
        ?showError=${args["showError"]}
        ?inverted=${args["inverted"]}
        .name=${args["name"]}
        .width=${args["width"]}
        .errorMessage=${args["errorMessage"]}
        .form=${args["form"]}
        .tooltip=${args["tooltip"]}
        .type=${args["type"]}
        .label=${args["label"]}
        .description=${args["description"]}
        .startDate=${args["startDate"]}
        .minDate=${args["minDate"]}
        .maxDate=${args["maxDate"]}
        .value=${args["value"]}
      ></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  id="my-datepicker"
  name="my-datepicker"
  label="Schedule an appointment"
  description="Enter in MM/DD/YYYY format"
></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const WidthLarge: Story = {
  render: () => {
    return html`
      <nys-datepicker
        label="Event Date"
        description="Select the date of your event"
        width="lg"
      ></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  label="Event Date"
  description="Select the date of your event"
  width="lg"
></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const WidthFull: Story = {
  render: () => {
    return html`
      <nys-datepicker
        label="Event Date"
        description="Select the date of your event"
        width="full"
      ></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  label="Event Date"
  description="Select the date of your event"
  width="full"
></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const CustomStartDate: Story = {
  render: () => {
    return html`
      <nys-datepicker
        label="Appointment"
        startDate="2024-01-01"
      ></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker label="Appointment" startDate="2024-01-01"></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const WithoutButtons: Story = {
  render: () => {
    return html`
      <nys-datepicker
        label="Appointment"
        hideTodayButton
        hideClearButton
      ></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker label="Appointment" hideTodayButton hideClearButton></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  render: () => {
    return html`
      <nys-datepicker
        label="Start Date"
        showError
        errorMessage="Please select a valid start date"
      ></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  label="Start Date"
  showError
  errorMessage="Please select a valid start date"
></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const DateRange: Story = {
  render: () => {
    return html`
      <nys-datepicker
        label="Select a date"
        description="Only dates within April 4/5/2026 - 7/15/2026 are selectable"
        minDate="2026-04-05"
        maxDate="2026-07-15"
      ></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  label="Select a date"
  description="Only dates within April 4/5/2026 - 7/15/2026 are selectable"
  minDate="2026-04-05"
  maxDate="2026-07-15"
></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-datepicker
        label="Disabled datepicker"
        disabled
        value="2025-01-15"
      ></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker label="Disabled datepicker" disabled value="2025-01-15"></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  render: () => {
    return html`
      <div style="background: #1b1b1b; padding: 1rem">
        <nys-datepicker label="Start Date" inverted></nys-datepicker>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker label="Start Date" inverted></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-datepicker label="Start Date" required></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker label="Start Date" required></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html`
      <nys-datepicker label="Start Date" optional></nys-datepicker>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker label="Start Date" optional></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};
