import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-datepicker";
import "@nysds/nys-button";
import "@nysds/nys-errormessage";
import "@nysds/nys-icon";
import "@nysds/nys-label";

const meta: Meta = {
  title: "Components/Datepicker",
  component: "nys-datepicker",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'Date picker with calendar popup and form validation. Falls back to native date input\non Safari and mobile.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysDatepicker id="my-datepicker" name="my-datepicker" label="Schedule an appointment" description="Enter in MM/DD/YYYY format" />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-datepicker id="my-datepicker" name="my-datepicker" label="Schedule an appointment" description="Enter in MM/DD/YYYY format"></nys-datepicker>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    name: "my-datepicker",
    width: "full",
    hideTodayButton: false,
    hideClearButton: false,
    disabled: false,
    required: false,
    optional: false,
    showError: false,
    errorMessage: "",
    tooltip: "",
    type: "date",
    label: "Schedule an appointment",
    description: "Enter in MM/DD/YYYY format",
    startDate: "",
    minDate: "",
    maxDate: "",
    inverted: false,
  },
  argTypes: {
    width: { control: { type: "select" }, options: ["md", "lg", "full"] },
  },
  render: (args) => {
    return html`
      <nys-datepicker
        id="my-datepicker"
        name=${args.name}
        width=${args.width}
        ?hideTodayButton=${args.hideTodayButton}
        ?hideClearButton=${args.hideClearButton}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?optional=${args.optional}
        ?showError=${args.showError}
        errorMessage=${args.errorMessage}
        tooltip=${args.tooltip}
        type=${args.type}
        label=${args.label}
        description=${args.description}
        startDate=${args.startDate}
        minDate=${args.minDate}
        maxDate=${args.maxDate}
        ?inverted=${args.inverted}
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
