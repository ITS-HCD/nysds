import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-toggle";
import "@nysds/nys-label";

const meta: Meta = {
  title: "Components/Toggle",
  component: "nys-toggle",
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
      <nys-toggle
        label="Enable notifications"
        name="notifications"
        value="enabled-notifications"
      ></nys-toggle>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle
  label="Enable notifications"
  name="notifications"
  value="enabled-notifications"
></nys-toggle>`,
        type: "auto",
      },
    },
  },
};

export const Checked: Story = {
  render: () => {
    return html`
      <nys-toggle
        label="Dark Mode"
        name="theme"
        value="dark"
        checked
      ></nys-toggle>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle label="Dark Mode" name="theme" value="dark" checked></nys-toggle>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-toggle
        label="Opt Out of emails"
        name="toggle-switch"
        value="emails"
        disabled
      ></nys-toggle>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle label="Opt Out of emails" name="toggle-switch" value="emails" disabled></nys-toggle>`,
        type: "auto",
      },
    },
  },
};

export const HideIcon: Story = {
  render: () => {
    return html`
      <nys-toggle
        label="No icon on the toggle knob"
        name="icon"
        value="no-icon"
        noIcon
      ></nys-toggle>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle label="No icon on the toggle knob" name="icon" value="no-icon" noIcon></nys-toggle>`,
        type: "auto",
      },
    },
  },
};

export const SizeSmall: Story = {
  render: () => {
    return html`
      <nys-toggle
        label="Tiny but mighty"
        name="sm-size"
        value="sm-size"
        size="sm"
      ></nys-toggle>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle label="Tiny but mighty" name="sm-size" value="sm-size" size="sm"></nys-toggle>`,
        type: "auto",
      },
    },
  },
};

export const Description: Story = {
  render: () => {
    return html`
      <nys-toggle
        label="Opt Out of emails"
        description="An email address is recommended to be on file for contact information."
        name="toggle-switch"
        value="emails"
      ></nys-toggle>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle
  label="Opt Out of emails"
  description="An email address is recommended to be on file for contact information."
  name="toggle-switch"
  value="emails"
></nys-toggle>`,
        type: "auto",
      },
    },
  },
};

export const RichDescription: Story = {
  render: () => {
    return html`
      <nys-toggle label="Opt Out of emails" name="toggle-switch" value="emails">
        <p slot="description">
          We
          <strong>REALLY</strong>
          encourage you to keep emails enabled for contact purposes.
        </p>
      </nys-toggle>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle label="Opt Out of emails" name="toggle-switch" value="emails">
  <p slot="description">
    We
    <strong>REALLY</strong>
    encourage you to keep emails enabled for contact purposes.
  </p>
</nys-toggle>`,
        type: "auto",
      },
    },
  },
};
