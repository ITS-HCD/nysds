// To-do: Stories to be added.

import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-icon";

// Define the structure of the args used in the stories
interface NysIconArgs {
  name: string;
  label?: string;
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

// Story: OnlyNameProp
export const OnlyNameProp: Story = {
  args: {
    name: "publish",
  },
  render: (args) => html`
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

// Story: AdditionalProperties
export const AdditionalProperties: Story = {
  args: {
    label: "edit-square icon",
    name: "edit-square",
    color: "#000000",
    rotate: "0",
    className: "nys-icon--size-3",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
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

// Story: CustomSize (ex: nys-icon--size-5)
export const CustomSize: Story = {
  args: {
    label: "search icon",
    name: "search",
    className: "nys-icon--size-5",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
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
  className="nys-icon--size-5"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Color with inheritance 
export const ColorInheritance: Story = {
  args: {
    label: "upload-file icon",
    name: "upload-file",
    className: "nys-icon--size-3",
  },
  render: (args) => html`
    <div class="parent" style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;">
      <p style="display:flex; align-items: center;">The color of the nearest parent container is set to DarkBlue. <nys-icon
        .label=${args.label}
        .name=${args.name}
        className=${args.className}
      ></nys-icon></p>

    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="upload-file icon"
  name="upload-file"
  className="nys-icon--size-3"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Color change using custom css variable 
export const ColorChange: Story = {
  args: {
    label: "upload-file icon",
    name: "upload-file",
    color: "#db117d",
    className: "nys-icon--size-3",
  },
  render: (args) => html`
    <div class="parent" style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;">
      <p style="display:flex; align-items: center;">The color of the nearest parent container is set to DarkBlue. <nys-icon
        .label=${args.label}
        .name=${args.name}
        color=${args.color}
        className=${args.className}
      ></nys-icon></p>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="upload-file icon"
  name="upload-file"
  color="#db117d"
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
    rotate: "20",
    className: "nys-icon--size-3",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
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
  rotate="20"
  className="nys-icon--size-3"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};
