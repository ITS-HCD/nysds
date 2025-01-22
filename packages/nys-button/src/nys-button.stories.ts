import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import { action } from "@storybook/addon-actions";
import "./nys-button";

// Define the structure of the args used in the stories
interface NysButtonArgs {
  id: string;
  name: string;
  size: string;
  variant: string;
  inverse: boolean;
  label: string;
  prefixIcon: string;
  suffixIcon: string;
  disabled: boolean;
  form: string;
  value: string;
  type: string;
  onClick: () => void;
}

const meta: Meta<NysButtonArgs> = {
  title: "Components/Button",
  component: "nys-button",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["fill", "outline", "ghost", "text"],
    },
    inverse: { control: "boolean" },
    label: { control: "text" },
    prefixIcon: { control: "text" },
    suffixIcon: { control: "text" },
    disabled: { control: "boolean" },
    form: { control: "text" },
    value: { control: "text" },
    type: { control: "select", options: ["submit", "reset", "button"] },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysButtonArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "button1",
    name: "button1",
    label: "{text}",
    prefixIcon: "check_circle",
    suffixIcon: "check",
  },
  render: (args) => html`
    <nys-button
      .id=${args.id}
      .name=${args.name}
      .size=${args.size}
      .variant=${args.variant}
      .inverse=${args.inverse}
      .label=${args.label}
      .prefixIcon=${args.prefixIcon}
      .suffixIcon=${args.suffixIcon}
      .disabled=${args.disabled}
      .form=${args.form}
      .value=${args.value}
      .type=${args.type}
      .onClick=${action("on-click")}
    ></nys-button>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-button></nys-button>`,
        type: "auto",
      },
    },
  },
};
