import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-combobox";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

// Define the structure of the args used in the stories
interface NysComboboxArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  value: string;
  tooltip: string;
  form: string | null;
  width: "md" | "lg" | "full";
  errorMessage: string;
  disabled: boolean;
  required: boolean;
  optional: boolean;
  inverted: boolean;
  showError: boolean;
}

const meta: Meta<NysComboboxArgs> = {
  title: "Components/Combobox",
  component: "nys-combobox",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    value: { control: "text" },
    tooltip: { control: "text" },
    form: { control: "text" },
    width: { control: "select", options: ["md", "lg", "full"] },
    errorMessage: { control: "text" },
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
type Story = StoryObj<NysComboboxArgs>;

export const Basic: Story = {
  args: {
    label: "Select your favorite fruit",
    value: "apple",
  },
  render: (args) => {
    return html`
      <nys-combobox
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
        .width=${args["width"]}
        .errorMessage=${args["errorMessage"]}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry">Cherry</option>
        <option value="date">Date</option>
        <option value="elderberry">Elderberry</option>
        <option value="fig">Fig</option>
        <option value="grape">Grape</option>
        <option value="honeydew">Honeydew</option>
        <option value="kiwi">Kiwi</option>
        <option value="lemon">Lemon</option>
        <option value="mango">Mango</option>
        <option value="nectarine">Nectarine</option>
        <option value="orange">Orange</option>
        <option value="papaya">Papaya</option>
        <option value="quince">Quince</option>
        <option value="raspberry">Raspberry</option>
        <option value="strawberry">Strawberry</option>
        <option value="tangerine">Tangerine</option>
        <option value="watermelon">Watermelon</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="cherry">Cherry</option>
  <option value="date">Date</option>
  <option value="elderberry">Elderberry</option>
  <option value="fig">Fig</option>
  <option value="grape">Grape</option>
  <option value="honeydew">Honeydew</option>
  <option value="kiwi">Kiwi</option>
  <option value="lemon">Lemon</option>
  <option value="mango">Mango</option>
  <option value="nectarine">Nectarine</option>
  <option value="orange">Orange</option>
  <option value="papaya">Papaya</option>
  <option value="quince">Quince</option>
  <option value="raspberry">Raspberry</option>
  <option value="strawberry">Strawberry</option>
  <option value="tangerine">Tangerine</option>
  <option value="watermelon">Watermelon</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const DefaultValue: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select your favorite fruit" value="mango">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="mango" selected>Mango</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" value="mango">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="mango" selected>Mango</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const OptionGroup: Story = {
  render: () => {
    return html`
      <nys-combobox
        label="Select a fruit"
        description="Fruits organized by category"
      >
        <optgroup label="Citrus">
          <option value="lemon">Lemon</option>
          <option value="lime">Lime</option>
          <option value="orange">Orange</option>
          <option value="grapefruit">Grapefruit</option>
          <option value="tangerine">Tangerine</option>
        </optgroup>
        <optgroup label="Berries">
          <option value="strawberry">Strawberry</option>
          <option value="blueberry">Blueberry</option>
          <option value="raspberry">Raspberry</option>
          <option value="blackberry">Blackberry</option>
          <option value="cranberry">Cranberry</option>
        </optgroup>
        <optgroup label="Tropical">
          <option value="mango">Mango</option>
          <option value="pineapple">Pineapple</option>
          <option value="papaya">Papaya</option>
          <option value="coconut">Coconut</option>
          <option value="passionfruit">Passionfruit</option>
        </optgroup>
        <optgroup label="Stone Fruits">
          <option value="peach">Peach</option>
          <option value="plum">Plum</option>
          <option value="cherry">Cherry</option>
          <option value="apricot">Apricot</option>
          <option value="nectarine">Nectarine</option>
        </optgroup>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select a fruit" description="Fruits organized by category">
  <optgroup label="Citrus">
    <option value="lemon">Lemon</option>
    <option value="lime">Lime</option>
    <option value="orange">Orange</option>
    <option value="grapefruit">Grapefruit</option>
    <option value="tangerine">Tangerine</option>
  </optgroup>
  <optgroup label="Berries">
    <option value="strawberry">Strawberry</option>
    <option value="blueberry">Blueberry</option>
    <option value="raspberry">Raspberry</option>
    <option value="blackberry">Blackberry</option>
    <option value="cranberry">Cranberry</option>
  </optgroup>
  <optgroup label="Tropical">
    <option value="mango">Mango</option>
    <option value="pineapple">Pineapple</option>
    <option value="papaya">Papaya</option>
    <option value="coconut">Coconut</option>
    <option value="passionfruit">Passionfruit</option>
  </optgroup>
  <optgroup label="Stone Fruits">
    <option value="peach">Peach</option>
    <option value="plum">Plum</option>
    <option value="cherry">Cherry</option>
    <option value="apricot">Apricot</option>
    <option value="nectarine">Nectarine</option>
  </optgroup>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select your favorite fruit" disabled>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" disabled>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select your favorite fruit" required>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" required>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select your favorite fruit" optional>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" optional>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const WidthMedium: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select your favorite fruit" width="md">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" width="md">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const WidthLarge: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select your favorite fruit" width="lg">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" width="lg">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select your favorite fruit">
        <label slot="description">This is a description slot</label>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit">
  <label slot="description">This is a description slot</label>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  render: () => {
    return html`
      <nys-combobox
        label="Select your favorite fruit"
        showError
        errorMessage="Please select a fruit"
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" showError errorMessage="Please select a fruit">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  render: () => {
    return html`
      <nys-combobox label="Select your favorite fruit" inverted>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" inverted>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const DisabledOptions: Story = {
  render: () => {
    return html`
      <nys-combobox
        label="Select your favorite fruit"
        description="Some fruits are out of season"
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry" disabled>Cherry (Out of season)</option>
        <option value="mango">Mango</option>
        <option value="strawberry" disabled>Strawberry (Out of season)</option>
        <option value="orange">Orange</option>
      </nys-combobox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" description="Some fruits are out of season">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="cherry" disabled>Cherry (Out of season)</option>
  <option value="mango">Mango</option>
  <option value="strawberry" disabled>Strawberry (Out of season)</option>
  <option value="orange">Orange</option>
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};
