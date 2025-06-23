import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-backtotop";

// Define the structure of the args used in the stories
interface NysBacktotopArgs {
  id: string;
  name: string;
  onClick: () => void;
}

const meta: Meta<NysBacktotopArgs> = {
  title: "Components/Backtotop",
  component: "nys-backtotop",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysBacktotopArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "backtotop1",
    name: "backtotop1",
  },
  render: (args) => html`
    <nys-backtotop .id=${args.id} .name=${args.name}></nys-backtotop>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-backtotop
  id="backtotop1"
  name="backtotop1"
></nys-backtotop>`,
        type: "auto",
      },
    },
  },
};
