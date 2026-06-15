import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-unavfooter";
import "@nysds/nys-globalfooter";

// Define the structure of the args used in the stories
interface NysUnavfooterArgs {
  id: string;
}

const meta: Meta<NysUnavfooterArgs> = {
  title: "Components/Unavfooter",
  component: "nys-unavfooter",
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
type Story = StoryObj<NysUnavfooterArgs>;

export const Basic: Story = {
  args: {},
  render: (args) => {
    return html`
      <nys-globalfooter .id=${args.id}>...</nys-globalfooter>
      <nys-unavfooter></nys-unavfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter>...</nys-globalfooter>
<nys-unavfooter></nys-unavfooter>`,
        type: "auto",
      },
    },
  },
};
