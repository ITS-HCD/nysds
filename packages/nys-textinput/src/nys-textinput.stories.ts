import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-textinput";
import "@nys-excelsior/nys-checkbox";
import "@nys-excelsior/nys-select";

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
    label: "Label",
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
        code: `<nys-textinput label="Label"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Size: Story = {
  args: {},
  render: () => html`
    <div>
      <nys-textinput size="xs" label="XS"></nys-textinput>
      <br />
      <nys-textinput size="sm" label="SM"></nys-textinput>
      <br />
      <nys-textinput size="md" label="MD (default)"></nys-textinput>
      <br />
      <nys-textinput size="lg" label="LG"></nys-textinput>
      <br />
      <nys-textinput size="xl" label="XL"></nys-textinput>
    </div>
    <nys-checkbox
      label="Subscribe to NYS Government Updates"
      description="Get notified via email about important updates and services."
      id="subscribe-checkbox-disabled-checked"
      name="subscribe"
      value="email-updates"
      required
    ></nys-checkbox>
    <nys-select label="Select your favorite borough">
      <nys-option value="bronx" label="The Bronx"></nys-option>
      <nys-option value="brooklyn" label="Brooklyn"></nys-option>
      <nys-option value="manhattan" label="Manhattan"></nys-option>
      <nys-option value="staten_island" label="Staten Island"></nys-option>
      <nys-option value="queens" label="Queens"></nys-option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput size="xs" label="XS"></nys-textinput>
<nys-textinput size="sm" label="SM"></nys-textinput>
<nys-textinput size="md" label="MD (default)"></nys-textinput>
<nys-textinput size="lg" label="LG"></nys-textinput>
<nys-textinput size="xl" label="XL"></nys-textinput>
        `,
        type: "auto",
      },
    },
  },
};

export const DifferentTypes: Story = {
  args: {},
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <nys-textinput type="text" label="text" style="flex: 1;"></nys-textinput>
      <nys-textinput
        type="email"
        label="email"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="number"
        label="number"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="password"
        label="password"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        type="search"
        label="search"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput type="tel" label="tel" style="flex: 1;"></nys-textinput>
      <nys-textinput type="url" label="url" style="flex: 1;"></nys-textinput>
      <nys-textinput
        type="invalid"
        label="invalid defaults to text"
        style="flex: 1;"
      ></nys-textinput>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textinput type="text" label="text"></nys-textinput>
<nys-textinput type="email" label="email"></nys-textinput>
<nys-textinput type="number" label="number"></nys-textinput>
<nys-textinput type="password" label="password"></nys-textinput>
<nys-textinput type="search" label="search"></nys-textinput>
<nys-textinput type="tel" label="tel"></nys-textinput>
<nys-textinput type="url" label="url"></nys-textinput>
<nys-textinput type="invalid" label="invalid defaults to text"></nys-textinput>`,
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
      <nys-textinput
        label="Beginning Value Example"
        value="beginning value"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        label="Placeholder Example"
        placeholder="placeholder"
        style="flex: 1;"
      ></nys-textinput>
      <nys-textinput
        label="Placeholder and Default Value Example"
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
<nys-textinput 
  label="Beginning Value Example"
  value="beginning value">
</nys-textinput>
<nys-textinput
  label="Placeholder Example"
  placeholder="placeholder">
</nys-textinput>
<nys-textinput 
  label="Placeholder and Default Value Example" 
  value="default value" 
  placeholder="and a placeholder">
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
  args: {},
  render: () => html`
    <nys-textinput
      label="Max/Min Example"
      description="Must be between 0 and 100"
      type="number"
      min="0"
      max="100"
      step="10"
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
  args: {},
  render: () => html`
    <nys-textinput
      label="Max Length"
      description="You cannot type more than 10 characters in the below field"
      maxlength="10"
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
  args: {},
  render: () => {
    let patternStatus = "Pattern match: false"; // Initial status
    return html`
      <nys-textinput
        placeholder="N00000000"
        label="Please enter your Employee number"
        description="include the N prefix"
        maxlength="9"
        pattern="N[0-9]{8}"
        id="nID"
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
  args: {},
  render: () =>
    html`<div style="display: flex; gap: 1rem; flex-wrap: wrap">
      <nys-textinput required label="label" style="flex:1"></nys-textinput>
      <nys-textinput
        required
        label="label"
        description="desc"
        style="flex:1"
      ></nys-textinput>
    </div> `,
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
