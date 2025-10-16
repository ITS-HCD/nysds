import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-textinput";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-button";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysTextinputArgs {
  id: string;
  name: string;
  type: "number" | "text" | "email" | "password" | "search" | "tel" | "url";
  label: string;
  description: string;
  placeholder: string;
  value: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  optional: boolean;
  invert: boolean;
  form: string | null;
  pattern: string;
  maxlength: number | null;
  width: "sm" | "md" | "lg" | "full";
  step: number | null;
  min: number | null;
  max: number | null;
  showError: boolean;
  errorMessage: string;
}

const meta: Meta<NysTextinputArgs> = {
  title: "Components/Textinput",
  component: "nys-textinput",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    type: {
      control: "select",
      options: ["email", "number", "password", "search", "tel", "text", "url"],
    },
    label: { control: "text" },
    description: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    invert: { control: "boolean" },
    form: { control: "text" },

    pattern: { control: "text" },
    maxlength: { control: "text" },
    width: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      defaultValue: { summary: "full" },
    },
    step: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    showError: { control: "boolean" },
    errorMessage: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysTextinputArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    label: "Label",
    value: "",
    name: "myTextInputDemo",
    disabled: false,
    readonly: false,
    required: false,
    optional: false,
    showError: false,
    invert: false,
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textinput label="Label" name="myTextInputDemo"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Width: Story = {
  args: {
    label: "This label is extra small",
    width: "sm",
    value: "",
    name: "myTextInput",
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="myTextInput"
  width="sm"
  label="This label is extra small"
></nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const Password: Story = {
  args: {
    label: "Password:",
    type: "password",
    value: "",
    name: "myTextInput1",
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="myTextInput1"
  type="password"
  label="Password:"
>
</nys-textinput>
`,
        type: "auto",
      },
    },
  },
};
export const SlottedButton: Story = {
  args: {
    type: "search",
    placeholder: "Search",
    value: "",
    name: "searchInput",
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <nys-button
        slot="endButton"
        type="submit"
        label="Search"
        prefixIcon="search"
      ></nys-button>
    </nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="searchInput"
  type="search"
  placeholder="Search"
>
  <nys-button
  slot="endButton"
  type="submit"
  label="Search"
  prefixIcon="search"
></nys-button>
</nys-textinput>
`,
        type: "auto",
      },
    },
  },
};

export const ValueAndPlaceholder: Story = {
  args: {
    name: "myTextInput2",
    label: "Label",
    value: "initial value",
    placeholder: "this is a placeholder",
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="myTextInput2"
  label="Label"
  value="initial value"
  placeholder="this is a placeholder">
</nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    name: "myTextInput3",
    label: "Disabled",
    disabled: true,
    value: "",
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .type=${args.type}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput name="myTextInput3" label="Disabled" disabled></nys-textinput>
`,
        type: "auto",
      },
    },
  },
};

export const Readonly: Story = {
  args: {
    name: "myTextInput4",
    label: "Read Only",
    readonly: true,
    value: "You cannot edit me",
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .type=${args.type}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="myTextInput4"
  label="Read Only"
  value="You cannot edit me"
  readonly
></nys-textinput>
`,
        type: "auto",
      },
    },
  },
};

export const MaxMinAndStep: Story = {
  args: {
    name: "myTextInput5",
    label: "Max/Min Example",
    description: "Must be between 0 and 100",
    type: "number",
    min: 0,
    max: 100,
    step: 10,
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="myTextInput5"
  label="Max/Min Example"
  description="Must be between 0 and 100"
  type="number"
  min="0"
  max="100"
  step="10">
</nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const Maxlength: Story = {
  args: {
    name: "myTextInput6",
    label: "Max Length",
    description: "You cannot type more than 10 characters in the below field",
    maxlength: 10,
    value: "",
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="myTextInput6"
  label="Max Length"
  description="You cannot type more than 10 characters in the below field"
  maxlength="10">
</nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const Pattern: Story = {
  args: {
    name: "emplId",
    placeholder: "N00000000",
    label: "Please enter your Employee number",
    description: "include the N prefix",
    maxlength: 9,
    pattern: "N[0-9]{8}",
    id: "nID",
    value: "",
  },
  render: (args) => {
    let patternStatus = "Pattern match: false"; // Initial status
    return html`
      <nys-textinput
        .id=${args.id}
        .name=${args.name}
        .type=${args.type}
        .label=${args.label}
        .description=${args.description}
        .placeholder=${args.placeholder}
        .value=${args.value}
        .disabled=${args.disabled}
        .readonly=${args.readonly}
        .required=${args.required}
        .optional=${args.optional}
        ?invert=${args.invert}
        .form=${args.form}
        .pattern=${args.pattern}
        .maxlength=${args.maxlength}
        .width=${args.width}
        .step=${args.step}
        .min=${args.min}
        .max=${args.max}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
      ></nys-textinput>
      <div id="pattern-check" style="font-family: Arial; padding-top: 1rem;">
        ${patternStatus}
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="emplId"
  placeholder="N00000000"
  label="Please enter your Employee number"
  description="include the N prefix"
  maxlength="9"
  pattern="N[0-9]{8}"
  id="nID"
></nys-textinput>
`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  args: { name: "myTextInput7", required: true, label: "label", value: "" },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textinput name="myTextInput7" required label="label"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  args: {
    label: "Label",
    description: "Prop: description",
    value: "",
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      name="descriptionProp"
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
    <br />
    <nys-textinput
      .id=${args.id}
      name="descriptionSlot"
      .type=${args.type}
      .label=${args.label}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <label slot="description">Slot: description</label>
    </nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="descriptionProp"
  label="Label"
  description="Slot: description"
></nys-textinput>
<nys-textinput name="descriptionSlot" label="Label">
  <label slot="description">Slot: description</label>
</nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  args: {
    name: "myTextInput8",
    label: "Label",
    value: "",
    showError: true,
    errorMessage: "Cannot be left blank",
  },
  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="myTextInput8"
  label="Label"
  showError
  errorMessage="Cannot be left blank"
></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  args: {
    name: "myTextInput7",
    label: "label",
    value: "",
    optional: true,
  },

  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,

  parameters: {
    docs: {
      source: {
        code: `<nys-textinput name="myTextInput7" optional label="label"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Telephone: Story = {
  args: {
    label: "Phone Number",
    value: "",
    name: "myTextInputDemo",
    type: "tel",
  },

  render: (args) => html`
    <nys-textinput
      .id=${args.id}
      .name=${args.name}
      .type=${args.type}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      ?invert=${args.invert}
      .form=${args.form}
      .pattern=${args.pattern}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textinput>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="myTextInputDemo"
  label="Phone Number"
  type="tel"
>
</nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Invert: Story = {
  args: {
    label: "Label",
    description: "Prop: description",
    value: "",
    invert: true,
  },
  render: (args) => html`
    <div
      style="display: flex; background-color: var(--nys-color-ink, #1b1b1b); padding: var(--nys-space-800, 64px);"
    >
      <nys-textinput
        .id=${args.id}
        name="descriptionProp"
        .type=${args.type}
        .label=${args.label}
        .description=${args.description}
        .placeholder=${args.placeholder}
        .value=${args.value}
        .disabled=${args.disabled}
        .readonly=${args.readonly}
        .required=${args.required}
        .optional=${args.optional}
        ?invert=${args.invert}
        .form=${args.form}
        .pattern=${args.pattern}
        .maxlength=${args.maxlength}
        .width=${args.width}
        .step=${args.step}
        .min=${args.min}
        .max=${args.max}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
      ></nys-textinput>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  name="descriptionProp"
  label="Label"
  description="Slot: description"
  invert
></nys-textinput>`,
        type: "auto",
      },
    },
  },
};
