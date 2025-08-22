import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-divider";

// Define the structure of the args used in the stories
interface NysDividerArgs {
  inverted: boolean;
}

const meta: Meta<NysDividerArgs> = {
  title: "Components/Divider",
  component: "nys-divider",
  argTypes: {
    inverted: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysDividerArgs>;

export const Basic: Story = {
  args: {},
  render: (args) => html`
    <div>sample content</div>
    <nys-divider .inverted=${args.inverted}></nys-divider>
    <div>sample content</div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-divider></nys-divider>`,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; background-color: var(--nys-color-ink, #1b1b1b); color: var(--nys-color-ink-reverse, #fff); padding: var(--nys-space-200, 16px);"
    >
      <div>sample content</div>
      <nys-divider inverted></nys-divider>
      <div>sample content</div>
    </div>
  `,

  parameters: {
    docs: {
      source: {
        code: `<nys-divider inverted></nys-divider>`,
        type: "auto",
      },
    },
  },
};
