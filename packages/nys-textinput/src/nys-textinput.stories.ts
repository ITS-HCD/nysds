import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-textinput";
import "@nysds/nys-button";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

const meta: Meta = {
  title: "Components/Textinput",
  component: "nys-textinput",
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
    return html` <nys-textinput label="Full Name"></nys-textinput> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Full Name"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-textinput label="Email Address" disabled></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Email Address" disabled></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Readonly: Story = {
  render: () => {
    return html`
      <nys-textinput
        label="Email Address"
        readonly
        value="You can see me but not edit me"
      ></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  label="Email Address"
  readonly
  value="You can see me but not edit me"
></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-textinput label="Email Address" required></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Email Address" required></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html`
      <nys-textinput label="Email Address" optional></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Email Address" optional></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const WidthSmall: Story = {
  render: () => {
    return html` <nys-textinput label="Zip Code" width="sm"></nys-textinput> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Zip Code" width="sm"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const WidthMedium: Story = {
  render: () => {
    return html` <nys-textinput label="City" width="md"></nys-textinput> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="City" width="md"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const WidthLarge: Story = {
  render: () => {
    return html`
      <nys-textinput label="Email Address" width="lg"></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Email Address" width="lg"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Description: Story = {
  render: () => {
    return html`
      <nys-textinput
        label="Email Address"
        description="Only valid ny.gov emails are accepted."
      ></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput
  label="Email Address"
  description="Only valid ny.gov emails are accepted."
></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  render: () => {
    return html`
      <nys-textinput label="Email Address">
        <div slot="description">
          Only valid
          <strong>ny.gov</strong>
          emails are accepted.
        </div>
      </nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput label="Email Address">
  <div slot="description">
    Only valid
    <strong>ny.gov</strong>
    emails are accepted.
  </div>
</nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const Masking: Story = {
  render: () => {
    return html`
      <nys-textinput type="tel" label="Phone Number">
        <div slot="description">
          Some types, such as
          <code>tel</code>
          have automatic masking available.
        </div>
      </nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput type="tel" label="Phone Number">
  <div slot="description">
    Some types, such as
    <code>tel</code>
    have automatic masking available.
  </div>
</nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const MaxMinValues: Story = {
  render: () => {
    return html`
      <nys-textinput
        type="number"
        label="Age"
        min="18"
        max="99"
        width="sm"
      ></nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput type="number" label="Age" min="18" max="99" width="sm"></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const SuffixButton: Story = {
  render: () => {
    return html`
      <nys-textinput id="search-demo" type="search" placeholder="Search">
        <nys-button
          slot="endButton"
          ariaLabel="Search"
          prefixIcon="search"
          onclick="alert('searching for: ' + document.getElementById('search-demo').value)"
        ></nys-button>
      </nys-textinput>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-textinput id="search-demo" type="search" placeholder="Search">
  <nys-button
    slot="endButton"
    ariaLabel="Search"
    prefixIcon="search"
    onclick="alert('searching for: ' + document.getElementById('search-demo').value)"
  ></nys-button>
</nys-textinput>`,
        type: "auto",
      },
    },
  },
};
