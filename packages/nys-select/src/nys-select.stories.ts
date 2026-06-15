import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-select";
import "./nys-option";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

// Define the structure of the args used in the stories
interface NysSelectArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  value: string;
  tooltip: string;
  form: string | null;
  errorMessage: string;
  width: "sm" | "md" | "lg" | "full";
  disabled: boolean;
  required: boolean;
  optional: boolean;
  inverted: boolean;
  showError: boolean;
}

const meta: Meta<NysSelectArgs> = {
  title: "Components/Select",
  component: "nys-select",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    value: { control: "text" },
    tooltip: { control: "text" },
    form: { control: "text" },
    errorMessage: { control: "text" },
    width: { control: "select", options: ["sm", "md", "lg", "full"] },
    disabled: { control: "boolean", default: false },
    required: { control: "boolean", default: false },
    optional: { control: "boolean", default: false },
    inverted: { control: "boolean", default: false },
    showError: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysSelectArgs>;

export const BasicOptions: Story = {
  args: {
    value: "ny",
  },
  render: (args) => {
    return html`
      <nys-select
        .id=${args.id}
        ?disabled=${args["disabled"]}
        ?required=${args["required"]}
        ?optional=${args["optional"]}
        ?inverted=${args["inverted"]}
        ?showError=${args["showError"]}
        .name=${args["name"]}
        .label=${args["label"]}
        .description=${args["description"]}
        .value=${args["value"]}
        .tooltip=${args["tooltip"]}
        .form=${args["form"]}
        .errorMessage=${args["errorMessage"]}
        .width=${args["width"]}
      >
        <nys-option value="ny">New York</nys-option>
        <nys-option value="ca" disabled>California</nys-option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select>
  <nys-option value="ny">New York</nys-option>
  <nys-option value="ca" disabled>California</nys-option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const BasicSelect: Story = {
  render: () => {
    return html`
      <nys-select label="Select borough">
        <option value="bronx">The Bronx</option>
        <option value="brooklyn">Brooklyn</option>
        <option value="manhattan">Manhattan</option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select borough">
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const WithOptionGroups: Story = {
  render: () => {
    return html`
      <nys-select label="Select service">
        <optgroup label="Transportation">
          <option value="mta">MTA</option>
          <option value="dmv">DMV</option>
        </optgroup>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select service">
  <optgroup label="Transportation">
    <option value="mta">MTA</option>
    <option value="dmv">DMV</option>
  </optgroup>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const RequiredSelect: Story = {
  render: () => {
    return html`
      <nys-select label="Select borough" required>
        <option value="bronx">The Bronx</option>
        <option value="brooklyn">Brooklyn</option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select borough" required>
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};
