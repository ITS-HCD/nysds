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
  position: string;
  inverted: boolean;
}

const meta: Meta<NysTooltipArgs> = {
  title: "Components/Tooltip",
  component: "nys-tooltip",
  argTypes: {
    id: { control: "text" },
    text: { control: "text" },
    for: { control: "text" },
    position: { control: "text" },
    inverted: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysTooltipArgs>;

export const Basic: Story = {
  args: {
    circle: true,
    label: "Help",
    icon: "help",
    for: "help-btn",
    text: "Click for assistance",
  },
  render: (args) => {
    return html`
      <nys-button
        .id=${args.id}
        ?inverted=${args.inverted}
        .text=${args.text}
        .for=${args.for}
        .position=${args.position}
      ></nys-button>
      <nys-tooltip for="help-btn" text="Click for assistance"></nys-tooltip>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button id="help-btn" label="Help" circle icon="help"></nys-button>
<nys-tooltip for="help-btn" text="Click for assistance"></nys-tooltip>`,
        type: "auto",
      },
    },
  },
};

export const PositionedTooltip: Story = {
  render: () => {
    return html`
      <nys-icon id="info-icon" name="info"></nys-icon>
      <nys-tooltip
        for="info-icon"
        text="Additional details"
        position="right"
      ></nys-tooltip>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon id="info-icon" name="info"></nys-icon>
<nys-tooltip for="info-icon" text="Additional details" position="right"></nys-tooltip>`,
        type: "auto",
      },
    },
  },
};
