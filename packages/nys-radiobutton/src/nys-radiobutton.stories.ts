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
    size: { control: "select", options: ["md"] }, //don't have other sizes yet
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

// Story: Editable
export const AllEditableOptions: Story = {
  args: {
    name: "office",
    label: "Albany",
    description: "Upstate New York",
    value: "albany",
  },
  render: (args) => html`
    <nys-radiogroup
      label="What is your primary work location?"
      description="This is the location you use for your in office days."
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
    <nys-radiogroup label="Choose your preferred work operating system.">
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
