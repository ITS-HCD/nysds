import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-radiobutton";
import "./nys-radiogroup";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-textinput";

const meta: Meta = {
  title: "Components/Radiobutton",
  component: "nys-radiobutton",
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
    return html`
      <nys-radiogroup label="Select borough" required>
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="manhattan"
          label="Manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough" required>
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
  <nys-radiobutton name="borough" value="manhattan" label="Manhattan"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const Tile: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough" tile>
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough" tile>
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough" required>
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough" required>
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough" optional>
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough" optional>
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough">
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
          disabled
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
          disabled
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough">
  <nys-radiobutton name="borough" value="bronx" label="The Bronx" disabled></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn" disabled></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const SizeSmall: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough" size="sm">
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough" size="sm">
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const OtherOption: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough">
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value=""
          label="Other"
          other
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough">
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="" label="Other" other></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  render: () => {
    return html`
      <nys-radiogroup
        label="Select borough"
        showError
        errorMessage="Please select a borough"
      >
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough" showError errorMessage="Please select a borough">
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough">
        <div slot="description">
          Your primary
          <strong>residence</strong>
          in NYC.
        </div>
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough">
  <div slot="description">
    Your primary
    <strong>residence</strong>
    in NYC.
  </div>
  <nys-radiobutton name="borough" value="bronx" label="The Bronx"></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};

export const Preselected: Story = {
  render: () => {
    return html`
      <nys-radiogroup label="Select borough">
        <nys-radiobutton
          name="borough"
          value="bronx"
          label="The Bronx"
          checked
        ></nys-radiobutton>
        <nys-radiobutton
          name="borough"
          value="brooklyn"
          label="Brooklyn"
        ></nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="Select borough">
  <nys-radiobutton name="borough" value="bronx" label="The Bronx" checked></nys-radiobutton>
  <nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>
</nys-radiogroup>`,
        type: "auto",
      },
    },
  },
};
