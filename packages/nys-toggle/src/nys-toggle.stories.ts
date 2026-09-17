import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-toggle";
import "@nysds/nys-icon";
import "@nysds/nys-label";

const meta: Meta = {
  title: "Components/Toggle",
  component: "nys-toggle",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'A toggle switch for binary settings with immediate effect. Form-associated via ElementInternals.\n\nUse when changing a setting takes effect immediately (e.g., dark mode, notifications).\nFor binary choices in forms that submit later, use `nys-checkbox` instead.\n\nA toggle has no validation surface: it exposes no `required`, `showError`,\nor `errorMessage` and never reports invalid state. Framework adapters (for\nexample an Angular ControlValueAccessor) must not try to sync errors to it.\n\nSetting `checked` programmatically updates the form value but does not fire\n`nys-change`; the event fires only on user interaction.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysToggle label="Enable notifications" name="notifications" value="enabled-notifications" />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-toggle label="Enable notifications" name="notifications" value="enabled-notifications"></nys-toggle>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    name: "notifications",
    value: "enabled-notifications",
    label: "Enable notifications",
    description: "",
    checked: false,
    disabled: false,
    noIcon: false,
    inverted: false,
    size: "md",
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md"] },
  },
  render: (args) => {
    return html`
      <nys-toggle
        name=${args.name}
        value=${args.value}
        label=${args.label}
        description=${args.description}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        ?noIcon=${args.noIcon}
        ?inverted=${args.inverted}
        size=${args.size}
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

export const DescriptionSlot: Story = {
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
