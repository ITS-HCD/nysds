import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-badge";

// Define the structure of the args used in the stories
interface NysBadgeArgs {
  id: string;
  name: string;
  size: "sm" | "md";
  intent: "neutral" | "error" | "success" | "warning";
  prefixLabel: string;
  label: string;
  srText: string;
  variant: "strong" | "";
  prefixicon: string | boolean;
  suffixicon: string | boolean;
  prefixIcon: string;
  suffixIcon: string;
}

const meta: Meta<NysBadgeArgs> = {
  title: "Components/Badge",
  component: "nys-badge",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    size: { control: "select", options: ["sm", "md"] },
    intent: {
      control: "select",
      options: ["neutral", "error", "success", "warning"],
    },
    prefixLabel: { control: "text" },
    label: { control: "text" },
    srText: { control: "text" },
    variant: { control: "select", options: ["strong"] },
    prefixicon: { control: "text" },
    suffixicon: { control: "text" },
    prefixIcon: { control: "text" },
    suffixIcon: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysBadgeArgs>;

export const Basic: Story = {
  args: {
    label: "Basic badge",
  },
  render: (args) => html`
    <nys-badge
      .id=${args.id}
      .name=${args.name}
      .size=${args.size}
      .intent=${args.intent}
      .prefixLabel=${args.prefixLabel}
      .label=${args.label}
      .srText=${args.srText}
      .variant=${args.variant}
      .prefixicon=${args.prefixicon}
      .suffixicon=${args.suffixicon}
      .prefixIcon=${args.prefixIcon}
      .suffixIcon=${args.suffixIcon}
    ></nys-badge>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge label="Basic badge"></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const ErrorIntent: Story = {
  render: () => html`
    <nys-badge label="Error" intent="error" prefixIcon></nys-badge>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge label="Error" intent="error" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const WarningIntent: Story = {
  render: () => html`
    <nys-badge label="Warning" intent="warning" prefixIcon></nys-badge>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge label="Warning" intent="warning" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const SuccessIntent: Story = {
  render: () => html`
    <nys-badge label="Success" intent="success" prefixIcon></nys-badge>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge label="Success" intent="success" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const StrongVariant: Story = {
  render: () => html`
    <div class="nys-display-flex nys-flex-gap-100">
      <nys-badge variant="strong" label="Neutral" prefixIcon></nys-badge>
      <nys-badge
        variant="strong"
        label="Error"
        intent="error"
        prefixIcon
      ></nys-badge>
      <nys-badge
        variant="strong"
        label="Warning"
        intent="warning"
        prefixIcon
      ></nys-badge>
      <nys-badge
        variant="strong"
        label="Success"
        intent="success"
        prefixIcon
      ></nys-badge>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge variant="strong" label="Neutral" prefixIcon></nys-badge>
<nys-badge variant="strong" label="Error" intent="error" prefixIcon></nys-badge>
<nys-badge variant="strong" label="Warning" intent="warning" prefixIcon></nys-badge>
<nys-badge variant="strong" label="Success" intent="success" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const CustomIcons: Story = {
  render: () => html`
    <div class="nys-display-flex nys-flex-gap-100">
      <nys-badge label="Custom prefixIcon" prefixIcon="check"></nys-badge>
      <nys-badge label="Custom suffixIcon" suffixIcon="check"></nys-badge>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge label="Custom prefixIcon" prefixIcon="check"></nys-badge>
<nys-badge label="Custom suffixIcon" suffixIcon="check"></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const Size: Story = {
  render: () => html` <nys-badge label="Small" size="sm"></nys-badge> `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge label="Small" size="sm"></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const ScreenReaderText: Story = {
  render: () => html`
    <nys-badge
      intent="warning"
      label="Caution"
      prefixIcon
      srText="concern"
    ></nys-badge>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge intent="warning" label="Caution" prefixIcon srText="concern"></nys-badge>`,
        type: "auto",
      },
    },
  },
};
