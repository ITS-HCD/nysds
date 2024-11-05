import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-radiobutton";
import "./nys-radiogroup";

// Define the structure of the args used in the stories
interface NysRadiobuttonArgs {
  checked: boolean;
  disabled: boolean;
  label: string;
  description: string;
  id: string;
  name: string;
  value: string;
  required: boolean;
}

const meta: Meta<NysRadiobuttonArgs> = {
  title: "Components/Radiobutton",
  component: "nys-radiobutton",
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    id: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    required: { control: "boolean" },
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

export const EmilyPlayground: Story = {
  render: () =>
    html`<nys-radiogroup>
      <nys-radiobutton
        name="example-group"
        label="Option"
        checked="true"
        value="option"
      ></nys-radiobutton>
      <nys-radiobutton
        name="example-group"
        label="Choice"
        checked="true"
        value="choice"
      ></nys-radiobutton>
      <nys-radiobutton
        name="example-group"
        label="Decision"
        value="decision"
      ></nys-radiobutton
      ><nys-radiobutton
        name="example-group"
        disabled="true"
        label="Not me though"
        value="nope"
      ></nys-radiobutton>
    </nys-radiogroup>`,
};

// Story: Editable
export const AllEditableOptions: Story = {
  args: {
    checked: false,
    disabled: false,
    label: "Albany",
    description: "Upstate New York",
    value: "albany",
    name: "office",
  },
  render: (args) => html`
    <div role="radiogroup">
      <p>What is your primary work location?</p>
      <nys-radiobutton
        .checked=${args.checked}
        .disabled=${args.disabled}
        .label=${args.label}
        .description=${args.description}
        .name=${args.name}
        .value=${args.value}
      ></nys-radiobutton>
      <nys-radiobutton
        .checked=${false}
        .disabled=${args.disabled}
        .label=${"Manhatten"}
        .description=${"New York City"}
        .name=${args.name}
        .value=${"manhatten"}
      ></nys-radiobutton>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<div role="radiogroup">
  <p>What is your primary work location?</p>
  <nys-radiobutton
    label="Albany"
    description="Upstate New York"
    name="office"
    value="albany"
  ></nys-radiobutton>
  <nys-radiobutton
    label="Manhatten"
    description="New York City"
    name="office"
    value="manhatten"
  ></nys-radiobutton>
</div>`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Some Disabled
export const PartialEdditableOptions: Story = {
  args: {
    checked: false,
    disabled: false,
    label: "Windows 11",
    description: "HP elitebook",
    value: "windows",
    name: "op-system",
  },
  render: (args) => html`
    <div role="radiogroup">
      <p>Choose your preferred work operating system.</p>
      <nys-radiobutton
        .checked=${args.checked}
        .disabled=${args.disabled}
        .label=${args.label}
        .description=${args.description}
        .name=${args.name}
        .value=${args.value}
      ></nys-radiobutton>
      <nys-radiobutton
        .checked=${false}
        .disabled=${false}
        .label=${"Sequoia"}
        .description=${"Macbook Air"}
        .name=${args.name}
        .value=${"mac"}
      ></nys-radiobutton>
      <nys-radiobutton
        .checked=${false}
        .disabled=${true}
        .label=${"Linux"}
        .name=${args.name}
        .value=${"linux"}
      ></nys-radiobutton>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<div role="radiogroup">
  <p>Choose your preferred work operating system.</p>
  <nys-radiobutton 
    label="Windows 11"
    description="HP Elitebook"
    name="op-system"
    value="windows"
  ></nys-radiobutton>
  <nys-radiobutton
    label="Sequoia"
    description="Macbook Air"
    name="op-system"
    value="mac"
  ></nys-radiobutton>
  <nys-radiobutton
    disabled
    label="Linux"
    name="op-system"
    value="windows"
  ></nys-radiobutton>
</div>`.trim(),
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
    <div role="radiogroup">
      <p>
        Current title. Note: You cannot change your title, if you believe you
        are ready to be promoted talk to your supervisor.
      </p>
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
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<div role="radiogroup">
  <p>Current title. Note: You cannot change your title, if you believe you are ready to be promoted talk to your supervisor.</p>
  <nys-radiobutton
    checked
    disabled
    label="Software Engineer 1"
    description="<1 year experience"
    name="title"
    value="eng-1"
  ></nys-radiobutton>
  <nys-radiobutton
    checked
    disabled
    label="Software Engineer 2"
    description="1-3 years experience"
    name="title"
    value="eng-2"
  ></nys-radiobutton>
  <nys-radiobutton
    checked
    disabled
    label="Software Engineer 3"
    description="3-5 years experience"
    name="title"
    value="eng-3"
  ></nys-radiobutton>
</div>`.trim(),
      },
    },
  },
};
