import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-checkbox";
import "./nys-checkboxgroup";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-textinput";

const meta: Meta = {
  title: "Components/Checkbox",
  component: "nys-checkbox",
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
      <nys-checkboxgroup label="Select landmarks" required>
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" required>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const Tile: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks" tile>
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" tile>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks" required>
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" required>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks" optional>
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" optional>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks">
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
          disabled
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
          disabled
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks">
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks" disabled></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls" disabled></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const SizeSmall: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks" size="sm">
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks" size="sm">
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const OtherOption: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks">
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value=""
          label="Other"
          other
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks">
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
  <nys-checkbox name="landmarks" value="" label="Other" other></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup
        label="Select landmarks"
        showError
        errorMessage="Please select at least one landmark"
      >
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup
  label="Select landmarks"
  showError
  errorMessage="Please select at least one landmark"
>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  render: () => {
    return html`
      <nys-checkboxgroup label="Select landmarks">
        <div slot="description">
          Your
          <strong>ABSOLUTE</strong>
          favorite one.
        </div>
        <nys-checkbox
          name="landmarks"
          value="adirondacks"
          label="Adirondacks"
        ></nys-checkbox>
        <nys-checkbox
          name="landmarks"
          value="niagara"
          label="Niagara Falls"
        ></nys-checkbox>
      </nys-checkboxgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkboxgroup label="Select landmarks">
  <div slot="description">
    Your
    <strong>ABSOLUTE</strong>
    favorite one.
  </div>
  <nys-checkbox name="landmarks" value="adirondacks" label="Adirondacks"></nys-checkbox>
  <nys-checkbox name="landmarks" value="niagara" label="Niagara Falls"></nys-checkbox>
</nys-checkboxgroup>`,
        type: "auto",
      },
    },
  },
};

export const Single: Story = {
  render: () => {
    return html`
      <nys-checkbox label="I agree to the terms" name="terms"></nys-checkbox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkbox label="I agree to the terms" name="terms"></nys-checkbox>`,
        type: "auto",
      },
    },
  },
};

export const Preselected: Story = {
  render: () => {
    return html`
      <nys-checkbox
        label="I agree to the terms"
        name="terms"
        checked
      ></nys-checkbox>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-checkbox label="I agree to the terms" name="terms" checked></nys-checkbox>`,
        type: "auto",
      },
    },
  },
};
