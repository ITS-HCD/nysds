import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-backtotop";
import "@nysds/nys-unavheader";
import "@nysds/nys-globalheader";
import "@nysds/nys-unavfooter";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysBacktotopArgs {
  id: string;
  position: string;
  visible: boolean;
}

const meta: Meta<NysBacktotopArgs> = {
  title: "Components/Backtotop",
  component: "nys-backtotop",
  argTypes: {
    id: { control: "text" },
    position: { control: "text" },
    visible: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysBacktotopArgs>;

export const Basic: Story = {
  args: {},
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
      <main style="padding: 0 2rem">
        <h1>Sample Content on page</h1>
        <p>
          This is a sample content area used to demonstrate the functionality of
          the Back to Top button. In an actual application,
          <code>nys-backtotop</code>
          would not be visible until the user scrolls down the page.
        </p>
      </main>
      <footer>
        <nys-backtotop visible .position="${args.position}"></nys-backtotop>
        <nys-unavfooter></nys-unavfooter>
      </footer>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<footer>
  <nys-backtotop></nys-backtotop>
  <!-- Other footer content -->
</footer>`,
        type: "auto",
      },
    },
  },
};

export const Left: Story = {
  render: () => {
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
          --_nys-button-border-radius: var(--nys-radius-round);
        }
      </style>
      <nys-unavheader hideTranslate hideSearch></nys-unavheader>
      <nys-globalheader appName="Back to Top Example"></nys-globalheader>
      <main style="padding: 0 2rem">
        <h1>Sample Content on page</h1>
        <p>
          This is a sample content area used to demonstrate the functionality of
          the Back to Top button. In an actual application,
          <code>nys-backtotop</code>
          would not be visible until the user scrolls down the page.
        </p>
      </main>
      <footer>
        <nys-backtotop visible position="left"></nys-backtotop>
        <nys-button
          prefixIcon="sms"
          variant="outline"
          label="Chat with us"
          size="sm"
        ></nys-button>
        <nys-unavfooter></nys-unavfooter>
      </footer>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<footer>
  <nys-backtotop position="left"></nys-backtotop>
  <!-- Other footer content -->
</footer>`,
        type: "auto",
      },
    },
  },
};
