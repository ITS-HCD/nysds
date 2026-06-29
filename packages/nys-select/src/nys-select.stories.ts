import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-select";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

const meta: Meta = {
  title: "Components/Select",
  component: "nys-select",
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
      <nys-select label="Select your favorite borough" id="borough">
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough">
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const DefaultValue: Story = {
  render: () => {
    return html`
      <nys-select label="Select your favorite borough" id="borough">
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn" selected></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough">
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn" selected></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const OptionGroup: Story = {
  render: () => {
    return html`
      <nys-select
        label="Which New York State service are you contacting us about?"
        description="This is for demo purposes and the list might not be exhaustive."
      >
        <optgroup label="Transportation Services">
          <option value="mta">MTA / Public Transit</option>
          <option value="dmv">Department of Motor Vehicles (DMV)</option>
          <option value="highway">Highway Maintenance</option>
        </optgroup>
        <optgroup label="Health & Human Services">
          <option value="medicaid">Medicaid / Health Insurance</option>
          <option value="mental-health">Mental Health Support</option>
          <option value="child-family">Child and Family Services</option>
        </optgroup>
        <optgroup label="Public Safety">
          <option value="state-police">State Police</option>
          <option value="emergency-management">Emergency Management</option>
          <option value="fire-safety">Fire Safety</option>
        </optgroup>
        <optgroup label="Environment & Energy">
          <option value="environmental-conservation">
            Environmental Conservation
          </option>
          <option value="clean-energy">Clean Energy Programs</option>
          <option value="waste-management">Waste Management</option>
        </optgroup>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select
  label="Which New York State service are you contacting us about?"
  description="This is for demo purposes and the list might not be exhaustive."
>
  <optgroup label="Transportation Services">
    <option value="mta">MTA / Public Transit</option>
    <option value="dmv">Department of Motor Vehicles (DMV)</option>
    <option value="highway">Highway Maintenance</option>
  </optgroup>
  <optgroup label="Health & Human Services">
    <option value="medicaid">Medicaid / Health Insurance</option>
    <option value="mental-health">Mental Health Support</option>
    <option value="child-family">Child and Family Services</option>
  </optgroup>
  <optgroup label="Public Safety">
    <option value="state-police">State Police</option>
    <option value="emergency-management">Emergency Management</option>
    <option value="fire-safety">Fire Safety</option>
  </optgroup>
  <optgroup label="Environment & Energy">
    <option value="environmental-conservation">Environmental Conservation</option>
    <option value="clean-energy">Clean Energy Programs</option>
    <option value="waste-management">Waste Management</option>
  </optgroup>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-select label="Select your favorite borough" id="borough" disabled>
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough" disabled>
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const DisabledOption: Story = {
  render: () => {
    return html`
      <nys-select label="Select your favorite borough" id="borough">
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island" disabled></option>
        <option value="queens" label="Queens" disabled></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough">
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island" disabled></option>
  <option value="queens" label="Queens" disabled></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Required: Story = {
  render: () => {
    return html`
      <nys-select label="Select your favorite borough" id="borough" required>
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough" required>
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const Optional: Story = {
  render: () => {
    return html`
      <nys-select label="Select your favorite borough" id="borough" optional>
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough" optional>
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const WidthSmall: Story = {
  render: () => {
    return html`
      <nys-select label="Select your favorite borough" id="borough" width="sm">
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough" width="sm">
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const WidthMedium: Story = {
  render: () => {
    return html`
      <nys-select label="Select your favorite borough" id="borough" width="md">
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough" width="md">
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const WidthLarge: Story = {
  render: () => {
    return html`
      <nys-select label="Select your favorite borough" id="borough" width="lg">
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough" width="lg">
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const SlottedDescription: Story = {
  render: () => {
    return html`
      <nys-select label="Select your favorite borough" id="borough">
        <label slot="description">This is a slotted description</label>
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select label="Select your favorite borough" id="borough">
  <label slot="description">This is a slotted description</label>
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};

export const ErrorMessage: Story = {
  render: () => {
    return html`
      <nys-select
        label="Select your favorite borough"
        id="borough"
        errorMessage="You did not select a borough"
        showError
      >
        <option value="bronx" label="The Bronx"></option>
        <option value="brooklyn" label="Brooklyn"></option>
        <option value="manhattan" label="Manhattan"></option>
        <option value="staten_island" label="Staten Island"></option>
        <option value="queens" label="Queens"></option>
      </nys-select>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-select
  label="Select your favorite borough"
  id="borough"
  errorMessage="You did not select a borough"
  showError
>
  <option value="bronx" label="The Bronx"></option>
  <option value="brooklyn" label="Brooklyn"></option>
  <option value="manhattan" label="Manhattan"></option>
  <option value="staten_island" label="Staten Island"></option>
  <option value="queens" label="Queens"></option>
</nys-select>`,
        type: "auto",
      },
    },
  },
};
