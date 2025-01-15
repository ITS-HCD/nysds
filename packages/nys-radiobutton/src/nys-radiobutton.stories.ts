import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-radiobutton";
import "./nys-radiogroup";

// Define the structure of the args used in the stories
interface NysRadiobuttonArgs {
  //radiobutton
  id: string;
  name: string;
  checked: boolean;
  label: string;
  description: string;
  size: string;
  disabled: boolean;
  value: string;
  form: string;
  //radiogroup - not including id, name, label, description
  required: boolean;
  showError: boolean;
  errorMessage: string;
}

const meta: Meta<NysRadiobuttonArgs> = {
  title: "Components/Radiobutton",
  component: "nys-radiobutton",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    checked: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    size: { control: "select", options: ["sm", "md"] },
    disabled: { control: "boolean" },
    value: { control: "text" },
    form: { control: "text" },
    required: { control: "boolean" },
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
type Story = StoryObj<NysRadiobuttonArgs>;

// Define stories without using args

// Story: Basic
export const Basic: Story = {
  args: {
    name: "office",
    label: "Albany",
    description: "Upstate New York",
    value: "albany",
    size: "md",
  },
  render: (args) => html`
    <nys-radiogroup
      label="What is your primary work location?"
      description="This is the location you use for your in office days."
      size=${args.size}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .required=${args.required}
    >
      <nys-radiobutton
        .name=${args.name}
        .checked=${args.checked}
        .label=${args.label}
        .description=${args.description}
        .disabled=${args.disabled}
        .value=${args.value}
      ></nys-radiobutton>
      <nys-radiobutton
        .name=${args.name}
        .checked=${false}
        .label=${"Manhattan"}
        .description=${"New York City"}
        .disabled=${args.disabled}
        .value=${"manhattan"}
      ></nys-radiobutton>
    </nys-radiogroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup 
  label="What is your primary work location?"
  description="This is the location you use for your in office days."
  size="md"
>
  <nys-radiobutton
    name="office"
    label="Albany"
    description="Upstate New York"
    value="albany"
  ></nys-radiobutton>
  <nys-radiobutton
    name="office"
    label="Manhattan"
    description="New York City"
    value="manhattan"
  ></nys-radiobutton>
</nys-radiogroup>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Some Disabled
export const PartialEditableOptions: Story = {
  args: {
    name: "op-system",
    label: "Windows 11",
    description: "HP elitebook",
    value: "windows",
  },
  render: (args) => html`
    <nys-radiogroup
      label="Choose your preferred work operating system."
      size=${args.size}
    >
      <nys-radiobutton
        .name=${args.name}
        .checked=${args.checked}
        .disabled=${args.disabled}
        .label=${args.label}
        .description=${args.description}
        .value=${args.value}
      ></nys-radiobutton>
      <nys-radiobutton
        .name=${args.name}
        .label=${"Sequoia"}
        .description=${"Macbook Air"}
        .value=${"mac"}
      ></nys-radiobutton>
      <nys-radiobutton
        .name=${args.name}
        .disabled=${true}
        .label=${"Linux"}
        .value=${"linux"}
      ></nys-radiobutton>
    </nys-radiogroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Choose your preferred work operating system.">
  <nys-radiobutton 
    name="op-system"
    label="Windows 11"
    description="HP Elitebook"
    value="windows"
  ></nys-radiobutton>
  <nys-radiobutton
    name="op-system"
    label="Sequoia"
    description="Macbook Air"
    value="mac"
  ></nys-radiobutton>
  <nys-radiobutton
    name="op-system"
    label="Linux"
    value="windows"
    disabled
  ></nys-radiobutton>
</nys-radiogroup>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Disabled
export const DisabledOptions: Story = {
  args: {
    checked: true,
    disabled: true,
    label: "Software Engineer 1",
    description: "<1 year experience",
    name: "title",
    value: "eng-1",
  },
  render: (args) => html`
    <nys-radiogroup
      label="Current Title:"
      description="Note: You cannot change your title, if you believe you are ready to be promoted talk to your supervisor."
      size=${args.size}
    >
      <nys-radiobutton
        .checked=${args.checked}
        .disabled=${args.disabled}
        .label=${args.label}
        .description=${args.description}
        .id=${args.id}
        .name=${args.name}
        .value=${args.value}
      ></nys-radiobutton>
      <nys-radiobutton
        .checked=${false}
        .disabled=${args.disabled}
        .label=${"Software Engineer 2"}
        .description=${"1-3 years experience"}
        .id=${args.id}
        .name=${args.name}
        .value=${"eng-2"}
      ></nys-radiobutton>
      <nys-radiobutton
        .checked=${false}
        .disabled=${args.disabled}
        .label=${"Software Engineer 3"}
        .description=${"3-5 years experience"}
        .id=${args.id}
        .name=${args.name}
        .value=${"eng-3"}
      ></nys-radiobutton>
    </nys-radiogroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup
  label="Current Title:"
  description="Note: You cannot change your title, if you believe you are ready to be promoted talk to your supervisor."
>
  <nys-radiobutton
    name="title"
    label="Software Engineer 1"
    description="<1 year experience"
    value="eng-1"
    checked
    disabled
  ></nys-radiobutton>
  <nys-radiobutton
    name="title"
    label="Software Engineer 2"
    description="1-3 years experience"
    value="eng-2"
    disabled
  ></nys-radiobutton>
  <nys-radiobutton
    name="title"
    label="Software Engineer 3"
    description="3-5 years experience"
    value="eng-3"
    disabled
  ></nys-radiobutton>
</nys-radiogroup>
`.trim(),
      },
    },
  },
};

export const Required: Story = {
  args: {
    name: "office",
    label: "Albany",
    description: "Upstate New York",
    value: "albany",
    required: true,
  },

  render: (args) => html`
    <nys-radiogroup
      label="What is your primary work location?"
      description="This is the location you use for your in office days."
      size=${args.size}
      .required=${args.required}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <nys-radiobutton
        .name=${args.name}
        .checked=${args.checked}
        .label=${args.label}
        .description=${args.description}
        .disabled=${args.disabled}
        .value=${args.value}
      ></nys-radiobutton>
      <nys-radiobutton
        .name=${args.name}
        .checked=${false}
        .label=${"Manhattan"}
        .description=${"New York City"}
        .disabled=${args.disabled}
        .value=${"manhattan"}
      ></nys-radiobutton>
    </nys-radiogroup>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup 
  label="What is your primary work location?"
  description="This is the location you use for your in office days."
  required
>
  <nys-radiobutton
    name="office"
    label="Albany"
    description="Upstate New York"
    value="albany"
  ></nys-radiobutton>
  <nys-radiobutton
    name="office"
    label="Manhattan"
    description="New York City"
    value="manhattan"
  ></nys-radiobutton>
</nys-radiogroup>
`.trim(),

        type: "auto",
      },
    },
  },
};

export const Size: Story = {
  args: {
    name: "office",
    label: "Albany",
    description: "Upstate New York",
    value: "albany",
    size: "sm",
  },

  render: (args) => html`
    <nys-radiogroup
      label="Select your agency"
      description="This is the agency, department, or office you work for."
      size=${args.size}
      .required=${args.required}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <nys-radiobutton
        .name=${"agency"}
        .checked=${true}
        .label=${"Department of Health"}
        .value=${"doh"}
      ></nys-radiobutton>
      <nys-radiobutton
        .name=${"agency"}
        .checked=${false}
        .label=${"Office of Information Technology Services"}
        .value=${"its"}
      ></nys-radiobutton>
      <nys-radiobutton
        .name=${"agency"}
        .checked=${false}
        .label=${"New York State Attorney General"}
        .value=${"ag"}
      ></nys-radiobutton>
    </nys-radiogroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup
  label="Select your agency"
  description="This is the agency, department, or office you work for."
  size="sm"
>
  <nys-radiobutton
    .name="agency"
    checked
    .label="Department of Health"
    .value="doh"
  ></nys-radiobutton>
  <nys-radiobutton
    .name="agency"
    .label="Office of Information Technology Services"
    .value="its"
  ></nys-radiobutton>
  <nys-radiobutton
    .name="agency"
    .label="New York State Attorney General"
    .value="ag"
  ></nys-radiobutton>
</nys-radiogroup>
`.trim(),

        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  args: {
    name: "office",
    label: "Albany",
    description: "Upstate New York",
    value: "albany",
    required: true,
    showError: true,
    errorMessage: "You must select one of the above options to continue",
  },

  render: (args) => html`
    <nys-radiogroup
      label="What is your primary work location?"
      description="This is the location you use for your in office days."
      size=${args.size}
      .required=${args.required}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <nys-radiobutton
        .name=${args.name}
        .checked=${args.checked}
        .label=${args.label}
        .description=${args.description}
        .disabled=${args.disabled}
        .value=${args.value}
      ></nys-radiobutton>
      <nys-radiobutton
        .name=${args.name}
        .checked=${false}
        .label=${"Manhattan"}
        .description=${"New York City"}
        .disabled=${args.disabled}
        .value=${"manhattan"}
      ></nys-radiobutton>
    </nys-radiogroup>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup 
  label="What is your primary work location?"
  description="This is the location you use for your in office days."
  required
  showError
  errorMessage="You must select one of the above options to continue"
>
  <nys-radiobutton
    name="office"
    label="Albany"
    description="Upstate New York"
    value="albany"
  ></nys-radiobutton>
  <nys-radiobutton
    name="office"
    label="Manhattan"
    value="manhattan"
  ></nys-radiobutton>
</nys-radiogroup>
`.trim(),

        type: "auto",
      },
    },
  },
};

export const Slot: Story = {
  args: {
    name: "office",
    label: "Albany",
    description: "Upstate New York (prop)",
    value: "albany",
  },

  render: (args) => html`
    <nys-radiogroup
      label="What is your primary work location?"
      size=${args.size}
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
    >
      <label slot="description">
        This is the location you use for your in office days.
        <a href="https://www.ny.gov/" target="__blank">(slot)</a></label
      >
      <nys-radiobutton
        .name=${args.name}
        .checked=${args.checked}
        .label=${args.label}
        .description=${args.description}
        .disabled=${args.disabled}
        .value=${args.value}
      ></nys-radiobutton>
      <nys-radiobutton
        .name=${args.name}
        .checked=${false}
        .label=${"Manhattan"}
        .disabled=${args.disabled}
        .value=${"manhattan"}
      >
        <label slot="description">
          New York City
          <a href="https://www.ny.gov/" target="__blank">(slot)</a></label
        >
      </nys-radiobutton>
    </nys-radiogroup>
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="What is your primary work location?">
  <label slot="description">
    This is the location you use for your in office days.
    <a href="https://www.ny.gov/" target="__blank">(slot)</a></label
  >
  <nys-radiobutton
    name="office"
    label="Albany"
    description="Upstate New York (prop)"
    value="albany"
  ></nys-radiobutton>
  <nys-radiobutton
    name="office"
    label="Manhattan"
    value="manhattan"
  >
    <label slot="description"> 
      New York City
      <a href="https://www.ny.gov/" target="__blank">(slot)</a></label
    >      
  </nys-radiobutton>
</nys-radiogroup>
`.trim(),

        type: "auto",
      },
    },
  },
};
