import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-select";

// Define the structure of the args used in the stories
interface NysSelectArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  placeholder: string;
  value: string;
  disabled: boolean;
  required: boolean;
  form: string;
  size: string;
  options: string;
  errorMessage: String;
}

const meta: Meta<NysSelectArgs> = {
  title: "Components/Select",
  component: "nys-select",
  argTypes: {},
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
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "",
    value: "",
    disabled: false,
    required: false,
    form: "",
    size: "",
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
      .size=${args.size}
      .errorMessage=${args.errorMessage}
    >
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
  args: {},
  render: () => html`
    <nys-select label=${"Select your favorite borough"} disabled>
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
<nys-select label="Select your favorite borough" disabled>
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

export const Required: Story = {
  args: {},
  render: () => html`
    <nys-select label=${"Select your favorite borough"} required>
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
<nys-select label="Select your favorite borough" required>
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

export const Size: Story = {
  args: {},
  render: () => html`
    <nys-select .label=${"Select your favorite borough"} size="xs">
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option></nys-select
    ><br />
    <nys-select .label=${"Select your favorite borough"} size="sm">
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option></nys-select
    ><br />
    <nys-select .label=${"Select your favorite borough"} size="md">
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option></nys-select
    ><br />
    <nys-select .label=${"Select your favorite borough"} size="lg">
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option> </nys-select
    ><br />
    <nys-select .label=${"Select your favorite borough"} size="xl">
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
<nys-select label="Select your favorite borough" size="xs">
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>
</nys-select>
<nys-select label="Select your favorite borough"size="sm">
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>
</nys-select>
<nys-select label="Select your favorite borough"size="md">
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>
</nys-select>
<nys-select label="Select your favorite borough"size="lg"
  <option value="bronx">The Bronx</option>
  <option value="brooklyn">Brooklyn</option>
  <option value="manhattan">Manhattan</option>
  <option value="staten_island">Staten Island</option>
  <option value="queens">Queens</option>
</nys-select>
<nys-select label="Select your favorite borough"size="xl">
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

export const ErrorMessage: Story = {
  args: {},
  render: () => html`
    <nys-select
      label=${"Select your favorite borough"}
      errorMessage=${"This is an error message"}
    >
      <option value="bronx">The Bronx</option>
      <option value="brooklyn">Brooklyn</option>
      <option value="manhattan">Manhattan</option>
      <option value="staten_island">Staten Island</option>
      <option value="queens">Queens</option></nys-select
    >
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select 
  label="Select your favorite borough"
  errorMessage="This is an error message"
>
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
