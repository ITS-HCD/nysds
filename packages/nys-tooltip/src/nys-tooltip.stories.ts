import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tooltip";
import "@nysds/nys-textinput";
import "@nysds/nys-label";
import "@nysds/nys-button";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysTooltipArgs {
  id: string;
  text: string;
  for: string;
  inverted: boolean;
  position: "top" | "bottom" | "left" | "right";
}

const meta: Meta<NysTooltipArgs> = {
  title: "Components/Tooltip",
  component: "nys-tooltip",
  argTypes: {
    id: { control: "text" },
    text: { control: "text" },
    for: { control: "text" },
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
    inverted: false,
    for: "my-button",
  },
  render: (args) => html`
    <br />
    <div style="display: flex; justify-content: center;">
      <nys-tooltip
        id=${args.id}
        for=${args.for}
        text=${args.text}
        position=${args.position}
        ?inverted=${args.inverted}
      >
      </nys-tooltip>
      <nys-button id="my-button" label="Hover Me"></nys-button>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-tooltip for="my-button" text="I am a tooltip."></nys-tooltip>
<nys-button id="my-button" label="Hover Me"></nys-button>
`,
        type: "auto",
      },
    },
  },
};

export const Position: Story = {
  args: {
    for: "my-icon2",
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
          for=${args.for}
          text=${args.text}
          position=${args.position}
          ?inverted=${args.inverted}
        >
        </nys-tooltip>
        <nys-icon id="my-icon2" name="info" size="3xl"></nys-icon>
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
    for="my-icon2"
    text="I am a tooltip."
    position="right"
  >
  </nys-tooltip>
  <nys-icon id="my-icon2" name="info" size="3xl"></nys-icon>
</div>
`,
        type: "auto",
      },
    },
  },
};

export const FormElement: Story = {
  args: {
    for: "my-textinput",
    text: "I am a tooltip.",
  },
  render: (args) => html`
    <br />
    <div style="display: flex; justify-content: left;">
      <div style="display: flex; gap: 5px">
        <nys-tooltip
          id=${args.id}
          for=${args.for}
          text=${args.text}
          position=${args.position}
          ?inverted=${args.inverted}
        >
        </nys-tooltip>
        <nys-textinput
          id="my-textinput"
          name="fullName"
          label="Full name"
          description="Enter your full legal name"
          required
        ></nys-textinput>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 5px">
  <nys-tooltip for="my-textinput" text="I am a tooltip."></nys-tooltip>
  <nys-textinput id="my-textinput" name='fullName' label="Full name" description='Enter your full legal name' required></nys-textinput>
</div>
`,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  args: {
    for: "my-tooltip3",
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
          for=${args.for}
          text=${args.text}
          position=${args.position}
          ?inverted=${args.inverted}
        >
        </nys-tooltip>
        <nys-icon id="my-tooltip3" name="info" size="3xl"></nys-icon>
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
    for="my-tooltip3"
    text="I am a tooltip."
    inverted
  >
  </nys-tooltip>
  <nys-icon id="my-tooltip3" name="info" size="3xl"></nys-icon>
</div>`,
        type: "auto",
      },
    },
  },
};
