import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-backtotop";
import "@nysds/nys-button";
import "@nysds/nys-globalheader";
import "@nysds/nys-icon";
import "@nysds/nys-unavfooter";
import "@nysds/nys-unavheader";

const meta: Meta = {
  title: "Components/Backtotop",
  component: "nys-backtotop",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'A floating "Back to top" button that appears after scrolling. Smooth-scrolls to page top when clicked.\n\nAuto-shows after scrolling 1.5 viewports on pages 4+ screens tall. Set `visible` to force display.\nRenders as circle button on mobile. Position with `position` prop (`left` or `right`).\n\n**Placement:** For best accessibility, place as the first focusable element in the page footer.\nIf no footer exists, place at the bottom of the body tag (after main content). Floating\npositioning allows it to overlay content without taking up layout space.\n\n**Focus Management:** When clicked, after scrolling to the top, focus is moved to `<body>`.\nThis places the user before the skip-navigation link so they can re-use it to jump directly\nback to main content — and works regardless of whether the page uses `<main>` or heading landmarks.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<footer>\n  <NysBacktotop />\n  {/* Other footer content */}\n</footer>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<footer>\n  <nys-backtotop></nys-backtotop>\n  <!-- Other footer content -->\n</footer>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    position: "right",
    visible: true,
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
        <nys-backtotop
          position=${args.position}
          ?visible=${args.visible}
        ></nys-backtotop>
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
