import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-badge";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Badge",
  component: "nys-badge",
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
  args: {
    name: "",
    size: "md",
    intent: "base",
    prefixLabel: "",
    label: "Basic badge",
    srText: "",
    strong: false,
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md"] },
    intent: {
      control: { type: "select" },
      options: ["base", "error", "info", "success", "warning"],
    },
  },
  render: (args) => {
    return html`
      <nys-badge
        name=${args.name}
        size=${args.size}
        intent=${args.intent}
        prefixLabel=${args.prefixLabel}
        label=${args.label}
        srText=${args.srText}
        ?strong=${args.strong}
      ></nys-badge>
    `;
  },
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

export const InfoIntent: Story = {
  render: () => {
    return html`
      <nys-badge label="Info" intent="info" prefixIcon></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge label="Info" intent="info" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const SuccessIntent: Story = {
  render: () => {
    return html`
      <nys-badge label="Success" intent="success" prefixIcon></nys-badge>
    `;
  },
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

export const WarningIntent: Story = {
  render: () => {
    return html`
      <nys-badge label="Warning" intent="warning" prefixIcon></nys-badge>
    `;
  },
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

export const ErrorIntent: Story = {
  render: () => {
    return html`
      <nys-badge label="Error" intent="error" prefixIcon></nys-badge>
    `;
  },
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

export const StrongBase: Story = {
  render: () => {
    return html` <nys-badge strong label="Base" prefixIcon></nys-badge> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge strong label="Base" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const StrongInfo: Story = {
  render: () => {
    return html`
      <nys-badge strong label="Info" intent="info" prefixIcon></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge strong label="Info" intent="info" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const StrongSuccess: Story = {
  render: () => {
    return html`
      <nys-badge strong label="Success" intent="success" prefixIcon></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge strong label="Success" intent="success" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const StrongWarning: Story = {
  render: () => {
    return html`
      <nys-badge strong label="Warning" intent="warning" prefixIcon></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge strong label="Warning" intent="warning" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const StrongError: Story = {
  render: () => {
    return html`
      <nys-badge strong label="Error" intent="error" prefixIcon></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge strong label="Error" intent="error" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const CustomPrefixIcon: Story = {
  render: () => {
    return html`
      <nys-badge label="Custom prefixIcon" prefixIcon="check"></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge label="Custom prefixIcon" prefixIcon="check"></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const CustomSuffixIcon: Story = {
  render: () => {
    return html`
      <nys-badge label="Custom suffixIcon" suffixIcon="check"></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge label="Custom suffixIcon" suffixIcon="check"></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const SizeSmall: Story = {
  render: () => {
    return html` <nys-badge label="Small" size="sm"></nys-badge> `;
  },
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
  render: () => {
    return html`
      <nys-badge
        intent="warning"
        label="Caution"
        prefixIcon
        srText="concern"
      ></nys-badge>
    `;
  },
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
