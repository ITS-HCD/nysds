import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-button";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysButtonArgs {
  id: string;
  name: string;
  size: "sm" | "md" | "lg";
  fullWidth: boolean;
  variant: "text" | "filled" | "outline" | "ghost";
  inverted: boolean;
  label: string;
  prefixIcon: string;
  suffixIcon: string;
  circle: boolean;
  icon: string;
  disabled: boolean;
  form: string | null;
  value: string;
  type: "submit" | "reset" | "button";
  href: string;
  target: "_self" | "_blank" | "_parent" | "_top" | "framename";
  ariaLabel: string;
  ariaDescription: string;
  onClick: () => void;
}

const meta: Meta<NysButtonArgs> = {
  title: "Components/Button",
  component: "nys-button",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    fullWidth: { control: "boolean" },
    variant: {
      control: "select",
      options: ["filled", "outline", "ghost", "text"],
    },
    inverted: { control: "boolean" },
    label: { control: "text" },
    prefixIcon: { control: "text" },
    suffixIcon: { control: "text" },
    circle: { control: "boolean" },
    icon: { control: "text" },
    disabled: { control: "boolean" },
    form: { control: "text" },
    value: { control: "text" },
    href: { control: "text" },
    target: {
      control: "select",
      options: ["_self", "_blank", "_parent", "_top", "framename"],
    },
    ariaLabel: { control: "text" },
    ariaDescription: { control: "text" },
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
    id: "button1",
    name: "button1",
    label: "Click Me",
    ariaLabel: "click me",
    inverted: false,
    circle: false,
    disabled: false,
    fullWidth: false,
  },
  render: (args) => html`
    <nys-button
      .id=${args.id}
      .name=${args.name}
      .size=${args.size}
      .fullWidth=${args.fullWidth}
      .variant=${args.variant}
      .inverted=${args.inverted}
      .label=${args.label}
      .prefixIcon=${args.prefixIcon}
      .suffixIcon=${args.suffixIcon}
      .circle=${args.circle}
      .icon=${args.icon}
      .disabled=${args.disabled}
      .form=${args.form}
      .value=${args.value}
      .href=${args.href}
      .target=${args.target}
      .type=${args.type}
      .ariaLabel=${args.ariaLabel}
      .ariaDescription=${args.ariaDescription}
      @nys-click=${() => alert("Button clicked")}
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
  onClick="doClickFunction()"
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
      style="display: flex; flex-direction: column; gap: var(--nys-space-200, 16px);"
    >
      <div
        style="display: flex; align-items:center; justify-content:center; gap: var(--nys-space-200, 16px);"
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
          .target=${args.target}
          .type=${args.type}
          .ariaLabel=${args.ariaLabel}
          .ariaDescription=${args.ariaDescription}
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
          .target=${args.target}
          .type=${args.type}
          .ariaLabel=${args.ariaLabel}
          .ariaDescription=${args.ariaDescription}
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
          .target=${args.target}
          .type=${args.type}
          .ariaLabel=${args.ariaLabel}
          .ariaDescription=${args.ariaDescription}
        ></nys-button>
      </div>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        size="sm"
        .fullWidth=${true}
        .variant=${args.variant}
        .inverted=${args.inverted}
        label="Small Full"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        size="md"
        .fullWidth=${true}
        .variant=${args.variant}
        .inverted=${args.inverted}
        label="Medium Full"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
      ></nys-button>
      <nys-button
        .id=${args.id}
        .name=${args.name}
        size="lg"
        .fullWidth=${true}
        .variant=${args.variant}
        .inverted=${args.inverted}
        label="Large Full"
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
      ></nys-button>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-button
  id="button1"
  name="button1"
  label="Small"
  size="sm"
></nys-button>
<nys-button
  id="button2"
  name="button2"
  label="Medium"
></nys-button>
<nys-button
  id="button3"
  name="button3"
  label="Large"
  size="lg"
></nys-button>
<nys-button
  id="button4"
  name="button4"
  label="Small Full"
  size="sm"
  fullWidth
></nys-button>
<nys-button
  id="button5"
  name="button5"
  label="Medium Full"
  fullWidth
></nys-button>
<nys-button
  id="button6"
  name="button6"
  label="Large Full"
  size="lg"
  fullWidth
></nys-button>`,
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
      ></nys-button>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-button
  id="button1"
  name="button1"
  label="Filled"
></nys-button>
<nys-button
  id="button2"
  name="button2"
  label="Outline"
  variant="outline"
></nys-button>
<nys-button
  id="button3"
  name="button3"
  label="Ghost"
  variant="ghost"
></nys-button>
<nys-button
  id="button4"
  name="button4"
  label="Text"
  variant="text"
></nys-button>
        `,
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
    ariaLabel: "click me",
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
      .target=${args.target}
      .type=${args.type}
      .ariaLabel=${args.ariaLabel}
      .ariaDescription=${args.ariaDescription}
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
  ariaLabel="click me"
  prefixIcon="chevron_left"
  suffixIcon="chevron_right"
></nys-button>`,

        type: "auto",
      },
    },
  },
};

export const Circle: Story = {
  args: {
    circle: true,
    icon: "close",
  },

  render: (args) => html`
    <nys-button
      .id=${args.id}
      .name=${args.name}
      .size=${args.size}
      .variant=${args.variant}
      .inverted=${args.inverted}
      .label=${args.label}
      .circle=${args.circle}
      .icon=${args.icon}
      .disabled=${args.disabled}
      .form=${args.form}
      .value=${args.value}
      .href=${args.href}
      .target=${args.target}
      .type=${args.type}
      .ariaLabel=${args.ariaLabel}
      .ariaDescription=${args.ariaDescription}
    ></nys-button>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-button circle icon="close"></nys-button>`,
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
      ></nys-button>
    </div>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-button
  id="button1"
  name="button1"
  label="Filled"
  disabled
></nys-button>
<nys-button
  id="button2"
  name="button2"
  label="Outline"
  variant="outline"
  disabled
></nys-button>
<nys-button
  id="button3"
  name="button3"
  label="Ghost"
  variant="ghost"
  disabled
></nys-button>
<nys-button
  id="button4"
  name="button4"
  label="Text"
  variant="text"
  disabled
></nys-button>
      `,
        type: "auto",
      },
    },
  },
};

export const Link: Story = {
  args: {
    label: "Visit NY.gov",
    href: "https://www.ny.gov/",
    target: "_blank",
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
        label=${args.label}
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .disabled=${args.disabled}
        .form=${args.form}
        .value=${args.value}
        .href=${args.href}
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
      ></nys-button>
    </div>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-button
  id="button1"
  name="button1"
  label="Visit NY.gov"
  href="https://www.ny.gov/"
  target="_blank"
></nys-button>`,
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
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
        .target=${args.target}
        .type=${args.type}
        .ariaLabel=${args.ariaLabel}
        .ariaDescription=${args.ariaDescription}
      ></nys-button>
    </div>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-button
  id="button1"
  name="button1"
  label="Filled"
  inverted
></nys-button>
<nys-button
  id="button2"
  name="button2"
  label="Outline"
  variant="outline"
  inverted
></nys-button>
<nys-button
  id="button3"
  name="button3"
  label="Ghost"
  variant="ghost"
  inverted
></nys-button>
<nys-button
  id="button4"
  name="button4"
  label="Text"
  variant="text"
  inverted
></nys-button>
`,
        type: "auto",
      },
    },
  },
};
