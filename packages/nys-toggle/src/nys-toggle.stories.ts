import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-toggle";
import "@nysds/nys-label";

// Define the structure of the args used in the stories
interface NysToggleArgs {
  id: string;
  name: string;
  value: string;
  label: string;
  description: string;
  form: string | null;
  size: "sm" | "md";
  checked: boolean;
  disabled: boolean;
  noIcon: boolean;
  inverted: boolean;
}

const meta: Meta<NysToggleArgs> = {
  title: "Components/Toggle",
  component: "nys-toggle",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    form: { control: "text" },
    size: { control: "select", options: ["sm", "md"] },
    checked: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
    noIcon: { control: "boolean", default: false },
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
type Story = StoryObj<NysToggleArgs>;

export const BasicToggle: Story = {
  args: {
    label: "Enable notifications",
    name: "notifications",
  },
  render: (args) => {
    return html`
      <nys-toggle
        .id=${args.id}
        ?checked=${args["checked"]}
        ?disabled=${args["disabled"]}
        ?noIcon=${args["noIcon"]}
        ?inverted=${args["inverted"]}
        .name=${args["name"]}
        .value=${args["value"]}
        .label=${args["label"]}
        .description=${args["description"]}
        .form=${args["form"]}
        .size=${args["size"]}
      ></nys-toggle>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle label="Enable notifications" name="notifications"></nys-toggle>`,
        type: "auto",
      },
    },
  },
};

export const DarkModeToggle: Story = {
  render: () => {
    return html`
      <nys-toggle
        label="Dark mode"
        description="Adjust display for low light"
        checked
      ></nys-toggle>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle label="Dark mode" description="Adjust display for low light" checked></nys-toggle>`,
        type: "auto",
      },
    },
  },
};
