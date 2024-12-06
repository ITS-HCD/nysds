import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-textarea";

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
  form: string;
  maxlength: string;
  size: string;
  rows: string;
  resize: string;
  errorMessage: string;
}

const meta: Meta<NysTextareaArgs> = {
  title: "Components/Textarea",
  component: "nys-textarea",
  argTypes: {},
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

export const Blank: Story = {
  args: {
    id: "",
    name: "",
    label: "Label",
    description: "",
    placeholder: "",
    value: "",
    disabled: false,
    readonly: false,
    required: false,
    form: "",
    maxlength: "",
    size: "",
    rows: "",
    resize: "",
    errorMessage: "",
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
      .form=${args.form}
      .maxlength=${args.maxlength}
      .size=${args.size}
      .rows=${args.rows}
      .resize=${args.resize}
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

export const Size: Story = {
  args: {},
  render: () => html`
    <div>
      <nys-textarea size="xs" label="XS"></nys-textarea>
      <br />
      <nys-textarea size="sm" label="SM"></nys-textarea>
      <br />
      <nys-textarea size="md" label="MD (default)"></nys-textarea>
      <br />
      <nys-textarea size="lg" label="LG"></nys-textarea>
      <br />
      <nys-textarea size="xl" label="XL"></nys-textarea>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea size="xs" label="XS"></nys-textarea>
<nys-textarea size="sm" label="SM"></nys-textarea>
<nys-textarea size="md" label="MD (default)"></nys-textarea>
<nys-textarea size="lg" label="LG"></nys-textarea>
<nys-textarea size="xl" label="XL"></nys-textarea>
        `,
        type: "auto",
      },
    },
  },
};

export const Rows: Story = {
  args: {},
  render: () => html`
    <nys-textarea label="This textarea renders with 4 rows" rows="4">
    </nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textarea label="This textarea renders with 4 rows" rows="4"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Resize: Story = {
  args: {},
  render: () => html`
    <nys-textarea label="This textarea is not resizable" rows="4" resize="none">
    </nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textarea label="This textarea is not resizable" rows="4" resize="none"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Labels: Story = {
  args: {},
  render: () => html`
    <nys-textarea label="Label"></nys-textarea>
    <br />
    <nys-textarea
      label="Label"
      description="Description as prop"
    ></nys-textarea>
    <br />
    <nys-textarea label="Label">
      <p slot="description">
        Description as slot
        <a href="https://www.ny.gov/" target="_blank">learn more</a>
      </p>
    </nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Label"></nys-textarea>
<nys-textarea label="Label" description="Description as prop"></nys-textarea>
<nys-textarea label="Label">
  <p slot="description">
    Description as slot 
    <a href="https://www.ny.gov/" target="_blank">learn more</a>
  </p>
</nys-textarea>
        `,
        type: "auto",
      },
    },
  },
};

export const ValueAndPlaceholder: Story = {
  args: {},
  render: () => html`
    <nys-textarea
      label="Beginning Value Example"
      value="beginning value"
    ></nys-textarea>
    <br />
    <nys-textarea
      label="Placeholder Example"
      placeholder="placeholder"
    ></nys-textarea
    ><br />
    <nys-textarea
      label="Placeholder and Default Value Example"
      value="default value"
      placeholder="and a placeholder"
    ></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea 
  label="Beginning Value Example"
  value="beginning value">
</nys-textarea>
<nys-textarea
  label="Placeholder Example"
  placeholder="placeholder">
</nys-textarea>
<nys-textarea 
  label="Placeholder and Default Value Example" 
  value="default value" 
  placeholder="and a placeholder">
</nys-textarea>
        `,
        type: "auto",
      },
    },
  },
};

export const DisabledAndReadonly: Story = {
  args: {},
  render: () => html`
    <nys-textarea label="Disabled" disabled></nys-textarea>
    <br />
    <nys-textarea label="Read Only" readonly></nys-textarea>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Disabled" disabled></nys-textarea>
<nys-textarea label="Read Only" readonly></nys-textarea>
        `,
        type: "auto",
      },
    },
  },
};

export const Maxlength: Story = {
  args: {},
  render: () => html`
    <nys-textarea
      label="Max Length"
      description="You cannot type more than 10 characters in the below field"
      maxlength="10"
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
  args: {},
  render: () => html` <nys-textarea required label="label"></nys-textarea>`,
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
  args: {},
  render: () =>
    html` <nys-textarea
      label="label"
      errorMessage="A clear and concise error message."
    ></nys-textarea>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea 
  label="label"
  errorMessage="A clear and concise error message.">
</nys-textarea>`,
        type: "auto",
      },
    },
  },
};
