import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-fileinput";
import "@nysds/nys-icon";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysFileinputArgs {
  id?: string;
  name?: string;
  label?: string;
  description?: string;
  width?: string;
  multiple?: boolean;
  accept?: string;
  required?: boolean;
  optional: boolean;
  disabled?: boolean;
  errorMessage?: string;
  showError?: boolean;
  dropzone?: boolean;
}

const meta: Meta<NysFileinputArgs> = {
  title: "Components/Fileinput",
  component: "nys-fileinput",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    width: {
      control: "select",
      options: ["lg", "full"],
      defaultValue: { summary: "full" },
    },
    multiple: { control: "boolean" },
    accept: { control: "text" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    disabled: { control: "boolean" },
    errorMessage: { control: "text" },
    showError: { control: "boolean" },
    dropzone: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysFileinputArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "fileinput1",
    name: "fileinput1",
    label: "Upload a file",
    description: "Accepted file types: .jpg, .png, .pdf",
    width: "full",
    multiple: false,
    accept: "image/png, image/jpeg, .pdf",
    required: false,
    disabled: false,
    errorMessage: "",
    showError: false,
    dropzone: false,
  },
  render: (args) => html`
    <nys-fileinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .width=${args.width}
      ?multiple=${args.multiple}
      .accept=${args.accept}
      ?required=${args.required}
      ?optional=${args.optional}
      ?disabled=${args.disabled}
      .errorMessage=${args.errorMessage}
      ?showError=${args.showError}
      ?dropzone=${args.dropzone}
    ></nys-fileinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput
  id="fileinput1"
  name="fileinput1"
  label="Upload a file"
  description="Accepted file types: .jpg, .png, .pdf"
  accept="image/png, image/jpeg, image/*,.pdf"
></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const Dropzone: Story = {
  args: {
    label: "Upload a file",
    description: "Accepted file types: .jpg, .png, .pdf",
    accept: "image/png, image/jpeg, image/*,.pdf",
    dropzone: true,
  },
  render: (args) => html`
    <nys-fileinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .width=${args.width}
      ?multiple=${args.multiple}
      .accept=${args.accept}
      ?required=${args.required}
      ?optional=${args.optional}
      ?disabled=${args.disabled}
      .errorMessage=${args.errorMessage}
      ?showError=${args.showError}
      ?dropzone=${args.dropzone}
    ></nys-fileinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput
  label="Upload a file"
  description="Accepted file types: .jpg, .png, .pdf"
  accept="image/png, image/jpeg, image/*,.pdf"
  dropzone
></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const Width: Story = {
  args: {
    label: "Upload a file",
    description: "Accepted file types: .jpg, .png, .pdf",
    width: "lg",
    accept: "image/png, image/jpeg, image/*,.pdf",
    dropzone: true,
  },
  render: (args) => html`
    <nys-fileinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .width=${args.width}
      ?multiple=${args.multiple}
      .accept=${args.accept}
      ?required=${args.required}
      ?optional=${args.optional}
      ?disabled=${args.disabled}
      .errorMessage=${args.errorMessage}
      ?showError=${args.showError}
      ?dropzone=${args.dropzone}
    ></nys-fileinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput
  id="fileinput1"
  name="fileinput1"
  label="Upload a file"
  description="Accepted file types: .jpg, .png, .pdf"
  accept="image/png, image/jpeg, image/*,.pdf"
></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const Multiple: Story = {
  args: {
    label: "Upload a file",
    description: "Accepted file types: .jpg, .png, .pdf",
    multiple: true,
    accept: "image/png, image/jpeg, image/*,.pdf",
  },
  render: (args) => html`
    <nys-fileinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .width=${args.width}
      ?multiple=${args.multiple}
      .accept=${args.accept}
      ?required=${args.required}
      ?optional=${args.optional}
      ?disabled=${args.disabled}
      .errorMessage=${args.errorMessage}
      ?showError=${args.showError}
      ?dropzone=${args.dropzone}
    ></nys-fileinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput
  id="fileinput1"
  name="fileinput1"
  label="Upload a file"
  description="Accepted file types: .jpg, .png, .pdf"
  accept="image/png, image/jpeg, image/*,.pdf"
  multiple
></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    label: "Upload a file",
    description: "Accepted file types: .jpg, .png, .pdf",
    width: "full",
    multiple: false,
    accept: "image/png, image/jpeg, image/*,.pdf",
    disabled: true,
  },
  render: (args) => html`
    <nys-fileinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .description=${args.description}
      .width=${args.width}
      ?multiple=${args.multiple}
      .accept=${args.accept}
      ?required=${args.required}
      ?optional=${args.optional}
      ?disabled=${args.disabled}
      .errorMessage=${args.errorMessage}
      ?showError=${args.showError}
      ?dropzone=${args.dropzone}
    ></nys-fileinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput
  id="fileinput1"
  name="fileinput1"
  label="Upload a file"
  description="Accepted file types: .jpg, .png, .pdf"
  accept="image/png, image/jpeg, image/*,.pdf"
  disabled
></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  args: {
    id: "fileinput-slot",
    name: "fileinput-slot",
    label: "Upload a file",
    width: "full",
  },
  render: (args) => html`
    <nys-fileinput
      .id=${args.id}
      .name=${args.name}
      .label=${args.label}
      .width=${args.width}
    >
      <span slot="description">
        Learn more at
        <a href="https://www.ny.gov" target="_blank" rel="noopener">ny.gov</a>
      </span>
    </nys-fileinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput
  id="fileinput-slot"
  name="fileinput-slot"
  label="Upload a file"
  width="full"
>
  <span slot="description">
    Learn more at
    <a href="https://www.ny.gov" target="_blank" rel="noopener">ny.gov</a>
  </span>
</nys-fileinput>`,
        type: "auto",
      },
    },
  },
};
