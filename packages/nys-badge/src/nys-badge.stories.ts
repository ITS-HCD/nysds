import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-badge";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysBadgeArgs {
  id: string;
  name: string;
  size: string;
  intent: string;
  prefix: string;
  label: string;
  prefixIcon: string;
  suffixIcon: string;
}

const meta: Meta<NysBadgeArgs> = {
  title: "Components/Badge",
  component: "nys-badge",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    size: {
      control: "select",
      options: ["sm", "md"],
      description: "Size of the badge",
    },
    intent: {
      control: "select",
      options: ["neutral", "error", "success", "warning"],
      description: "Intent of the badge",
    },
    prefix: { control: "text", description: "Prefix text" },
    prefixIcon: {
      control: "text",
      description: "Icon to display before the label",
    },
    suffixIcon: {
      control: "text",
      description: "Icon to display after the label",
    },
    label: { control: "text", description: "Label text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysBadgeArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    label: "Basic badge",
  },
  render: (args) => html`
    <nys-badge
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .size=${args.size}
      .intent=${args.intent}
      .prefixLabel=${args.prefix}
      .prefixIcon=${args.prefixIcon}
      .suffixIcon=${args.suffixIcon}
    ></nys-badge>
  `,
  parameters: {
    docs: {
      source: {
        type: "auto",
        code: `<nys-badge label="Basic badge"></nys-badge>`,
      },
    },
  },
};

export const Intent: Story = {
  render: () => html`
    <div class="nys-grid-row nys-grid-gap-1">
      <nys-badge label="Neutral" prefixIcon></nys-badge>
      <nys-badge label="Error" intent="error" prefixIcon></nys-badge>
      <nys-badge label="Warning" intent="warning" prefixIcon></nys-badge>
      <nys-badge label="Success" intent="success" prefixIcon></nys-badge>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        type: "auto",
        code: `
<div class="nys-grid-row nys-grid-gap-1">
  <nys-badge label="Neutral" prefixIcon></nys-badge>
  <nys-badge label="Error" intent="error" prefixIcon></nys-badge>
  <nys-badge label="Warning" intent="warning" prefixIcon></nys-badge>
  <nys-badge label="Success" intent="success" prefixIcon></nys-badge>
</div>
`,
      },
    },
  },
};

export const Icons: Story = {
  render: () => html`
    <div class="nys-grid-row nys-grid-gap-1">
      <nys-badge label="Default neutral" prefixIcon></nys-badge>
      <nys-badge label="Default neutral" suffixIcon></nys-badge>
      <nys-badge label="Custom neutral" prefixIcon="check"></nys-badge>
      <nys-badge label="Custom neutral" suffixIcon="check"></nys-badge>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        type: "auto",
        code: `
<div class="nys-grid-row nys-grid-gap-1">
  <nys-badge label="Default neutral" prefixIcon></nys-badge>
  <nys-badge label="Default neutral" suffixIcon></nys-badge>
  <nys-badge label="Custom neutral" prefixIcon="check"></nys-badge>
  <nys-badge label="Custom neutral" suffixIcon="check"></nys-badge>
</div>
`,
      },
    },
  },
};

export const Size: Story = {
  render: () => html`
    <div class="nys-grid-row nys-grid-gap-1">
      <nys-badge label="Medium"></nys-badge>
      <nys-badge label="Small" size="sm"></nys-badge>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        type: "auto",
        code: `
<div class="nys-grid-row nys-grid-gap-1">
  <nys-badge label="Medium"></nys-badge>
  <nys-badge label="Small" size="sm"></nys-badge>
</div>
`,
      },
    },
  },
};

export const PrefixLabel: Story = {
  render: () => html`
    <div class="nys-grid-row nys-grid-gap-1">
      <nys-badge label="Stable" prefixIcon="code"></nys-badge>
      <nys-badge
        prefixIcon
        prefixLabel="WCAG 2.2"
        label="AA"
        intent="success"
      ></nys-badge>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        type: "auto",
        code: `
<div class="nys-grid-row nys-grid-gap-1">
  <nys-badge label="Stable" prefixIcon="code"></nys-badge>
  <nys-badge prefixLabel="WCAG 2.2" label="AA" intent="success" prefixIcon></nys-badge>
</div>
`,
      },
    },
  },
};
