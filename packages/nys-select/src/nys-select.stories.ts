import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-select";
import "@nysds/nys-icon";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

// Define the structure of the args used in the stories
interface NysSelectArgs {
  id: string;
  name: string;
  label: string;
  description: string;
  value: string;
  disabled: boolean;
  required: boolean;
  optional: boolean;
  inverted: boolean;
  width: "sm" | "md" | "lg" | "full";
  options: string;
  showError: boolean;
  errorMessage: string;
  form: string | null;
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
    optional: { control: "boolean" },
    form: { control: "text" },
    inverted: { control: "boolean" },
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
    disabled: false,
    required: false,
    optional: false,
    showError: false,
    inverted: false,
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
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx" label="The Bronx"></option>
      <option value="brooklyn" label="Brooklyn"></option>
      <option value="manhattan" label="Manhattan"></option>
      <option value="staten_island" label="Staten Island"></option>
      <option value="queens" label="Queens"></option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough">
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const DefaultValue: Story = {
  args: {
    label: "Select your favorite borough",
    value: "",
    disabled: false,
    required: false,
    optional: false,
    showError: false,
    inverted: false,
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
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx" label="The Bronx"></option>
      <option value="brooklyn" label="Brooklyn" selected></option>
      <option value="manhattan" label="Manhattan"></option>
      <option value="staten_island" label="Staten Island"></option>
      <option value="queens" label="Queens"></option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough">
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn" selected></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const OptionGroup: Story = {
  args: {
    label: "Which New York State service are you contacting us about?",
    description:
      "This is for demo purposes and the list might not be exhaustive.",
  },
  render: (args) =>
    html`<nys-select
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .value=${args.value}
      .disabled=${args.disabled}
      .required=${args.required}
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <option disabled selected></option>
      <optgroup label="Transportation Services">
        <option value="mta">MTA / Public Transit</option>
        <option value="dmv">Department of Motor Vehicles (DMV)</option>
        <option value="highway">Highway Maintenance</option>
      </optgroup>

      <optgroup label="Health & Human Services">
        <option value="medicaid">Medicaid / Health Insurance</option>
        <option value="mental-health">Mental Health Support</option>
        <option value="child-family">Child and Family Services</option>
      </optgroup>

      <optgroup label="Public Safety">
        <option value="state-police">State Police</option>
        <option value="emergency-management">Emergency Management</option>
        <option value="fire-safety">Fire Safety</option>
      </optgroup>

      <optgroup label="Environment & Energy">
        <option value="environmental-conservation">
          Environmental Conservation
        </option>
        <option value="clean-energy">Clean Energy Programs</option>
        <option value="waste-management">Waste Management</option>
      </optgroup>
    </nys-select>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough">

</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const OptionsLabelSlot: Story = {
  args: {
    label: "Select your favorite borough",
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
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
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
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx" label="The Bronx"></option>
      <option value="brooklyn" label="Brooklyn"></option>
      <option value="manhattan" label="Manhattan"></option>
      <option value="staten_island" label="Staten Island"></option>
      <option value="queens" label="Queens"></option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" disabled>
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
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
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx" label="The Bronx"></option>
      <option value="brooklyn" label="Brooklyn"></option>
      <option value="manhattan" label="Manhattan"></option>
      <option value="staten_island" label="Staten Island"></option>
      <option value="queens" label="Queens"></option>
    </nys-select>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" required>
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  args: {
    label: "Select your favorite borough",
    value: "",
    optional: true,
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
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx" label="The Bronx"></option>
      <option value="brooklyn" label="Brooklyn"></option>
      <option value="manhattan" label="Manhattan"></option>
      <option value="staten_island" label="Staten Island"></option>
      <option value="queens" label="Queens"></option>
    </nys-select>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" optional>
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
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
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx" label="The Bronx"></option>
      <option value="brooklyn" label="Brooklyn"></option>
      <option value="manhattan" label="Manhattan"></option>
      <option value="staten_island" label="Staten Island"></option>
      <option value="queens" label="Queens"></option>
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
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
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
      .optional=${args.optional}
      ?inverted=${args.inverted}
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
      .optional=${args.optional}
      ?inverted=${args.inverted}
      .form=${args.form}
      .width=${args.width}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <option value="bronx" label="The Bronx"></option>
      <option value="brooklyn" label="Brooklyn"></option>
      <option value="manhattan" label="Manhattan"></option>
      <option value="staten_island" label="Staten Island"></option>
      <option value="queens" label="Queens"></option>
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
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  args: {
    label: "Select your favorite borough",
    value: "",
    inverted: true,
  },
  render: (args) => html`
    <div
      style="display: flex; background-color: var(--nys-color-ink, #1b1b1b); padding: var(--nys-space-800, 64px);"
    >
      <nys-select
        .id=${args.id}
        .name=${args.name}
        .label=${args.label}
        .description=${args.description}
        .value=${args.value}
        .disabled=${args.disabled}
        .required=${args.required}
        .optional=${args.optional}
        ?inverted=${args.inverted}
        .form=${args.form}
        .width=${args.width}
        .showError=${args.showError}
        .errorMessage=${args.errorMessage}
      >
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" inverted>
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};
