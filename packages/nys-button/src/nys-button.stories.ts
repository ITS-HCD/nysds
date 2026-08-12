import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-button";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Button",
  component: "nys-button",
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
    size: "md",
    fullWidth: false,
    variant: "filled",
    inverted: false,
    label: "Button",
    ariaControls: "",
    ariaExpanded: "",
    ariaCurrent: "",
    prefixIcon: "",
    suffixIcon: "",
    circle: false,
    icon: "",
    disabled: false,
    value: "",
    ariaDescribedBy: "",
    type: "button",
    href: "",
    target: "_self",
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    variant: {
      control: { type: "select" },
      options: ["filled", "outline", "ghost", "text"],
    },
    ariaExpanded: {
      control: { type: "select" },
      options: ["true", "false", ""],
    },
    ariaCurrent: {
      control: { type: "select" },
      options: [
        "page",
        "step",
        "location",
        "date",
        "time",
        "true",
        "false",
        "",
      ],
    },
    type: {
      control: { type: "select" },
      options: ["submit", "reset", "button"],
    },
    target: {
      control: { type: "select" },
      options: ["_self", "_blank", "_parent", "_top", "framename"],
    },
  },
  render: (args) => {
    return html`
      <nys-button
        name=${args.name}
        size=${args.size}
        ?fullWidth=${args.fullWidth}
        variant=${args.variant}
        ?inverted=${args.inverted}
        label=${args.label}
        ariaControls=${args.ariaControls}
        ariaExpanded=${args.ariaExpanded}
        ariaCurrent=${args.ariaCurrent}
        prefixIcon=${args.prefixIcon}
        suffixIcon=${args.suffixIcon}
        ?circle=${args.circle}
        icon=${args.icon}
        ?disabled=${args.disabled}
        value=${args.value}
        ariaDescribedBy=${args.ariaDescribedBy}
        type=${args.type}
        href=${args.href}
        target=${args.target}
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

export const Href: Story = {
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

export const Type: Story = {
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

export const DisclosureTrigger: Story = {
  render: () => {
    return html`
      <nys-button
        label="Here's how you know"
        ariaExpanded="false"
        ariaControls="trust-bar"
      ></nys-button>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button label="Here's how you know" ariaExpanded="false" ariaControls="trust-bar"></nys-button>`,
        type: "auto",
      },
    },
  },
};
