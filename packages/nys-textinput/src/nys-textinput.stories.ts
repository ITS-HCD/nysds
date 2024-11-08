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
  size: string;
  step: string;
  min: string;
  max: string;
}

const meta: Meta<NysTextinputArgs> = {
  title: "Components/Textinput",
  component: "nys-textinput",
  argTypes: {},
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

export const Blank: Story = {
  args: {
    id: "",
    name: "",
    type: "",
    label: "",
    description: "",
    placeholder: "",
    value: "",
    disabled: false,
    readonly: false,
    required: false,
    form: "",
    pattern: "",
    maxlength: "",
    size: "",
    step: "",
    min: "",
    max: "",
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
      .size=${args.size}
      .step=${args.step}
      .min=${args.min}
      .max=${args.max}
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textinput></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const DifferentTypes: Story = {
  args: {},
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <nys-textinput
        type="text"
        placeholder="text"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="email"
        placeholder="email"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="number"
        placeholder="number"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="password"
        placeholder="password"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="search"
        placeholder="search"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="tel"
        placeholder="tel"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="url"
        placeholder="url"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="invalid"
        placeholder="invalid defaults to text"
        style="flex: 1;"
      ></nys-textinput>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textinput type="text" placeholder="text"></nys-textinput>
<nys-textinput type="email" placeholder="email"></nys-textinput>
<nys-textinput type="number" placeholder="number"></nys-textinput>
<nys-textinput type="password" placeholder="password"></nys-textinput>
<nys-textinput type="search" placeholder="search"></nys-textinput>
<nys-textinput type="tel" placeholder="tel"></nys-textinput>
<nys-textinput type="url" placeholder="url"></nys-textinput>
<nys-textinput type="invalid" placeholder="invalid defaults to text"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Labels: Story = {
  args: {},
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <nys-textinput label="Only Label" style="flex: 1;"></nys-textinput>
      <nys-textinput
        description="Only Description"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        label="Label"
        description="Description"
        style="flex: 1;"
      ></nys-textinput>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Only Label"></nys-textinput>
<nys-textinput description="Only Description"></nys-textinput>
<nys-textinput label="Label" description="Description"></nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const ValueAndPlaceholder: Story = {
  args: {},
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <nys-textinput value="beginning value" style="flex: 1;"></nys-textinput>
      <nys-textinput placeholder="placeholder" style="flex: 1;"></nys-textinput>
      <nys-textinput
        value="default value"
        placeholder="and a placeholder"
        style="flex: 1;"
      ></nys-textinput>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput value="beginning value"></nys-textinput>
<nys-textinput placeholder="placeholder"></nys-textinput>
<nys-textinput value="default value" placeholder="and a placeholder"></nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const DisabledAndReadonly: Story = {
  args: {},
  render: () => html`
    <nys-textinput disabled value="disabled"></nys-textinput>
    <br />
    <nys-textinput readonly value="readonly"></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput disabled value="disabled"></nys-textinput>
<nys-textinput readonly value="readonly"></nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const MaxMinAndStep: Story = {
  args: {},
  render: () => html`
    <nys-textinput type="number" min="0" max="100" step="10"></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput type="number" min="0" max="100" step="10"></nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const Maxlength: Story = {
  args: {},
  render: () => html` <nys-textinput maxlength="10"></nys-textinput> `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput maxlength="10"></nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const Pattern: Story = {
  args: {},
  render: () => html`
    <nys-textinput
      placeholder="N00000000"
      label="Please enter your Employee number"
      description="include the N prefix"
      maxlength="9"
      pattern="N[0-9]{8}"
      id="nID"
    ></nys-textinput>
  `,
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
  args: {},
  render: () =>
    html`<div style="display: flex; gap: 1rem; flex-wrap: wrap">
      <nys-textinput required label="label" style="flex:1"></nys-textinput>
      <nys-textinput required description="desc" style="flex:1"></nys-textinput>
      <nys-textinput
        required
        label="label"
        description="desc"
        style="flex:1"
      ></nys-textinput>
      <nys-textinput required style="flex:1"></nys-textinput>
    </div> `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput required></nys-textinput>        
`,
        type: "auto",
      },
    },
  },
};
