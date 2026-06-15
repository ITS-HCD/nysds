import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-checkbox";
import "./nys-checkboxgroup";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-textinput";

// Define the structure of the args used in the stories
interface NysCheckboxArgs {
  id: string;
  label: string;
  description: string;
  name: string;
  value: string;
  form: string | null;
  errorMessage: string;
  tooltip: string;
  size: "sm" | "md";
  checked: boolean;
  disabled: boolean;
  required: boolean;
  showError: boolean;
  groupExist: boolean;
  tile: boolean;
  other: boolean;
  showOtherError: boolean;
  optional: boolean;
}

const meta: Meta<NysCheckboxArgs> = {
  title: "Components/Checkbox",
  component: "nys-checkbox",
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    form: { control: "text" },
    errorMessage: { control: "text" },
    tooltip: { control: "text" },
    size: { control: "select", options: ["sm", "md"] },
    checked: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
    required: { control: "boolean", default: false },
    showError: { control: "boolean", default: false },
    groupExist: { control: "boolean", default: false },
    tile: { control: "boolean", default: false },
    other: { control: "boolean", default: false },
    showOtherError: { control: "boolean", default: false },
    optional: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysCheckboxArgs>;

export const Basic: Story = {
  args: {
    required: true,
    label: "I agree to the terms",
    name: "terms",
  },
  render: (args) => {
    return html`
      <nys-checkbox
        .id=${args.id}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?showError=${args.showError}
        ?groupExist=${args.groupExist}
        ?tile=${args.tile}
        ?other=${args.other}
        ?showOtherError=${args.showOtherError}
        ?optional=${args.optional}
        .label=${args.label}
        .description=${args.description}
        .name=${args.name}
        .value=${args.value}
        .form=${args.form}
        .errorMessage=${args.errorMessage}
        .tooltip=${args.tooltip}
        .size=${args.size}
      ></nys-checkbox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkbox label="I agree to the terms" name="terms" required></nys-checkbox>`,
        type: "auto",
      },
    },
  },
};

export const CheckboxGroup: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks">
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks">
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const BasicAlt: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks" required>
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" required>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks" optional>
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" optional>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks" required>
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" required>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const SizeSmall: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks" size="sm">
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" size="sm">
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const Tile: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks" tile>
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" tile>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const CheckboxGroupWithTooltip: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup
        label="Select landmarks"
        tooltip="Choose your favorite landmarks."
      >
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" tooltip="Choose your favorite landmarks.">
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};
