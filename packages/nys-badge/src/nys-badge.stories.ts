import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-badge";

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
  render: () => {
    return html` <nys-badge label="Basic badge"></nys-badge> `;
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

export const StrongNeutral: Story = {
  render: () => {
    return html`
      <nys-badge variant="strong" label="Neutral" prefixIcon></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge variant="strong" label="Neutral" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const StrongError: Story = {
  render: () => {
    return html`
      <nys-badge
        variant="strong"
        label="Error"
        intent="error"
        prefixIcon
      ></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge variant="strong" label="Error" intent="error" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const StrongWarning: Story = {
  render: () => {
    return html`
      <nys-badge
        variant="strong"
        label="Warning"
        intent="warning"
        prefixIcon
      ></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge variant="strong" label="Warning" intent="warning" prefixIcon></nys-badge>`,
        type: "auto",
      },
    },
  },
};

export const StrongSuccess: Story = {
  render: () => {
    return html`
      <nys-badge
        variant="strong"
        label="Success"
        intent="success"
        prefixIcon
      ></nys-badge>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-badge variant="strong" label="Success" intent="success" prefixIcon></nys-badge>`,
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
