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
  label: string;
  description?: string;
  size?: string;
}

const meta: Meta<NysToggleArgs> = {
  title: "Components/Toggle",
  component: "nys-toggle",
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
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
      .description=${args.description}
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
    label: "Dark Mode",
    name: "theme",
    value: "dark",
    checked: true,
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .description=${args.description}
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
  label="Dark Mode"
  name="theme"
  value="dark"
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
    label: "Disabled Unchecked",
    name: "toggle-switch",
    disabled: true,
    value: "access",
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .description=${args.description}
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
    label: "Disabled Checked",
    name: "toggle-switch",
    value: "access",
    disabled: true,
    checked: true,
  },
  render: (args) =>
    html` <nys-toggle
      .label=${args.label}
      .description=${args.description}
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
    label: "Toggle Switch",
    name: "toggle-switch",
    value: "access",
  },
  render: (args) => html`
    <nys-toggle
      .label=${args.label}
      .description=${args.description}
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
      <p slot="description">
        This slot is called 'description' (<a
          href="https://www.ny.gov/"
          target="_blank"
          >learn more</a
        >)
      </p>
    </nys-toggle>
    <br />
    <br />
    <nys-toggle
      .label=${args.label}
      description="This description was passed in as a property"
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      .size=${args.size}
    >
    </nys-toggle>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle 
  label="Toggle Switch"
  name="toggle-switch"
  value="access"
>
  <p slot="description">This slot is called 'description' (<a href="https://www.ny.gov/" target="_blank">learn more</a>)</p>
</nys-toggle>
<br/>
<br/>
<nys-toggle 
  label="Toggle Switch"
  description="This description was passed in as a property"
  name="toggle-switch"
  value="access">
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
  },
  render: (args) => html`
    <nys-toggle
      label='Small (size="sm")'
      description="The label and description font sizes automatically adjust to match the toggle switch's size."
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      size="sm">
    </nys-toggle>
    </br>
    <nys-toggle
      label='Medium (size="md")'
      .name=${args.name}
      description="The label and description font sizes automatically adjust to match the toggle switch's size."
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      size="md"
    >
    </nys-toggle>
    </br>
    <nys-toggle
      label='Large (size="lg")'
      description="The label and description font sizes automatically adjust to match the toggle switch's size."
      .name=${args.name}
      .value=${args.value}
      .checked=${args.checked}
      .disabled=${args.disabled}
      ?noIcon=${args.noIcon}
      size="lg"
    >
    </nys-toggle>
    `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-toggle
  label='Small (size="sm")'
  description="The label and description font sizes automatically adjust to match the toggle switch's size."
  name="toggle-switch"
  value="access"
  size="sm"
>
</nys-toggle>
</br>
<nys-toggle
  label='Medium (size="md")'
  description="The label and description font sizes automatically adjust to match the toggle switch's size."
  name="toggle-switch"
  value="access"
  size="md"
>
</nys-toggle>
</br>
<nys-toggle
  label='Large (size="lg")'
  description="The label and description font sizes automatically adjust to match the toggle switch's size."
  name="toggle-switch"
  value="access"
  size="lg"
>
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
      .description=${args.description}
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
      .description=${args.description}
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
