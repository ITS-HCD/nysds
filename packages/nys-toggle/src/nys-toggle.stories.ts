import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-toggle";

// Define the structure of the args used in the stories
interface NysToggleArgs {
  id: string;
  name: string;
  checked: boolean;
  label?: string;
  size?: string;
}

const meta: Meta<NysToggleArgs> = {
  title: "Components/Toggle",
  component: "nys-toggle",
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    checked: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysToggleArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Toggle
export const Toggle: Story = {
  args: {
    name: "publish",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .size=${args.size}
    ></nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="publish"
  ></nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: Checked
export const Checked: Story = {
  args: {
    checked: true,
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .checked=${args.checked}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  checked
  ></nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: Sizes
export const Sizes: Story = {
  args: {
    size: "lg",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  size="lg"
  ></nys-toggle>
        `.trim(),
      },
    },
  },
};
