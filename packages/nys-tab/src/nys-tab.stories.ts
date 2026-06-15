import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tab";
import "./nys-tabgroup";
import "./nys-tabpanel";

// Define the structure of the args used in the stories
interface NysTabArgs {
  id: string;
  label: string;
  name: string;
  selected: boolean;
  disabled: boolean;
}

const meta: Meta<NysTabArgs> = {
  title: "Components/Tab",
  component: "nys-tab",
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    name: { control: "text" },
    selected: { control: "boolean", default: false },
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
type Story = StoryObj<NysTabArgs>;

export const Basic: Story = {
  render: () => {
    return html`
      <!-- Always place <nys-tab> elements inside a <nys-tabgroup>. -->
      <nys-tabgroup name="My Tabs">
        <nys-tab label="Overview"></nys-tab>
        <nys-tab label="Details" selected></nys-tab>
        <nys-tab label="Archived" disabled></nys-tab>
        <nys-tabpanel><p>Overview content</p></nys-tabpanel>
        <nys-tabpanel><p>Details content (shown by default)</p></nys-tabpanel>
        <nys-tabpanel><p>Archived content</p></nys-tabpanel>
      </nys-tabgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Always place <nys-tab> elements inside a <nys-tabgroup>. -->
<nys-tabgroup name="My Tabs">
  <nys-tab label="Overview"></nys-tab>
  <nys-tab label="Details" selected></nys-tab>
  <nys-tab label="Archived" disabled></nys-tab>
  <nys-tabpanel><p>Overview content</p></nys-tabpanel>
  <nys-tabpanel><p>Details content (shown by default)</p></nys-tabpanel>
  <nys-tabpanel><p>Archived content</p></nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};

export const DisableATabUsingTheDisabledAttributeOnNystab: Story = {
  render: () => {
    return html`
      <nys-tabgroup name="Account Settings">
        <nys-tab label="Profile"></nys-tab>
        <nys-tab label="Security"></nys-tab>
        <nys-tab label="Notifications" disabled></nys-tab>
        <nys-tabpanel><p>Manage your profile information.</p></nys-tabpanel>
        <nys-tabpanel
          ><p>Update your password and 2FA settings.</p></nys-tabpanel
        >
        <nys-tabpanel
          ><p>Notification preferences (coming soon).</p></nys-tabpanel
        >
      </nys-tabgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup name="Account Settings">
  <nys-tab label="Profile"></nys-tab>
  <nys-tab label="Security"></nys-tab>
  <nys-tab label="Notifications" disabled></nys-tab>
  <nys-tabpanel><p>Manage your profile information.</p></nys-tabpanel>
  <nys-tabpanel><p>Update your password and 2FA settings.</p></nys-tabpanel>
  <nys-tabpanel><p>Notification preferences (coming soon).</p></nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};

export const PreselectATabUsingTheSelectedAttributeOnNystab: Story = {
  render: () => {
    return html`
      <nys-tabgroup name="Reports">
        <nys-tab label="Summary"></nys-tab>
        <nys-tab label="Details" selected></nys-tab>
        <nys-tabpanel><p>Summary view</p></nys-tabpanel>
        <nys-tabpanel><p>Detailed view (shown by default)</p></nys-tabpanel>
      </nys-tabgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup name="Reports">
  <nys-tab label="Summary"></nys-tab>
  <nys-tab label="Details" selected></nys-tab>
  <nys-tabpanel><p>Summary view</p></nys-tabpanel>
  <nys-tabpanel><p>Detailed view (shown by default)</p></nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};

export const PanelContentIsWrappedByNystabpanel: Story = {
  render: () => {
    return html`
      <!-- Panels are paired by position with <nys-tab> elements in the same <nys-tabgroup>. -->
      <nys-tabgroup name="Steps">
        <nys-tab label="Step 1"></nys-tab>
        <nys-tab label="Step 2"></nys-tab>
        <nys-tabpanel>
          <h2>Step 1: Enter your information</h2>
          <p>Fill out the form below.</p>
        </nys-tabpanel>
        <nys-tabpanel>
          <h2>Step 2: Review and submit</h2>
          <p>Confirm your details before submitting.</p>
        </nys-tabpanel>
      </nys-tabgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Panels are paired by position with <nys-tab> elements in the same <nys-tabgroup>. -->
<nys-tabgroup name="Steps">
  <nys-tab label="Step 1"></nys-tab>
  <nys-tab label="Step 2"></nys-tab>
  <nys-tabpanel>
    <h2>Step 1: Enter your information</h2>
    <p>Fill out the form below.</p>
  </nys-tabpanel>
  <nys-tabpanel>
    <h2>Step 2: Review and submit</h2>
    <p>Confirm your details before submitting.</p>
  </nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};
