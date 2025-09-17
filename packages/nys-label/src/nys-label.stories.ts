import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-label";

// Define the structure of the args used in the stories
interface NysLabelArgs {
  label: string;
  description: string;
  flag: "required" | "optional";
}

const meta: Meta<NysLabelArgs> = {
  title: "Components/Label",
  component: "nys-label",
  argTypes: {
    label: {
      control: { type: "text" },
    },
    description: { control: { type: "text" } },
    flag: {
      control: "select",
      options: [null, "required", "optional"],
      defaultValue: { summary: `null` },
    },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysLabelArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    label: "This is a basic nys-label",
    description: "",
  },
  render: (args) =>
    html`<nys-label
      label=${args.label}
      description=${args.description}
      flag=${args.flag}
    ></nys-label>`,
  parameters: {
    docs: {
      source: {
        code: `<nys-label label="This is a basic nys-label"></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const Description: Story = {
  args: {
    label: "This is a basic nys-label",
    description: "This is a description",
  },
  render: (args) =>
    html`<nys-label
      label=${args.label}
      description=${args.description}
      flag=${args.flag}
    ></nys-label>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-label
    label="This is a basic nys-label"
    description="This is a description"
></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  args: {
    label: "This is a basic nys-label",
    description: "This is a slot description",
  },
  render: (args) =>
    html`<nys-label label=${args.label} flag=${args.flag}>
      <label slot="description"
        >${args.description}
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a"
          >You can embed links</a
        ></label
      >
    </nys-label>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-label label="This is a basic nys-label">
  <label slot="description">This is a slot description</label>
</nys-label>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  args: {
    label: "This form is required",
    description: "",
    flag: "required",
  },
  render: (args) =>
    html`<nys-label
      label=${args.label}
      description=${args.description}
      flag=${args.flag}
    ></nys-label>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-label
    label="This form is required"
    flag="required"
></nys-label>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  args: {
    label: "This form is optional",
    description: "",
    flag: "optional",
  },
  render: (args) =>
    html`<nys-label
      label=${args.label}
      description=${args.description}
      flag=${args.flag}
    ></nys-label>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-label
      label="This form is optional"
      flag="optional"
  ></nys-label>`,
        type: "auto",
      },
    },
  },
};
