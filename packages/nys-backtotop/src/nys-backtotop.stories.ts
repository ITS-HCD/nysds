import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-backtotop";
import "@nysds/nys-unavheader";
import "@nysds/nys-globalheader";
import "@nysds/nys-unavfooter";
import "@nysds/nys-button";
import "@nysds/nys-icon";

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
  render: (args) => {
    return html`
      <style>
        code {
          white-space: nowrap;
          padding: var(--nys-space-1px) var(--nys-space-2px);
          border-radius: var(--nys-radius-md);
          color: var(--nys-color-red-600);
          background: var(--nys-color-neutral-10);
          font-size: var(--nys-font-size-sm);
        }
      </style>

      <nys-unavheader hideTranslate hideSearch></nys-unavheader>
      <nys-globalheader appName="Back to Top Example"></nys-globalheader>
      <div style="padding: 0 2rem">
        <h1>Sample Content on page</h1>
        <p>
          This is a sample content area used to demonstrate the functionality of
          the Back to Top button. In an actual application,
          <code>nys-backtotop</code> would not be visible until the user scrolls
          down the page.
        </p>
      </div>
      <nys-unavfooter></nys-unavfooter>
      <nys-backtotop visible .position=${args.position}></nys-backtotop>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `<nys-backtotop></nys-backtotop>`,
        type: "auto",
      },
    },
  },
};

export const Left: Story = {
  args: {
    position: "left",
  },
  render: (args) => {
    return html`
      <style>
        code {
          white-space: nowrap;
          padding: var(--nys-space-1px) var(--nys-space-2px);
          border-radius: var(--nys-radius-md);
          color: var(--nys-color-red-600);
          background: var(--nys-color-neutral-10);
          font-size: var(--nys-font-size-sm);
        }

        nys-button {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          --_nys-button-border-radius--left: var(--nys-radius-round);
          --_nys-button-border-radius--right: var(--nys-radius-round);
        }
      </style>

      <nys-unavheader hideTranslate hideSearch></nys-unavheader>
      <nys-globalheader appName="Back to Top Example"></nys-globalheader>
      <div style="padding: 0 2rem">
        <h1>Sample Content on page</h1>
        <p>
          This is a sample content area used to demonstrate the functionality of
          the Back to Top button. In an actual application,
          <code>nys-backtotop</code> would not be visible until the user scrolls
          down the page.
        </p>
      </div>
      <nys-button
        prefixIcon="sms"
        variant="outline"
        label="Chat with us"
        size="sm"
      ></nys-button>
      <nys-unavfooter></nys-unavfooter>
      <nys-backtotop visible .position=${args.position}></nys-backtotop>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `<nys-backtotop left></nys-backtotop>`,
        type: "auto",
      },
    },
  },
};
