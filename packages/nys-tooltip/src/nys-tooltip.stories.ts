import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tooltip";
import "@nysds/nys-button";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysTooltipArgs {
  id: string;
  text: string;
  for: string;
  inverted: boolean;
  focusable: boolean;
  position: "top" | "bottom" | "left" | "right";
}

const meta: Meta<NysTooltipArgs> = {
  title: "Components/Tooltip",
  component: "nys-tooltip",
  argTypes: {
    id: { control: "text" },
    text: { control: "text" },
    for: { control: "text" },
    focusable: { control: "boolean" },
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
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
type Story = StoryObj<NysTooltipArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    text: "I am a tooltip.",
    focusable: false,
    inverted: false,
    for: "button1",
  },
  render: (args) => html`
    <br />
    <div style="display: flex; justify-content: left;">
      <nys-tooltip
        id=${args.id}
        text=${args.text}
        position=${args.position}
        ?inverted=${args.inverted}
        ?focusable=${args.focusable}
      >
        <nys-button id="button1" name="button1" label="Hover Me"></nys-button>
      </nys-tooltip>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-tooltip
  text="I am a tooltip."
>
  <nys-button id="button1" name="button1" label="Hover Me"></nys-button>
</nys-tooltip>`,
        type: "auto",
      },
    },
  },
};

export const Test: Story = {
  args: {
    text: "I am a tooltip.",
    focusable: false,
    inverted: false,
    for: "my-button",
  },
  render: (args) => html`
    <br />
    <div style="display: flex; justify-content: left; flex-direction: column">
      <nys-button id="my-button" name="my-button" label="Hover Me"></nys-button>

      <p>Random p tag here</p>
      <br />
      <nys-tooltip
        id=${args.id}
        text=${args.text}
        for=${args.for}
        position=${args.position}
        ?inverted=${args.inverted}
        ?focusable=${args.focusable}
      >
      </nys-tooltip>

      <nys-icon id="my-icon" name="info" size="3xl"></nys-icon>
      <nys-tooltip
        text="I AM ICON TOOLTIP"
        for="my-icon"
        position=${args.position}
        ?inverted=${args.inverted}
        focusable
      >
      </nys-tooltip>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-tooltip for="my-button" text="I am a tooltip."></nys-tooltip>

      <p>Random p tag here</p>
      <br />
<nys-button id="my-button" label="Hover Me"></nys-button>
      <nys-icon id="my-icon" name="info" size="3xl"></nys-icon>

      <nys-tooltip
        text="I AM ICON TOOLTIP"
        for="my-icon"
        focusable
      >
      </nys-tooltip>
`,
        type: "auto",
      },
    },
  },
};

export const Focusable: Story = {
  args: {
    text: "I am a tooltip.",
    focusable: true,
  },
  render: (args) => html`
    <br />
    <div style="display: flex; justify-content: center;">
      <div style="display: flex; gap: 5px">
        <p>Hover over the icon</p>
        <nys-tooltip
          id=${args.id}
          text=${args.text}
          position=${args.position}
          ?inverted=${args.inverted}
          ?focusable=${args.focusable}
        >
          <nys-icon name="info" size="3xl"></nys-icon>
        </nys-tooltip>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 5px">
  <p>Hover over the icon</p>
  <nys-tooltip
    text="I am a tooltip."
    focusable
  >
    <nys-icon name="info" size="3xl"></nys-icon>
  </nys-tooltip>
</div>
`,
        type: "auto",
      },
    },
  },
};

export const Position: Story = {
  args: {
    text: "I am a tooltip.",
    position: "right",
    focusable: true,
  },
  render: (args) => html`
    <br />
    <div style="display: flex; justify-content: center;">
      <div style="display: flex; gap: 5px">
        <p>Hover over the icon</p>
        <nys-tooltip
          id=${args.id}
          text=${args.text}
          position=${args.position}
          ?inverted=${args.inverted}
          ?focusable=${args.focusable}
        >
          <nys-icon name="info" size="3xl"></nys-icon>
        </nys-tooltip>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 5px">
  <p>Hover over the icon</p>
  <nys-tooltip
    text="I am a tooltip."
    position="right"
    focusable
  >
    <nys-icon name="info" size="3xl"></nys-icon>
  </nys-tooltip>
</div>
`,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  args: {
    text: "I am a tooltip.",
    inverted: true,
    focusable: true,
  },
  render: (args) => html`
    <div
      style="display: flex; justify-content: center; background-color: var(--nys-color-ink, #1b1b1b); padding: var(--nys-space-800, 64px);"
    >
      <div style="color: #fff; display: flex; gap: 5px">
        <p>Hover over the icon</p>
        <nys-tooltip
          id=${args.id}
          text=${args.text}
          position=${args.position}
          ?inverted=${args.inverted}
          ?focusable=${args.focusable}
        >
          <nys-icon name="info" size="3xl"></nys-icon>
        </nys-tooltip>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<div style="color: #fff; display: flex; gap: 5px">
  <p>Hover over the icon</p>
  <nys-tooltip
    text="I am a tooltip."
    inverted
    focusable
  >
    <nys-icon name="info" size="3xl"></nys-icon>
  </nys-tooltip>
</div>`,
        type: "auto",
      },
    },
  },
};
