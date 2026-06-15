import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-divider";

// Define the structure of the args used in the stories
interface NysDividerArgs {
  id: string;
  inverted: boolean;
  subtle: boolean;
}

const meta: Meta<NysDividerArgs> = {
  title: "Components/Divider",
  component: "nys-divider",
  argTypes: {
    id: { control: "text" },
    inverted: { control: "boolean", default: false },
    subtle: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysDividerArgs>;

export const Basic: Story = {
  args: {},
  render: (args) => {
    return html`
      <p .id=${args.id} ?inverted=${args.inverted} ?subtle=${args.subtle}>
        Section one content
      </p>
      <nys-divider></nys-divider>
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
