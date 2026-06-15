import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-radiobutton";
import "./nys-radiogroup";

// Define the structure of the args used in the stories
interface NysRadiobuttonArgs {
  id: string;
  label: string;
  description: string;
  name: string;
  value: string;
  form: string | null;
  size: "sm" | "md";
  checked: boolean;
  disabled: boolean;
  required: boolean;
  tile: boolean;
  other: boolean;
  showOtherError: boolean;
}

const meta: Meta<NysRadiobuttonArgs> = {
  title: "Components/Radiobutton",
  component: "nys-radiobutton",
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    form: { control: "text" },
    size: { control: "select", options: ["sm", "md"] },
    checked: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
    required: { control: "boolean", default: false },
    tile: { control: "boolean", default: false },
    other: { control: "boolean", default: false },
    showOtherError: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysRadiobuttonArgs>;

export const Basic: Story = {
  args: {
    required: true,
    label: "The Bronx",
    name: "borough",
    value: "bronx",
  },
  render: (args) => {
    return html`
      <nys-radiogroup
        .id=${args.id}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?tile=${args.tile}
        ?other=${args.other}
        ?showOtherError=${args.showOtherError}
        .label=${args.label}
        .description=${args.description}
        .name=${args.name}
        .value=${args.value}
        .form=${args.form}
        .size=${args.size}
      >
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough" required>
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const DisabledRadio: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough">
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
          disabled
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough">
  <nys-radiobutton name="borough" value="bronx" label="The Bronx" disabled></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const BasicRadioGroup: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough" required>
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="manhattan"
          label="Manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough" required>
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
  <nys-radiobutton name="borough" value="manhattan" label="Manhattan"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};
