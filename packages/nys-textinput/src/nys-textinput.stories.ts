import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-textinput";

// Define the structure of the args used in the stories
interface NysTextinputArgs {
  id: string;
  name: string;
  type: string;
  label: string;
  description: string;
  placeholder: string;
  value: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  form: string;
  pattern: string;
  maxlength: string;
  width: string;
  step: string;
  min: string;
  max: string;
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
    form: { control: "text" },
    pattern: { control: "text" },
    maxlength: { control: "text" },
    width: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      defaultValue: { summary: "md" },
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
        code: `<nys-textinput label="Label"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Width: Story = {
  args: { label: "This label is extra small", width: "sm", value: "" },
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
  width="sm" 
  label="This label is extra small"
></nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const DifferentTypes: Story = {
  args: { label: "Password:", type: "password", value: "" },
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
  type="password" 
  label="Password:"
`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  args: { label: "Label", description: "description", value: "" },
  render: (args) => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <nys-textinput
        .id=${args.id}
        .name=${args.name}
        .type=${args.type}
        .label=${args.label}
        .description="Prop: ${args.description}"
        .placeholder=${args.placeholder}
        .value=${args.value}
        .disabled=${args.disabled}
        .readonly=${args.readonly}
        .required=${args.required}
        .form=${args.form}
        .pattern=${args.pattern}
        .maxlength=${args.maxlength}
        .width=${args.width}
        .step=${args.step}
        .min=${args.min}
        .max=${args.max}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        .id=${args.id}
        .name=${args.name}
        .type=${args.type}
        .label=${args.label}
        .placeholder=${args.placeholder}
        .value=${args.value}
        .disabled=${args.disabled}
        .readonly=${args.readonly}
        .required=${args.required}
        .form=${args.form}
        .pattern=${args.pattern}
        .maxlength=${args.maxlength}
        .width=${args.width}
        .step=${args.step}
        .min=${args.min}
        .max=${args.max}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
        style="flex: 1;"
      >
        <label slot="description">Slot: ${args.description}</label>
      </nys-textinput>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput 
  label="Label" 
  description="Prop: description"
></nys-textinput>
<nys-textinput 
  label="Label"
>
  <label slot="description">Slot: description</label>
</nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const ValueAndPlaceholder: Story = {
  args: {
    label: "Label",
    value: "initial value",
    placeholder: "this is a placeholder",
  },
  render: (args) => html`
    <nys-textinput
      label=${args.label}
      value=${args.value}
      placeholder=${args.placeholder}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput 
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

export const DisabledAndReadonly: Story = {
  args: {},
  render: () => html`
    <nys-textinput label="Disabled" disabled></nys-textinput>
    <br />
    <nys-textinput label="Read Only" readonly></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Disabled" disabled></nys-textinput>
<nys-textinput label="Read Only" readonly></nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const MaxMinAndStep: Story = {
  args: {
    label: "Max/Min Example",
    description: "Must be between 0 and 100",
    type: "number",
    min: "0",
    max: "100",
    step: "10",
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
    label: "Max Length",
    description: "You cannot type more than 10 characters in the below field",
    maxlength: "10",
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
    placeholder: "N00000000",
    label: "Please enter your Employee number",
    description: "include the N prefix",
    maxlength: "9",
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
        .form=${args.form}
        .pattern=${args.pattern}
        .maxlength=${args.maxlength}
        .width=${args.width}
        .step=${args.step}
        .min=${args.min}
        .max=${args.max}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
        @nys-checkValidity=${(event: CustomEvent) => {
          // Update the pattern status text based on the validity
          patternStatus = `Pattern match: ${event.detail.checkValidity}`;
          // Re-render with the updated pattern status
          document.getElementById("pattern-check")!.textContent = patternStatus;
        }}
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
  args: { required: true, label: "label", description: "desc", value: "" },
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
<nys-textinput required label="label"></nys-textinput>
<nys-textinput required label="label" description="desc"></nys-textinput>      
`,
        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  args: {
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
  label="Label"
  showError
  errorMessage="Cannot be left blank"
></nys-textinput>`,
        type: "auto",
      },
    },
  },
};
