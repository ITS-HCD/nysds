import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-skipnav";
import "../../nys-icon";
import "../../nys-unavheader";
import "../../nys-unavfooter";

// Define the structure of the args used in the stories
interface NysSkipnavArgs {
  id: string;
  href: string;
}

const meta: Meta<NysSkipnavArgs> = {
  title: "Components/Skipnav",
  component: "nys-skipnav",
  argTypes: {
    id: { control: "text" },
    href: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysSkipnavArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "skipnav",
    href: "#main-content",
  },
  render: (args) => html`
    <p>
      This skip link is visible for demo purposes. In a mock real-world scenario
      further down this page, it’s hidden until focused.
    </p>
    <nys-skipnav .id=${args.id} .href=${args.href} demoVisible></nys-skipnav>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-skipnav
  id="skipnav"
  href="#main-content"
></nys-skipnav>`,
        type: "auto",
      },
    },
  },
};

export const HiddenUntilFocus: Story = {
  args: {
    id: "skipnav1",
    href: "#main-content1",
  },
  render: (args) => html`
    <nys-skipnav .id=${args.id} .href=${args.href}></nys-skipnav>
    <nys-unavheader></nys-unavheader>
    <div
      id="main-content1"
      style="padding:10px 30px; background-color: #f0f0f0;"
    >
      <h1>Main Content</h1>
      <p style="display:flex; align-items:top; gap:10px;">
        <nys-icon name="info" size="2xl"></nys-icon>Press Tab to focus on the
        hidden "Skip to main content" link. This feature allows screen reader
        users and keyboard navigators to jump directly to the main content
        section, improving accessibility and usability.
      </p>
    </div>
    <nys-unavfooter></nys-unavfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-skipnav
  id="skipnav"
  href="#main-content1"
></nys-skipnav>

<nys-unavheader></nys-unavheader>
<div id="main-content1" style="padding:10px 30px; background-color: #f0f0f0;">
  <h1>Main Content</h1>
  <p style="display:flex; align-items:top; gap:10px;"><nys-icon name="info" size="2xl"></nys-icon>Press Tab to focus on the hidden "Skip to main content" link. This feature allows screen reader users and keyboard navigators to jump directly to the main content section, improving accessibility and usability.</p>
</div>
<nys-unavfooter></nys-unavfooter>
`,
        type: "auto",
      },
    },
  },
};
