import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-fileinput";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

const meta: Meta = {
  title: "Components/Fileinput",
  component: "nys-fileinput",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => {
    return html` <nys-fileinput label="Upload a file"></nys-fileinput> `;
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
