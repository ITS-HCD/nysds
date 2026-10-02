import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-fileinput";
import "./nys-fileitem";
import "@nysds/nys-button";
import "@nysds/nys-errormessage";
import "@nysds/nys-icon";
import "@nysds/nys-label";

const meta: Meta = {
  title: "Components/Fileinput",
  component: "nys-fileinput",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'A file input for uploading files with support for multiple files, drag-and-drop, and progress tracking.\nValidates file types via magic bytes (not just extension). Form-associated via ElementInternals.\n\nUse for document uploads, image uploads, or any file submission. Enable `dropzone` for drag-and-drop UI.\n\nRead or write the current selection via the `files` (`File[]`) and `value` (`File | null`)\nproperties — useful for rehydrating state or binding from a framework form model.\nSetting them is silent (does not emit `nys-change`).\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysFileinput label="Upload a file" />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-fileinput label="Upload a file"></nys-fileinput>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    name: "",
    label: "Upload a file",
    description: "",
    multiple: false,
    tooltip: "",
    accept: "",
    disabled: false,
    required: false,
    optional: false,
    showError: false,
    errorMessage: "",
    dropzone: false,
    width: "full",
    inverted: false,
  },
  argTypes: {
    width: { control: { type: "select" }, options: ["lg", "full"] },
  },
  render: (args) => {
    return html`
      <nys-fileinput
        name=${args.name}
        label=${args.label}
        description=${args.description}
        ?multiple=${args.multiple}
        tooltip=${args.tooltip}
        accept=${args.accept}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?optional=${args.optional}
        ?showError=${args.showError}
        errorMessage=${args.errorMessage}
        ?dropzone=${args.dropzone}
        width=${args.width}
        ?inverted=${args.inverted}
      ></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput label="Upload a file"></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const Dropzone: Story = {
  render: () => {
    return html`
      <nys-fileinput label="Upload a file" dropzone></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput label="Upload a file" dropzone></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const Multiple: Story = {
  render: () => {
    return html`
      <nys-fileinput label="Upload a file" multiple></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput label="Upload a file" multiple></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const AcceptedFiletypes: Story = {
  render: () => {
    return html`
      <nys-fileinput
        label="Upload a file"
        description="Accepted file types: .jpg, .png, .pdf"
        accept="image/png, image/jpeg, .pdf"
      ></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput
  label="Upload a file"
  description="Accepted file types: .jpg, .png, .pdf"
  accept="image/png, image/jpeg, .pdf"
></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const WidthLarge: Story = {
  render: () => {
    return html`
      <nys-fileinput label="Upload a file" width="lg"></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput label="Upload a file" width="lg"></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const WidthLargeDropzone: Story = {
  render: () => {
    return html`
      <nys-fileinput label="Upload a file" width="lg" dropzone></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput label="Upload a file" width="lg" dropzone></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-fileinput label="Upload a file" disabled></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput label="Upload a file" disabled></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const Description: Story = {
  render: () => {
    return html`
      <nys-fileinput
        label="Upload a file"
        description="Make sure the file is not blurry and readable"
      ></nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput
  label="Upload a file"
  description="Make sure the file is not blurry and readable"
></nys-fileinput>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  render: () => {
    return html`
      <nys-fileinput label="Upload a file">
        <div slot="description">
          Make sure the file is
          <strong>legible</strong>
        </div>
      </nys-fileinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-fileinput label="Upload a file">
  <div slot="description">
    Make sure the file is
    <strong>legible</strong>
  </div>
</nys-fileinput>`,
        type: "auto",
      },
    },
  },
};
