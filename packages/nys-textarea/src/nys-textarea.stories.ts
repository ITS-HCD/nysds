import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-textarea";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

// Define the structure of the args used in the stories
interface NysTextareaArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  placeholder: string;
  value: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  optional: boolean;
  form: string | null;
  maxlength: number | null;
  width: "sm" | "md" | "lg" | "full";
  rows: number;
  resize: "vertical" | "none";
  showError: boolean;
  errorMessage: string;
}

const meta: Meta<NysTextareaArgs> = {
  title: "Components/Textarea",
  component: "nys-textarea",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    form: { control: "text" },
    maxlength: { control: "text" },
    width: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      defaultValue: { summary: "full" },
    },
    rows: { control: "text", defaultValue: { summary: "4" } },
    resize: { control: "select", options: [undefined, "none"] },
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
type Story = StoryObj<NysTextareaArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    label: "Label",
    value: "",
    disabled: false,
    readonly: false,
    required: false,
    optional: false,
    showError: false,
  },
  render: (args) => html`
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textarea label="Label"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Width: Story = {
  args: { label: "This textarea is SM", value: "", width: "sm" },
  render: (args) => html`
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea width="sm" label="This textarea is SM"></nys-textarea>
        `,
        type: "auto",
      },
    },
  },
};

export const Rows: Story = {
  args: { label: "This textarea renders with 6 rows", value: "", rows: 6 },
  render: (args) => html`
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textarea label="This textarea renders with 6 rows" rows="6"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Resize: Story = {
  args: {
    label: "This textarea is not resizable",
    value: "",
    rows: 6,
    resize: "none",
  },
  render: (args) => html`
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textarea label="This textarea is not resizable" rows="6" resize="none"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  args: { label: "Label", description: "description", value: "" },
  render: (args) => html`
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${"Prop: " + args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>
    <br />
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <label slot="description">Slot: ${args.description}</label>
    </nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Label" description="Prop: description"></nys-textarea>
<nys-textarea label="Label">
  <label slot="description">Slot: description</label>
</nys-textarea>
        `,
        type: "auto",
      },
    },
  },
};

export const ValueAndPlaceholder: Story = {
  args: {
    label: "Beginning Value Example",
    value: "beginning value",
    placeholder: "placeholder",
  },
  render: (args) => html`
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea
  label="Beginning Value Example"
  value="beginning value"
  placeholder="placeholder">
</nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  args: { label: "Label", value: "", disabled: true },
  render: (args) => html`
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Label" disabled></nys-textarea>
        `,
        type: "auto",
      },
    },
  },
};

export const Readonly: Story = {
  args: { label: "Label", value: "", readonly: true },
  render: (args) => html`
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Label" readonly></nys-textarea>
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
    value: "",
    maxlength: 10,
  },
  render: (args) => html`
    <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea
  label="Max Length"
  description="You cannot type more than 10 characters in the below field"
  maxlength="10">
</nys-textarea>
        `,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  args: { label: "Label", value: "", required: true },
  render: (args) =>
    html` <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>`,
  parameters: {
    docs: {
      source: {
        code: `<nys-textarea required label="label"></nys-textarea>`,
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
    errorMessage: "A clear and concise error message.",
  },
  render: (args) =>
    html` <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea
  label="label"
  showError
  errorMessage="A clear and concise error message.">
</nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  args: {
    label: "Label",
    value: "",
    optional: true,
  },

  render: (args) =>
    html` <nys-textarea
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .optional=${args.optional}
      .form=${args.form}
      .maxlength=${args.maxlength}
      .width=${args.width}
      .rows=${args.rows}
      .resize=${args.resize}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    ></nys-textarea>`,

  parameters: {
    docs: {
      source: {
        code: `<nys-textarea optional label="label"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};
