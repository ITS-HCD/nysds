import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-datepicker";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

const meta: Meta = {
  title: "Components/Datepicker",
  component: "nys-datepicker",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => {
    return html`
      <nys-datepicker
        id="my-datepicker"
        name="my-datepicker"
        label="Schedule an appointment"
        description="Enter in MM/DD/YYYY format"
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
