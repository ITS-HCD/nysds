import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-combobox";
import "@nysds/nys-icon";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysComboboxArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  placeholder: string;
  value: string;
  disabled: boolean;
  required: boolean;
  optional: boolean;
  inverted: boolean;
  width: "md" | "lg" | "full";
  showError: boolean;
  errorMessage: string;
  form: string | null;
  tooltip: string;
}

const meta: Meta<NysComboboxArgs> = {
  title: "Components/Combobox",
  component: "nys-combobox",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    form: { control: "text" },
    inverted: { control: "boolean" },
    width: { control: "select", options: ["sm", "md", "lg", "full"] },
    showError: { control: "boolean" },
    errorMessage: { control: "text" },
    tooltip: { control: "text" },
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
    placeholder: "Type to search...",
    value: "",
    disabled: false,
    required: false,
    optional: false,
    showError: false,
    inverted: false,
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
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
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" placeholder="Type to search...">
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
  args: {
    label: "Select your favorite fruit",
    placeholder: "Type to search...",
    value: "mango",
    disabled: false,
    required: false,
    optional: false,
    showError: false,
    inverted: false,
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="mango" selected>Mango</option>
      <option value="orange">Orange</option>
      <option value="strawberry">Strawberry</option>
    </nys-combobox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" placeholder="Type to search..." value="mango">
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
  args: {
    label: "Select a fruit",
    description: "Fruits organized by category",
    placeholder: "Type to search...",
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
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
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox
  label="Select a fruit"
  description="Fruits organized by category"
  placeholder="Type to search..."
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
</nys-combobox>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    label: "Select your favorite fruit",
    placeholder: "Type to search...",
    value: "",
    disabled: true,
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
      <option value="strawberry">Strawberry</option>
    </nys-combobox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" placeholder="Type to search..." disabled>
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
  args: {
    label: "Select your favorite fruit",
    placeholder: "Type to search...",
    value: "",
    required: true,
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
      <option value="strawberry">Strawberry</option>
    </nys-combobox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" placeholder="Type to search..." required>
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
  args: {
    label: "Select your favorite fruit",
    placeholder: "Type to search...",
    value: "",
    optional: true,
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
      <option value="strawberry">Strawberry</option>
    </nys-combobox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" placeholder="Type to search..." optional>
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

export const Width: Story = {
  args: {
    label: "Select your favorite fruit",
    description: "Valid widths are sm, md, lg, and full",
    placeholder: "Type to search...",
    value: "",
    width: "md",
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
      <option value="strawberry">Strawberry</option>
    </nys-combobox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox
  label="Select your favorite fruit"
  description="Valid widths are sm, md, lg, and full"
  placeholder="Type to search..."
  width="sm"
>
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
  args: {
    label: "Select your favorite fruit",
    description: "This is a description slot",
    placeholder: "Type to search...",
    value: "",
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
    >
      <label slot="description">${args.description}</label>
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
      <option value="strawberry">Strawberry</option>
    </nys-combobox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" placeholder="Type to search...">
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
  args: {
    label: "Select your favorite fruit",
    placeholder: "Type to search...",
    value: "",
    showError: true,
    errorMessage: "Please select a fruit",
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
      <option value="strawberry">Strawberry</option>
    </nys-combobox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox
  label="Select your favorite fruit"
  placeholder="Type to search..."
  errorMessage="Please select a fruit"
  showError
>
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
  args: {
    label: "Select your favorite fruit",
    placeholder: "Type to search...",
    value: "",
    inverted: true,
  },
  render: (args) => html`
    <div
      style="display: flex; background-color: var(--nys-color-ink, #1b1b1b); padding: var(--nys-space-800, 64px);"
    >
      <nys-combobox
        .id=${args.id}
        .name=${args.name}
        .label=${args.label}
        .description=${args.description}
        .placeholder=${args.placeholder}
        .value=${args.value}
        .disabled=${args.disabled}
        .required=${args.required}
        .optional=${args.optional}
        ?inverted=${args.inverted}
        .form=${args.form}
        .width=${args.width}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
        .tooltip=${args.tooltip}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="strawberry">Strawberry</option>
      </nys-combobox>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox label="Select your favorite fruit" placeholder="Type to search..." inverted>
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
  args: {
    label: "Select your favorite fruit",
    description: "Some fruits are out of season",
    placeholder: "Type to search...",
  },
  render: (args) => html`
    <nys-combobox
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .tooltip=${args.tooltip}
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry" disabled>Cherry (Out of season)</option>
      <option value="mango">Mango</option>
      <option value="strawberry" disabled>Strawberry (Out of season)</option>
      <option value="orange">Orange</option>
    </nys-combobox>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-combobox
  label="Select your favorite fruit"
  description="Some fruits are out of season"
  placeholder="Type to search..."
>
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
