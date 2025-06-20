import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tooltip";
import "@nysds/nys-button";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysTooltipArgs {
  id: string;
  text: string;
  inverted: boolean;
  position: string;
}

const meta: Meta<NysTooltipArgs> = {
  title: "Components/Tooltip",
  component: "nys-tooltip",
  argTypes: {
    id: { control: "text" },
    text: { control: "text" },
    inverted: { control: "boolean" },
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
  },
  render: (args) => html`
    <br />
    <div style="display: flex; justify-content: center;">
      <nys-tooltip
        id=${args.id}
        text=${args.text}
        position=${args.position ?? ""}
        ?inverted=${args.inverted}
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
  label="I am a tooltip."
>
  <nys-button id="button1" name="button1" label="Hover Me"></nys-button>
</nys-tooltip>`,
        type: "auto",
      },
    },
  },
};

export const Position: Story = {
  args: {
    text: "I am a tooltip.",
    position: "right",
  },
  render: (args) => html`
    <br />
    <div style="display: flex; justify-content: center;">
      <div style="display: flex; gap: 5px">
        <p>Hover over the icon</p>
        <nys-tooltip
          id=${args.id}
          text=${args.text}
          position=${args.position ?? ""}
          ?inverted=${args.inverted}
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
    label="I am a tooltip."
    position="right"
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
          position=${args.position ?? ""}
          ?inverted=${args.inverted}
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
    label="I am a tooltip."
    inverted
  >
    <nys-icon name="info" size="3xl"></nys-icon>
  </nys-tooltip>
</div>`,
        type: "auto",
      },
    },
  },
};
