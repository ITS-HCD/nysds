// To-do: Stories to be added.

import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-icon";

// Define the structure of the args used in the stories
interface NysIconArgs {
  id: string;
  name: string;
  label: string;
  scale: string;
  color: string;
  rotate: string;
  className?: string;
}

const meta: Meta<NysIconArgs> = {
  title: "Components/Icon",
  component: "nys-icon",
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    name: { control: "text" },
    scale: { control: "text" },
    color: { control: "text" },
    rotate: { control: "text" },
    className: { control: "text" },
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
    scale: "1",
    color: "#000000",
    rotate: "0",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
      scale=${args.scale}
      color=${args.color}
      rotate=${args.rotate}
      className=${args.className}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="edit-square icon"
  name="edit-square"
  scale="1"
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
    scale: "1",
    color: "#000000",
    rotate: "0",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
      scale=${args.scale}
      color=${args.color}
      rotate=${args.rotate}
      className=${args.className}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="publish icon"
  name="publish"
  scale="1"
  color="#000000"
  rotate="0"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: CustomSize (ex: nys-icon--size-5)
export const CustomSize: Story = {
  args: {
    label: "search icon",
    name: "search",
    scale: "1",
    color: "#000000",
    rotate: "0",
    className: "nys-icon--size-4",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
      scale=${args.scale}
      color=${args.color}
      rotate=${args.rotate}
      className=${args.className}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="search icon"
  name="search"
  scale="1"
  color="#000000"
  rotate="0"
  className="nys-icon--size-5"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Scale (2.5)
export const ScaleUp: Story = {
  args: {
    label: "download-done icon",
    name: "download-done",
    scale: "2.5",
    color: "#000000",
    rotate: "0",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
      scale=${args.scale}
      color=${args.color}
      rotate=${args.rotate}
      className=${args.className}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="download-done icon"
  name="download-done"
  scale="2.5"
  color="#000000"
  rotate="0"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Color filter
export const ColorChange: Story = {
  args: {
    label: "upload-file icon",
    name: "upload-file",
    scale: "1",
    color: "#1ea0ba",
    rotate: "0",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
      scale=${args.scale}
      color=${args.color}
      rotate=${args.rotate}
      className=${args.className}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="upload-file icon"
  name="upload-file"
  scale="1"
  color="#1ea0ba"
  rotate="0"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Rotate filter
export const Rotate: Story = {
  args: {
    label: "warning icon",
    name: "warning",
    scale: "1",
    color: "#e84267",
    rotate: "20",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
      scale=${args.scale}
      color=${args.color}
      rotate=${args.rotate}
      className=${args.className}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="warning icon"
  name="warning"
  scale="1"
  color="#e84267"
  rotate="20"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};
