import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-textarea";
import "@nysds/nys-errormessage";
import "@nysds/nys-icon";
import "@nysds/nys-label";

const meta: Meta = {
  title: "Components/Textarea",
  component: "nys-textarea",
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
  args: {
    name: "",
    label: "Comments",
    description: "",
    placeholder: "",
    value: "",
    disabled: false,
    readonly: false,
    required: false,
    optional: false,
    tooltip: "",
    inverted: false,
    width: "full",
    rows: 4,
    resize: "vertical",
    showError: false,
    errorMessage: "",
    ariaLabel: "",
  },
  argTypes: {
    width: { control: { type: "select" }, options: ["sm", "md", "lg", "full"] },
    resize: { control: { type: "select" }, options: ["vertical", "none"] },
  },
  render: (args) => {
    return html`
      <nys-textarea
        name=${args.name}
        label=${args.label}
        description=${args.description}
        placeholder=${args.placeholder}
        value=${args.value}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?required=${args.required}
        ?optional=${args.optional}
        tooltip=${args.tooltip}
        ?inverted=${args.inverted}
        width=${args.width}
        rows=${args.rows}
        resize=${args.resize}
        ?showError=${args.showError}
        errorMessage=${args.errorMessage}
        ariaLabel=${args.ariaLabel}
      ></nys-textarea>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Comments"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html` <nys-textarea label="Comments" disabled></nys-textarea> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Comments" disabled></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Readonly: Story = {
  render: () => {
    return html`
      <nys-textarea
        label="Comments"
        readonly
        value="You can see me but not edit me"
      ></nys-textarea>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Comments" readonly value="You can see me but not edit me"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-textarea label="Describe the incident" required></nys-textarea>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Describe the incident" required></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html` <nys-textarea label="Comments" optional></nys-textarea> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Comments" optional></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const MaxLength: Story = {
  render: () => {
    return html`
      <nys-textarea label="Comments" maxlength="100"></nys-textarea>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Comments" maxlength="100"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const WidthSmall: Story = {
  render: () => {
    return html` <nys-textarea label="Comments" width="sm"></nys-textarea> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Comments" width="sm"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const WidthMedium: Story = {
  render: () => {
    return html` <nys-textarea label="Comments" width="md"></nys-textarea> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Comments" width="md"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const WidthLarge: Story = {
  render: () => {
    return html` <nys-textarea label="Comments" width="lg"></nys-textarea> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Comments" width="lg"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const Description: Story = {
  render: () => {
    return html`
      <nys-textarea
        label="Describe the incident"
        description="Please provide details"
      ></nys-textarea>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Describe the incident" description="Please provide details"></nys-textarea>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  render: () => {
    return html`
      <nys-textarea label="Describe the incident">
        <div slot="description">Please provide details</div>
      </nys-textarea>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textarea label="Describe the incident">
  <div slot="description">Please provide details</div>
</nys-textarea>`,
        type: "auto",
      },
    },
  },
};
