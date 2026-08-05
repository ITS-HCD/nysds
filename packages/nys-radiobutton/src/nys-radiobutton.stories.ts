import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-radiobutton";
import "./nys-radiogroup";
import "@nysds/nys-errormessage";
import "@nysds/nys-label";
import "@nysds/nys-table";
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
  args: {
    name: "",
    required: true,
    optional: false,
    showError: false,
    errorMessage: "",
    label: "Select borough",
    description: "",
    tile: false,
    tooltip: "",
    size: "md",
    checked: false,
    disabled: false,
    value: "bronx",
    other: false,
    showOtherError: false,
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md"] },
  },
  render: (args) => {
    return html`
      <nys-radiogroup
        name=${args.name}
        ?required=${args.required}
        ?optional=${args.optional}
        ?showError=${args.showError}
        errorMessage=${args.errorMessage}
        label=${args.label}
        description=${args.description}
        ?tile=${args.tile}
        tooltip=${args.tooltip}
        size=${args.size}
      >
        <nys-radiobutton
          name="borough"
          value=${args.value}
          label="The Bronx"
          ?checked=${args.checked}
          ?disabled=${args.disabled}
          ?other=${args.other}
          ?showOtherError=${args.showOtherError}
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

export const Description: Story = {
  render: () => {
    return html`
      <nys-radiogroup
        label="Select borough"
        description="Your primary residence in NYC."
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
<nys-radiogroup label="Select borough" description="Your primary residence in NYC.">
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
      <nys-radiogroup label="What is your primary work location?">
        <label slot="description">
          This is the location you use for your
          <a href="https://www.ny.gov/" target="__blank">in office days.</a>
        </label>
        <nys-radiobutton name="office" label="Albany" value="albany">
          <label slot="description">
            A part of
            <a href="https://www.ny.gov/" target="__blank">Upstate New York</a>
          </label>
        </nys-radiobutton>
        <nys-radiobutton name="office" label="Manhattan" value="manhattan">
          <label slot="description">
            A part of
            <a href="https://www.ny.gov/" target="__blank">New York City</a>
          </label>
        </nys-radiobutton>
      </nys-radiogroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiogroup label="What is your primary work location?">
  <label slot="description">
    This is the location you use for your
    <a href="https://www.ny.gov/" target="__blank">in office days.</a>
  </label>
  <nys-radiobutton name="office" label="Albany" value="albany">
    <label slot="description">
      A part of
      <a href="https://www.ny.gov/" target="__blank">Upstate New York</a>
    </label>
  </nys-radiobutton>
  <nys-radiobutton name="office" label="Manhattan" value="manhattan">
    <label slot="description">
      A part of
      <a href="https://www.ny.gov/" target="__blank">New York City</a>
    </label>
  </nys-radiobutton>
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

export const NoGroup: Story = {
  render: () => {
    return html`
      <nys-radiobutton
        name="borough"
        value="queens"
        label="Queens"
        checked
        description="Includes Flushing and Astoria"
      ></nys-radiobutton>
      <nys-radiobutton
        name="borough"
        value="manhattan"
        label="Manhattan"
        checked
      >
        <span slot="description">
          Home to
          <strong>Central Park</strong>
        </span>
      </nys-radiobutton>
      <nys-radiobutton
        name="borough"
        value="brooklyn"
        label="Brooklyn"
      ></nys-radiobutton>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-radiobutton
  name="borough"
  value="queens"
  label="Queens"
  checked
  description="Includes Flushing and Astoria"
></nys-radiobutton>
<nys-radiobutton name="borough" value="manhattan" label="Manhattan" checked>
  <span slot="description">
    Home to
    <strong>Central Park</strong>
  </span>
</nys-radiobutton>
<nys-radiobutton name="borough" value="brooklyn" label="Brooklyn"></nys-radiobutton>`,
        type: "auto",
      },
    },
  },
};

export const PreselectedAlt: Story = {
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

export const StandaloneOnePerTableRow: Story = {
  render: () => {
    return html`
      <nys-table striped bordered>
      <table>
      <caption>
      Select the highest priority application for review
      </caption>
      <tr>
      <th>Application</th>
      <th>Priority</th>
      </tr>
      <tr>
      <td>SNAP Benefits</td>
      <td>
      <nys-radiobutton
       name="priority-application"
       value="snap"
       label="Select SNAP Benefits"
      ></nys-radiobutton>
      </td>
      </tr>
      <tr>
      <td>Child Care Assistance</td>
      <td>
      <nys-radiobutton
       name="priority-application"
       value="child-care"
       label="Select Child Care Assistance"
      ></nys-radiobutton>
      </td>
      </tr>
      <tr>
      <td>HEAP</td>
      <td>
      <label for="rg-bk1">Brooklyn</label>
      <input id="rg-bk1" type="radio" name="group" value="Brooklyn"></input>
      </td>
      </tr>
      <tr>
      <td>Medicaid</td>
      <td>
      <label for="rg-bk2">Manhattan</label>
      <input id="rg-bk2" type="radio" name="group" value="Manhattan"></input>
      </td>
      </tr>
      </table>
      </nys-table>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-table striped bordered>
<table>
<caption>
Select the highest priority application for review
</caption>
<tr>
<th>Application</th>
<th>Priority</th>
</tr>
<tr>
<td>SNAP Benefits</td>
<td>
<nys-radiobutton
 name="priority-application"
 value="snap"
 label="Select SNAP Benefits"
></nys-radiobutton>
</td>
</tr>
<tr>
<td>Child Care Assistance</td>
<td>
<nys-radiobutton
 name="priority-application"
 value="child-care"
 label="Select Child Care Assistance"
></nys-radiobutton>
</td>
</tr>
<tr>
<td>HEAP</td>
<td>
<label for="rg-bk1">Brooklyn</label>
<input id="rg-bk1" type="radio" name="group" value="Brooklyn"></input>
</td>
</tr>
<tr>
<td>Medicaid</td>
<td>
<label for="rg-bk2">Manhattan</label>
<input id="rg-bk2" type="radio" name="group" value="Manhattan"></input>
</td>
</tr>
</table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};
