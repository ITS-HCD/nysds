import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-label";
import "@nysds/nys-tooltip";

// Define the structure of the args used in the stories
interface NysLabelArgs {
  id: string;
  label: string;
  description: string;
  flag: string;
  tooltip: string;
  inverted: boolean;
}

const meta: Meta<NysLabelArgs> = {
  title: "Components/Label",
  component: "nys-label",
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    flag: { control: "text" },
    tooltip: { control: "text" },
    inverted: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysLabelArgs>;

export const Basic: Story = {
  args: {
    label: "This is a basic nys-label",
  },
  render: (args) => {
    return html`
      <nys-label
        .id=${args.id}
        ?inverted=${args["inverted"]}
        .label=${args["label"]}
        .description=${args["description"]}
        .flag=${args["flag"]}
        .tooltip=${args["tooltip"]}
      ></nys-label>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="This is a basic nys-label"></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-label label="This form is required" flag="required"></nys-label>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="This form is required" flag="required"></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html`
      <nys-label label="This form is required" flag="optional"></nys-label>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="This form is required" flag="optional"></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const Description: Story = {
  render: () => {
    return html`
      <nys-label label="Label Text" description="Description text"></nys-label>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="Label Text" description="Description text"></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  render: () => {
    return html`
      <nys-label label="Label Text">
        <p slot="description">
          Rich text description passed in
          <strong>HERE</strong>
        </p>
      </nys-label>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="Label Text">
  <p slot="description">
    Rich text description passed in
    <strong>HERE</strong>
  </p>
</nys-label>`,
        type: "auto",
      },
    },
  },
};

export const WithTooltip: Story = {
  render: () => {
    return html`
      <nys-label id="label-id" label="This label has a tooltip"></nys-label>
      <nys-tooltip for="label-id" text="Tooltip text in here"></nys-tooltip>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-label id="label-id" label="This label has a tooltip"></nys-label>
<nys-tooltip for="label-id" text="Tooltip text in here"></nys-tooltip>`,
        type: "auto",
      },
    },
  },
};
