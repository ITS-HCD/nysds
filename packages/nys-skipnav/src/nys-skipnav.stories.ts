import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-skipnav";

const meta: Meta = {
  title: "Components/Skipnav",
  component: "nys-skipnav",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'An accessible "Skip to main content" link for keyboard and screen reader users. Visually hidden until focused.\n\nPlace as the first focusable element in the document. Links to `#main-content` by default, or specify `href`\nfor a custom target. The target element receives focus when activated for proper screen reader announcement.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysSkipnav />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-skipnav></nys-skipnav>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    href: "",
  },
  render: (args) => {
    return html` <nys-skipnav href=${args.href}></nys-skipnav> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-skipnav></nys-skipnav>`,
        type: "auto",
      },
    },
  },
};

export const CustomTarget: Story = {
  render: () => {
    return html`
      <nys-skipnav href="#content-area"></nys-skipnav>
      <p id="content-area">...</p>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-skipnav href="#content-area"></nys-skipnav>
<p id="content-area">...</p>`,
        type: "auto",
      },
    },
  },
};
