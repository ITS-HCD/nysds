import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import { action } from "@storybook/addon-actions";
import "./nys-button";

// Define the structure of the args used in the stories
interface NysButtonArgs {
  id: string;
  name: string;
  size: string;
  variant: string;
  inverted: boolean;
  label: string;
  prefixIcon: string;
  suffixIcon: string;
  disabled: boolean;
  form: string;
  value: string;
  type: string;
  href: string;
  onClick: () => void;
}

const meta: Meta<NysButtonArgs> = {
  title: "Components/Button",
  component: "nys-button",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["filled", "outline", "ghost", "text"],
    },
    inverted: { control: "boolean" },
    label: { control: "text" },
    prefixIcon: { control: "text" },
    suffixIcon: { control: "text" },
    disabled: { control: "boolean" },
    form: { control: "text" },
    value: { control: "text" },
    href: { control: "text" },
    type: { control: "select", options: ["submit", "reset", "button"] },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysButtonArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    label: "Click Me",
    href: "https://www.ny.gov/",
  },
  render: (args) => html`
    <nys-button
      .id=${args.id}
      .name=${args.name}
      .size=${args.size}
      .variant=${args.variant}
      .inverted=${args.inverted}
      .label=${args.label}
      .prefixIcon=${args.prefixIcon}
      .suffixIcon=${args.suffixIcon}
      .disabled=${args.disabled}
      .form=${args.form}
      .value=${args.value}
      .href=${args.href}
      .type=${args.type}
      .onClick=${action("on-click")}
    ></nys-button>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-button
  id="button1"
  name="button1"
  label="Click Me"
></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const Size: Story = {
  args: {},
  render: (args) => html`
    <div
      style="display: flex; align-items:center; gap: var(--nys-space-200, 16px);"
    >
      <nys-button
        .id=${args.id}
        .name=${args.name}
        size="sm"
        .variant=${args.variant}
        .inverted=${args.inverted}
        label="Small"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        size="md"
        .variant=${args.variant}
        .inverted=${args.inverted}
        label="Medium"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        size="lg"
        .variant=${args.variant}
        .inverted=${args.inverted}
        label="Large"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};

export const Variants: Story = {
  args: {},
  render: (args) => html`
    <div
      style="display: flex; align-items:center; gap: var(--nys-space-200, 16px);"
    >
      <nys-button
        .id=${args.id}
        .name="${args.name}"
        .size=${args.size}
        .inverted=${args.inverted}
        label="Filled"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="outline"
        .inverted=${args.inverted}
        label="Outline"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="ghost"
        .inverted=${args.inverted}
        label="Ghost"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="text"
        .inverted=${args.inverted}
        label="Text"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};

export const Icons: Story = {
  args: {
    label: "Click Me",
    prefixIcon: "chevron_left",
    suffixIcon: "chevron_right",
  },

  render: (args) => html`
    <nys-button
      .id=${args.id}
      .name=${args.name}
      .size=${args.size}
      .variant=${args.variant}
      .inverted=${args.inverted}
      .label=${args.label}
      .prefixIcon=${args.prefixIcon}
      .suffixIcon=${args.suffixIcon}
      .disabled=${args.disabled}
      .form=${args.form}
      .value=${args.value}
      .href=${args.href}
      .type=${args.type}
      .onClick=${action("on-click")}
    ></nys-button>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-button
  id="button1"
  name="button1"
  label="Click Me"
></nys-button>`,

        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },

  render: (args) => html`
    <div
      style="display: flex; align-items:center; gap: var(--nys-space-200, 16px);"
    >
      <nys-button
        .id=${args.id}
        .name="${args.name}"
        .size=${args.size}
        .inverted=${args.inverted}
        label="Filled"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="outline"
        .inverted=${args.inverted}
        label="Outline"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="ghost"
        .inverted=${args.inverted}
        label="Ghost"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="text"
        .inverted=${args.inverted}
        label="Text"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
    </div>
  `,

  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};

export const Link: Story = {
  args: {
    href: "https://www.ny.gov/",
  },

  render: (args) => html`
    <div
      style="display: flex; align-items:center; gap: var(--nys-space-200, 16px);"
    >
      <nys-button
        .id=${args.id}
        .name="${args.name}"
        .size=${args.size}
        .inverted=${args.inverted}
        label="Filled"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="outline"
        .inverted=${args.inverted}
        label="Outline"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="ghost"
        .inverted=${args.inverted}
        label="Ghost"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="text"
        .inverted=${args.inverted}
        label="Text"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
    </div>
  `,

  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  args: {
    inverted: true,
  },

  render: (args) => html`
    <div
      style="display: flex; align-items:center; gap: var(--nys-space-200, 16px); background-color: var(--nys-color-ink, #1b1b1b); padding: var(--nys-space-200, 16px);"
    >
      <nys-button
        .id=${args.id}
        .name="${args.name}"
        .size=${args.size}
        .inverted=${args.inverted}
        label="Filled"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="outline"
        .inverted=${args.inverted}
        label="Outline"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="ghost"
        .inverted=${args.inverted}
        label="Ghost"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        .size=${args.size}
        variant="text"
        .inverted=${args.inverted}
        label="Text"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .type=${args.type}
        .onClick=${action("on-click")}
      ></nys-button>
    </div>
  `,

  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};
