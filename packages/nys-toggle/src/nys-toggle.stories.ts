import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-toggle";

// Define the structure of the args used in the stories
interface NysToggleArgs {
  id: string;
  name: string;
  checked: boolean;
  value: string;
  disabled?: boolean;
  noIcon?: boolean;
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
    noIcon: { control: "boolean" },
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
    label: "Dark Mode",
    name: "theme",
    value: "dark",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    ></nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  label="Dark Mode"
  name="theme"
  value="dark"
  ></nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: Checked
export const Checked: Story = {
  args: {
    name: "toggle-switch",
    checked: true,
    value: "access",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="toggle-switch"
  value="access"
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
    name: "toggle-switch",
    disabled: true,
    value: "access",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="toggle-switch"
  value="access"
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
    name: "toggle-switch",
    value: "access",
    disabled: true,
    checked: true,
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  name="toggle-switch"
  value="access"
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
    name: "toggle-switch",
    value: "access",
    label: "Toggle Switch",
  },
  render: (args) => html`
    <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
      <p slot="description-right">This slot is called 'description-right'</p>
    </nys-toggle>
    <br />
    <br />
    <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
      <p slot="description-bottom">This slot is called 'description-bottom'</p>
    </nys-toggle>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle 
  label="Toggle Switch">
  name="toggle-switch"
  value="access"
    <p slot="description-right">This slot is called 'description-right'</p>
  </nys-toggle>
  <br/>
  <br/>
  <nys-toggle 
  label="Toggle Switch"
  name="toggle-switch"
  value="access">
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
    name: "toggle-switch",
    value: "access",
    size: "lg",
    label: "Toggle Switch",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
      <p slot="description-bottom">
        The label and description font sizes automatically adjust to match the toggle switch's size.
      </p>
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  label="Toggle Switch"
  name="toggle-switch"
  value="access"
  size="lg"
  >
    <p slot="description-bottom">
      The label and description font sizes automatically adjust to match the toggle switch's size.
    </p>
  </nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: No Icons
export const NoIcons: Story = {
  args: {
    name: "toggle-switch",
    value: "access",
    label: "Icons are disabled.",
    noIcon: true,
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  label="Toggle Switch"
  name="toggle-switch"
  value="access"
  noIcon
  >
  </nys-toggle>
        `.trim(),
      },
    },
  },
};

// Story: Labels
export const Labels: Story = {
  args: {
    name: "toggle-switch",
    value: "access",
    label: "Labels are essential for voiceover too!",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
    </nys-toggle>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-toggle
  label="Labels are essential for voiceover too!"
  name="toggle-switch"
  value="access"
  >
  </nys-toggle>
        `.trim(),
      },
    },
  },
};
