// To-do: Stories to be added.

import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-icon";

// Define the structure of the args used in the stories
interface NysIconArgs {
  id: string;
  name: string;
  label: string;
  focusable: boolean;
  width: string;
  height: string;
  color: string;
  rotate: string;
}

const meta: Meta<NysIconArgs> = {
  title: "Components/Icon",
  component: "nys-icon",
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    name: { control: "text" },
    focusable: { control: "boolean" },
    width: { control: "text" },
    height: { control: "text" },
    color: { control: "text" },
    rotate: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysIconArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: EditSquare
export const EditSquare: Story = {
  args: {
    label: "edit-square icon",
    name: "edit-square",
    focusable: false,
    width: "24px",
    height: "24px",
    color: "#f0c033",
    rotate: "0",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
      .focusable=${false}
      width=${args.width}
      height=${args.height}
      color=${args.color}
      rotate=${args.rotate}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="edit-square icon"
  name="edit-square"
  focusable=false
  width="24px"
  height="24px"
  color="#f0c033"
  rotate="0"
  ></nys-icon>
        `,
        type: "auto",
      },
    },
  },
};

// Story: Publish
export const Publish: Story = {
  args: {
    label: "publish icon",
    name: "publish",
    focusable: false,
    width: "24px",
    height: "24px",
    color: "#000000",
    rotate: "0",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
      .focusable=${false}
      width=${args.width}
      height=${args.height}
      color=${args.color}
      rotate=${args.rotate}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="publish icon"
  name="publish"
  focusable=false
  width="24px"
  height="24px"
  color="#000000"
  rotate="0"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};
