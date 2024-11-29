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
  clearable: boolean;
  size: string;
  options: string[];
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

export const Blank: Story = {
  args: {
    id: "",
    name: "",
    label: "Select your favorite borough",
    description: "",
    placeholder: "",
    value: "",
    disabled: false,
    required: false,
    form: "",
    clearable: false,
    size: "",
    options: ["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"],
    errorMessage: "",
  },
  render: (args) => html`
    <nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .placeholder=${args.placeholder}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .form=${args.form}
      .clearable=${args.clearable}
      .size=${args.size}
      .options=${args.options}
      .errorMessage=${args.errorMessage}
    ></nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select 
  label="Select your favorite borough"
  options=["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  args: {},
  render: () => html`
    <nys-select
      .label=${"Select your favorite borough"}
      .value=${"Brooklyn"}
      .options=${[
        "The Bronx",
        "Brooklyn",
        "Manhattan",
        "Queens",
        "Staten Island",
      ]}
      disabled
    ></nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select 
  label="Select your favorite borough"
  options=["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]
  value="Brooklyn"
  disabled
></nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  args: {},
  render: () => html`
    <nys-select
      .label=${"Select your favorite borough"}
      .options=${[
        "The Bronx",
        "Brooklyn",
        "Manhattan",
        "Queens",
        "Staten Island",
      ]}
      required
    ></nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select 
  label="Select your favorite borough"
  options=["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]
  required>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Size: Story = {
  args: {},
  render: () => html`
    <nys-select
      .label=${"Select your favorite borough"}
      size="xs"
      .options=${[
        "The Bronx",
        "Brooklyn",
        "Manhattan",
        "Queens",
        "Staten Island",
      ]}
    ></nys-select
    ><br />
    <nys-select
      .label=${"Select your favorite borough"}
      size="sm"
      .options=${[
        "The Bronx",
        "Brooklyn",
        "Manhattan",
        "Queens",
        "Staten Island",
      ]}
    ></nys-select
    ><br />
    <nys-select
      .label=${"Select your favorite borough"}
      size="md"
      .options=${[
        "The Bronx",
        "Brooklyn",
        "Manhattan",
        "Queens",
        "Staten Island",
      ]}
    ></nys-select
    ><br />
    <nys-select
      .label=${"Select your favorite borough"}
      size="lg"
      .options=${[
        "The Bronx",
        "Brooklyn",
        "Manhattan",
        "Queens",
        "Staten Island",
      ]}
    ></nys-select
    ><br />
    <nys-select
      .label=${"Select your favorite borough"}
      size="xl"
      .options=${[
        "The Bronx",
        "Brooklyn",
        "Manhattan",
        "Queens",
        "Staten Island",
      ]}
    ></nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select 
  label="Select your favorite borough"
  size="xs"
  options=["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]>
</nys-select>
<nys-select 
  label="Select your favorite borough"
  size="sm"
  options=["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]>
</nys-select>
<nys-select 
  label="Select your favorite borough"
  size="md"
  options=["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]>
</nys-select>
<nys-select 
  label="Select your favorite borough"
  size="lg"
  options=["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]>
</nys-select>
<nys-select 
  label="Select your favorite borough"
  size="xl"
  options=["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]>
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
      .label=${"Select your favorite borough"}
      .options=${[
        "The Bronx",
        "Brooklyn",
        "Manhattan",
        "Queens",
        "Staten Island",
      ]}
      .errorMessage=${"This is an error message"}
    ></nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select 
  label="Select your favorite borough"
  errorMessage="This is an error message"
  options=["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]>
</nys-select>`,
        type: "auto",
      },
    },
  },
};
