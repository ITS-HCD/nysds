import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-toggle";

// Define the structure of the args used in the stories
interface NysToggleArgs {
  id: string;
  name: string;
  checked: boolean;
  disabled?: boolean;
  label?: string;
  size?: string;
}

const meta: Meta<NysToggleArgs> = {
  title: "Components/Toggle",
  component: "nys-toggle",
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysToggleArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Toggle switch
export const ToggleSwitch: Story = {
  args: {
    name: "exampleName",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .disabled=${args.disabled}
      .size=${args.size}
    ></nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="exampleName"
  ></nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: Checked
export const Checked: Story = {
  args: {
    name: "exampleName",
    checked: true,
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .disabled=${args.disabled}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="exampleName"
  checked
  ></nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: UncheckedDisabled
export const UncheckedDisabled: Story = {
  args: {
    name: "exampleName",
    disabled: true,
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .disabled=${args.disabled}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="exampleName"
  disabled
  ></nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: CheckedDisabled
export const CheckedDisabled: Story = {
  args: {
    name: "exampleName",
    disabled: true,
    checked: true,
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .disabled=${args.disabled}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="exampleName"
  checked
  disabled
  ></nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: Help texts
export const HelpTexts: Story = {
  args: {
    name: "exampleName",
  },
  render: (args) => html`
    <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .disabled=${args.disabled}
      .size=${args.size}
    >
      <p slot="label">Toggle Switch</p>
      <p slot="description-right">This slot is called 'description-right'</p>
    </nys-toggle>
    <br />
    <br />
    <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .disabled=${args.disabled}
      .size=${args.size}
    >
      <p slot="label">Toggle Switch</p>
      <p slot="description-bottom">This slot is called 'description-bottom'</p>
    </nys-toggle>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle name="exampleName">
    <p slot="label">Toggle Switch</p>
    <p slot="description-right">This slot is called 'description-right'</p>
  </nys-toggle>
  <br/>
  <br/>
  <nys-toggle name="exampleName">
    <p slot="label">Toggle Switch</p>
    <p slot="description-bottom">This slot is called 'description-bottom'</p>
  </nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: Sizes
export const Sizes: Story = {
  args: {
    name: "exampleName",
    size: "lg",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .disabled=${args.disabled}
      .size=${args.size}
    >
      <p slot="label">
        ${args.size == "sm" ? "Small" : args.size == "md" ? "Medium" : "Large"}
      </p>
      <p slot="description-bottom">
        Label and description's font-size will resize with toggle switch's size.
      </p>
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="exampleName"
  size="lg"
  >
   <p slot="label">Large</p>
  </nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: Labels
export const Labels: Story = {
  args: {
    name: "exampleName",
    label: "toggle switch access",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .checked=${args.checked}
      .disabled=${args.disabled}
      .size=${args.size}
    >
      <p slot="label">Toggle Switch</p>
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="exampleName"
  label="toggle switch access"
  >
    <p slot="label">Toggle Switch</p>
  </nys-toggle>
        `.trim(),
      },
    },
  },
};
