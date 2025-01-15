import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-select";

// Define the structure of the args used in the stories
interface NysSelectArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  value: string;
  disabled: boolean;
  required: boolean;
  form: string;
  width: string;
  options: string;
  showError: boolean;
  errorMessage: String;
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
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    form: { control: "text" },
    width: { control: "select", options: ["sm", "md", "lg", "full"] },
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
type Story = StoryObj<NysSelectArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    label: "Select your favorite borough",
    value: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
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
<nys-select label="Select your favorite borough">
  <nys-option value="bronx" label="The Bronx"></nys-option>
  <nys-option value="brooklyn" label="Brooklyn"></nys-option>
  <nys-option value="manhattan" label="Manhattan"></nys-option>
  <nys-option value="staten_island" label="Staten Island"></nys-option>
  <nys-option value="queens" label="Queens"></nys-option>      
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const OptionsLabelSlot: Story = {
  args: {
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "",
    value: "",
    disabled: false,
    required: false,
    form: "",
    width: "",
    showError: false,
    errorMessage: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <nys-option value="bronx">The Bronx</nys-option>
      <nys-option value="brooklyn">Brooklyn</nys-option>
      <nys-option value="manhattan">Manhattan</nys-option>
      <nys-option value="staten_island">Staten Island</nys-option>
      <nys-option value="queens">Queens</nys-option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough">
  <nys-option value="bronx">The Bronx</nys-option>
  <nys-option value="brooklyn">Brooklyn</nys-option>
  <nys-option value="manhattan">Manhattan</nys-option>
  <nys-option value="staten_island">Staten Island</nys-option>
  <nys-option value="queens">Queens</nys-option>   
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  args: {
    label: "Select your favorite borough",
    description: "This is a slot",
    value: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <label slot="description">${args.description}</label>
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough">
  <label slot="description">This is a slot</label>
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>        
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    label: "Select your favorite borough",
    value: "",
    disabled: true,
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
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
<nys-select label="Select your favorite borough" disabled>
  <nys-option value="bronx" label="The Bronx"></nys-option>
  <nys-option value="brooklyn" label="Brooklyn"></nys-option>
  <nys-option value="manhattan" label="Manhattan"></nys-option>
  <nys-option value="staten_island" label="Staten Island"></nys-option>
  <nys-option value="queens" label="Queens"></nys-option>  
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  args: {
    label: "Select your favorite borough",
    value: "",
    required: true,
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
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
<nys-select label="Select your favorite borough" required>
  <nys-option value="bronx" label="The Bronx"></nys-option>
  <nys-option value="brooklyn" label="Brooklyn"></nys-option>
  <nys-option value="manhattan" label="Manhattan"></nys-option>
  <nys-option value="staten_island" label="Staten Island"></nys-option>
  <nys-option value="queens" label="Queens"></nys-option>  
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Width: Story = {
  args: {
    label: "Select your favorite borough",
    description: "Valid widths are sm, md, lg, and full",
    value: "",
    width: "sm",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
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
<nys-select 
  label="Select your favorite borough"
  description="Valid widths are sm, md, lg, and full"
  width="xs"
>
  <nys-option value="bronx" label="The Bronx"></nys-option>
  <nys-option value="brooklyn" label="Brooklyn"></nys-option>
  <nys-option value="manhattan" label="Manhattan"></nys-option>
  <nys-option value="staten_island" label="Staten Island"></nys-option>
  <nys-option value="queens" label="Queens"></nys-option>  
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  args: {
    label: "Select your favorite borough",
    value: "",
    showError: true,
    errorMessage: "This is an error message",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
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
<nys-select 
  label="Select your favorite borough"
  errorMessage="This is an error message"
  showError
>
  <nys-option value="bronx" label="The Bronx"></nys-option>
  <nys-option value="brooklyn" label="Brooklyn"></nys-option>
  <nys-option value="manhattan" label="Manhattan"></nys-option>
  <nys-option value="staten_island" label="Staten Island"></nys-option>
  <nys-option value="queens" label="Queens"></nys-option>  
</nys-select>`,
        type: "auto",
      },
    },
  },
};
