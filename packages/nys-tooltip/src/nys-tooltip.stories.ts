import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tooltip";
import "@nysds/nys-button";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Tooltip",
  component: "nys-tooltip",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'Shows contextual help text on hover/focus. Auto-positions to stay within viewport and supports keyboard dismiss.\n\nLink to a trigger element via `for` attribute matching the trigger\'s `id`. Tooltip appears on hover or focus\nand dismisses on blur, mouse leave, or Escape key. Use for supplementary info only—not critical content.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<div style={{ display: "flex", justifyContent: "center", gap: "5px", padding: "40px" }}>\n  <NysTooltip for="my-button" text="I am a tooltip." />\n  <NysButton id="my-button" label="Hover Me" />\n</div>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<div style="display: flex; justify-content: center; gap: 5px; padding: 40px">\n  <nys-tooltip for="my-button" text="I am a tooltip."></nys-tooltip>\n  <nys-button id="my-button" label="Hover Me"></nys-button>\n</div>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    text: "I am a tooltip.",
    inverted: false,
    for: "my-button",
  },
  render: (args) => {
    return html`
      <div
        style="display: flex; justify-content: center; gap: 5px; padding: 40px"
      >
        <nys-tooltip
          text=${args.text}
          ?inverted=${args.inverted}
          for=${args.for}
        ></nys-tooltip>
        <nys-button id="my-button" label="Hover Me"></nys-button>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; justify-content: center; gap: 5px; padding: 40px">
  <nys-tooltip for="my-button" text="I am a tooltip."></nys-tooltip>
  <nys-button id="my-button" label="Hover Me"></nys-button>
</div>`,
        type: "auto",
      },
    },
  },
};

export const Position: Story = {
  render: () => {
    return html`
      <div
        style="display: flex; justify-content: center; gap: 5px; padding: 40px"
      >
        <p>Hover over the icon</p>
        <nys-tooltip
          for="my-icon2"
          text="I am a tooltip."
          position="right"
        ></nys-tooltip>
        <nys-icon id="my-icon2" name="info" size="3xl"></nys-icon>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; justify-content: center; gap: 5px; padding: 40px">
  <p>Hover over the icon</p>
  <nys-tooltip for="my-icon2" text="I am a tooltip." position="right"></nys-tooltip>
  <nys-icon id="my-icon2" name="info" size="3xl"></nys-icon>
</div>`,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  render: () => {
    return html`
      <div
        style="background-color: #1b1b1b; color: #ffffff; padding: 40px; display: flex; gap: 5px"
      >
        <p>Hover over the icon</p>
        <nys-tooltip
          for="my-tooltip3"
          text="I am a tooltip."
          inverted
        ></nys-tooltip>
        <nys-icon id="my-tooltip3" name="info" size="3xl"></nys-icon>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="background-color: #1b1b1b; color: #ffffff; padding: 40px; display: flex; gap: 5px">
  <p>Hover over the icon</p>
  <nys-tooltip for="my-tooltip3" text="I am a tooltip." inverted></nys-tooltip>
  <nys-icon id="my-tooltip3" name="info" size="3xl"></nys-icon>
</div>`,
        type: "auto",
      },
    },
  },
};
