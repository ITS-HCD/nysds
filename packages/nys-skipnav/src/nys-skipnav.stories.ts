import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-skipnav";

// Define the structure of the args used in the stories
interface NysSkipnavArgs {
  id: string;
}

const meta: Meta<NysSkipnavArgs> = {
  title: "Components/Skipnav",
  component: "nys-skipnav",
  argTypes: {
    id: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysSkipnavArgs>;

export const Basic: Story = {
  args: {},
  render: (args) => {
    return html`
      <nys-skipnav .id=${args.id}></nys-skipnav>
      <main id="main-content">...</main>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-skipnav></nys-skipnav>
<main id="main-content">...</main>`,
        type: "auto",
      },
    },
  },
};

export const CustomTarget: Story = {
  render: () => {
    return html` <nys-skipnav href="#content-area"></nys-skipnav> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-skipnav href="#content-area"></nys-skipnav>`,
        type: "auto",
      },
    },
  },
};
