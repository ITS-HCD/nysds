import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-backtotop";
import "@nysds/nys-unavheader";
import "@nysds/nys-globalheader";
import "@nysds/nys-globalfooter";
import "@nysds/nys-unavfooter";

// Define the structure of the args used in the stories
interface NysBacktotopArgs {
  position: string;
}

const meta: Meta<NysBacktotopArgs> = {
  title: "Components/Backtotop",
  component: "nys-backtotop",
  argTypes: {
    position: {
      control: "select",
      options: ["left", "right"],
    },
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
  render: (args) => html`
    <nys-unavheader></nys-unavheader>
    <nys-globalheader></nys-globalheader>
    <div style="height: 1000px; padding: 20px;">
      <h1>Sample Content on page</h1>
      <p>
        This is a sample content area. Scroll down to see the "Back to Top"
        button in action.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <p>
        More content here to make the page scrollable. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
    <nys-globalfooter></nys-globalfooter>
    <nys-unavfooter></nys-unavfooter>
    <nys-backtotop .position=${args.position}></nys-backtotop>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-backtotop></nys-backtotop>`,
        type: "auto",
      },
    },
  },
};
