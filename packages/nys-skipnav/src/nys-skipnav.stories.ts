import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-skipnav";

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
    <nys-skipnav .id=${args.id} .href=${args.href}></nys-skipnav>
    // unav
    // Alert: Tab to focus on the hidden link (skip to main content)
    // Main content
    // Footer
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
