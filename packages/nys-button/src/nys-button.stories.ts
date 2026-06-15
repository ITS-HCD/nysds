import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-button";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysButtonArgs {
  id: string;
  name: string;
  size: "sm" | "md" | "lg";
  variant: "filled" | "outline" | "ghost" | "text";
  label: string;
  ariaLabel: string;
  ariaControls: string;
  prefixIcon: string;
  suffixIcon: string;
  icon: string;
  form: string | null;
  value: string;
  ariaDescription: string;
  type: "submit" | "reset" | "button";
  fullWidth: boolean;
  inverted: boolean;
  circle: boolean;
  disabled: boolean;
}

const meta: Meta<NysButtonArgs> = {
  title: "Components/Button",
  component: "nys-button",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["filled", "outline", "ghost", "text"],
    },
    label: { control: "text" },
    ariaLabel: { control: "text" },
    ariaControls: { control: "text" },
    prefixIcon: { control: "text" },
    suffixIcon: { control: "text" },
    icon: { control: "text" },
    form: { control: "text" },
    value: { control: "text" },
    ariaDescription: { control: "text" },
    type: { control: "select", options: ["submit", "reset", "button"] },
    fullWidth: { control: "boolean", default: false },
    inverted: { control: "boolean", default: false },
    circle: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysButtonArgs>;

export const Basic: Story = {
  args: {
    label: "Button",
    variant: "filled",
  },
  render: (args) => {
    return html`
      <nys-button
        .id=${args.id}
        ?fullWidth=${args.fullWidth}
        ?inverted=${args.inverted}
        ?circle=${args.circle}
        ?disabled=${args.disabled}
        .name=${args.name}
        .size=${args.size}
        .variant=${args.variant}
        .label=${args.label}
        .ariaLabel=${args.ariaLabel}
        .ariaControls=${args.ariaControls}
        .prefixIcon=${args.prefixIcon}
        .suffixIcon=${args.suffixIcon}
        .icon=${args.icon}
        .form=${args.form}
        .value=${args.value}
        .ariaDescription=${args.ariaDescription}
        .type=${args.type}
      ></nys-button>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Button" variant="filled"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const VariantOutline: Story = {
  render: () => {
    return html` <nys-button label="Button" variant="outline"></nys-button> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Button" variant="outline"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const VariantGhost: Story = {
  render: () => {
    return html` <nys-button label="Button" variant="ghost"></nys-button> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Button" variant="ghost"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const VariantText: Story = {
  render: () => {
    return html` <nys-button label="Button" variant="text"></nys-button> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Button" variant="text"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const PrefixIcon: Story = {
  render: () => {
    return html`
      <nys-button label="Previous" prefixIcon="chevron_left"></nys-button>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Previous" prefixIcon="chevron_left"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const SuffixIcon: Story = {
  render: () => {
    return html`
      <nys-button label="Next" suffixIcon="chevron_right"></nys-button>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Next" suffixIcon="chevron_right"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const SlottedIcons: Story = {
  render: () => {
    return html`
      <nys-button label="Slotted icons">
        <nys-icon
          color="#db117d"
          slot="prefix-icon"
          name="chevron_left"
        ></nys-icon>
        <nys-icon
          color="#db117d"
          slot="suffix-icon"
          name="chevron_right"
        ></nys-icon>
      </nys-button>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Slotted icons">
  <nys-icon color="#db117d" slot="prefix-icon" name="chevron_left"></nys-icon>
  <nys-icon color="#db117d" slot="suffix-icon" name="chevron_right"></nys-icon>
</nys-button>`,
        type: "auto",
      },
    },
  },
};

export const CircleIconButton: Story = {
  render: () => {
    return html`
      <nys-button circle icon="close" label="Close dialog"></nys-button>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button circle icon="close" label="Close dialog"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const LinkstyleButtonForNavigation: Story = {
  render: () => {
    return html`
      <nys-button
        label="Visit NY.gov"
        href="https://www.ny.gov/"
        target="_blank"
        suffixIcon="open_in_new"
      ></nys-button>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button
  label="Visit NY.gov"
  href="https://www.ny.gov/"
  target="_blank"
  suffixIcon="open_in_new"
></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const FormSubmitButton: Story = {
  render: () => {
    return html`
      <nys-button
        type="submit"
        label="Save Changes"
        variant="filled"
      ></nys-button>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button type="submit" label="Save Changes" variant="filled"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const SizeSmall: Story = {
  render: () => {
    return html` <nys-button label="Small" size="sm"></nys-button> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Small" size="sm"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const SizeLarge: Story = {
  render: () => {
    return html` <nys-button label="Large" size="lg"></nys-button> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Large" size="lg"></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const FullWidth: Story = {
  render: () => {
    return html` <nys-button label="Full width" fullWidth></nys-button> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Full width" fullWidth></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const Inverted: Story = {
  render: () => {
    return html`
      <div style="background: #1b1b1b; padding: 1rem">
        <nys-button label="Inverted" inverted></nys-button>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Inverted" inverted></nys-button>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html` <nys-button label="Disabled" disabled></nys-button> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Disabled" disabled></nys-button>`,
        type: "auto",
      },
    },
  },
};
