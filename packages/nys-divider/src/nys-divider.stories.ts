import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-divider";

const meta: Meta = {
  title: "Components/Divider",
  component: "nys-divider",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'A horizontal rule for visual separation between content sections. The host\nelement carries `role="separator"` via ElementInternals.\n\nUse to separate distinct content areas within a page. Set `inverted` for use on dark backgrounds.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<p>Section one content</p>\n<NysDivider />\n<p>Section two content</p>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<p>Section one content</p>\n<nys-divider></nys-divider>\n<p>Section two content</p>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    inverted: false,
    subtle: false,
  },
  render: (args) => {
    return html`
      <p>Section one content</p>
      <nys-divider
        ?inverted=${args.inverted}
        ?subtle=${args.subtle}
      ></nys-divider>
      <p>Section two content</p>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<p>Section one content</p>
<nys-divider></nys-divider>
<p>Section two content</p>`,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  render: () => {
    return html`
      <div
        style="
          display: flex;
          flex-direction: column;
          background-color: var(--nys-color-ink, #1b1b1b);
          color: var(--nys-color-ink-reverse, #fff);
          padding: var(--nys-space-200, 16px);
        "
      >
        <p>Section one content</p>
        <nys-divider inverted></nys-divider>
        <p>Section two content</p>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<p>Section one content</p>
<nys-divider inverted></nys-divider>
<p>Section two content</p>`,
        type: "auto",
      },
    },
  },
};

export const Subtle: Story = {
  render: () => {
    return html`
      <p>Section one content</p>
      <nys-divider subtle></nys-divider>
      <p>Section two content</p>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<p>Section one content</p>
<nys-divider subtle></nys-divider>
<p>Section two content</p>`,
        type: "auto",
      },
    },
  },
};
