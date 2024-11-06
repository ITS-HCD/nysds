// To-do: Stories to be added.

import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-icon";

// Define the structure of the args used in the stories
interface NysIconArgs {
  name: string;
  label?: string;
  scale?: string;
  color?: string;
  rotate?: string;
  className?: string;
}

const meta: Meta<NysIconArgs> = {
  title: "Components/Icon",
  component: "nys-icon",
  argTypes: {
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
    className: "nys-icon--size-3",
  },
  render: (args) => html`
    <p>
      Try changing the 'name' to try out different icons. For example, the
      current name is "edit-square".
    </p>
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
  color="#000000"
  rotate="0"
  className="nys-icon--size-3"
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
    name: "publish",
  },
  render: (args) => html`
    <p>
      The name property is the only required attribute for this component. The
      current icon name is "publish".
    </p>
    <p>
      Note: Leaving the 'label' blank will set aria-hidden for screen readers.
    </p>

    <nys-icon .name=${args.name}></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  name="publish"
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
    className: "nys-icon--size-5",
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
    className: "nys-icon--size-3",
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
  className="nys-icon--size-3"
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
    className: "nys-icon--size-3",
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
  className="nys-icon--size-3"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};
