import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalheader";
import "@nysds/nys-button";
import "@nysds/nys-avatar";
import "@nysds/nys-dropdownmenu";

const meta: Meta = {
  title: "Components/Globalheader",
  component: "nys-globalheader",
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
      <nys-globalheader
        appName="User Registration Form"
        agencyName="Office of Information Technology Services"
      ></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader
  appName="User Registration Form"
  agencyName="Office of Information Technology Services"
></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const OnlyAgencyName: Story = {
  render: () => {
    return html`
      <nys-globalheader
        agencyName="Office of Information Technology Services"
      ></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Office of Information Technology Services"></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const OnlyAppName: Story = {
  render: () => {
    return html`
      <nys-globalheader appName="User Registration Form"></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader appName="User Registration Form"></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const WithLinks: Story = {
  render: () => {
    return html`
      <nys-globalheader agencyName="Office of Information Technology Services">
        <ul>
          <li><a href="https://its.ny.gov/services">Services</a></li>
          <li><a href="https://its.ny.gov/get-help">Help Center</a></li>
          <li><a href="https://its.ny.gov/cybersecurity">Cybersecurity</a></li>
          <li><a href="https://its.ny.gov/policies">Policies and Laws</a></li>
          <li><a href="https://its.ny.gov/procurement">Procurement</a></li>
          <li><a href="https://its.ny.gov/about-us">About Us</a></li>
        </ul>
      </nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Office of Information Technology Services">
  <ul>
    <li><a href="https://its.ny.gov/services">Services</a></li>
    <li><a href="https://its.ny.gov/get-help">Help Center</a></li>
    <li><a href="https://its.ny.gov/cybersecurity">Cybersecurity</a></li>
    <li><a href="https://its.ny.gov/policies">Policies and Laws</a></li>
    <li><a href="https://its.ny.gov/procurement">Procurement</a></li>
    <li><a href="https://its.ny.gov/about-us">About Us</a></li>
  </ul>
</nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const UserActions: Story = {
  render: () => {
    return html`
      <nys-globalheader agencyName="Office of Information Technology Services">
        <nys-button slot="user-actions" label="Log out">
          <nys-avatar
            slot="prefix-icon"
            ariaLabel="User avatar"
            initials="NY"
          ></nys-avatar>
        </nys-button>
      </nys-globalheader>
      <nys-dropdownmenu id="dropdownmenu" for="my-action-slot">
        <nys-dropdownmenuitem
          label="Profile"
          href="/profile"
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Repositories & Github Pages"
          href="/repos"
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Organizations"
          href="/organizations"
          disabled
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Sign out"
          href="/logout"
        ></nys-dropdownmenuitem>
      </nys-dropdownmenu>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Office of Information Technology Services">
  <nys-button slot="user-actions" label="Log out">
    <nys-avatar slot="prefix-icon" ariaLabel="User avatar" initials="NY"></nys-avatar>
  </nys-button>
</nys-globalheader>
<nys-dropdownmenu id="dropdownmenu" for="my-action-slot">
  <nys-dropdownmenuitem label="Profile" href="/profile"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Repositories & Github Pages" href="/repos"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Organizations" href="/organizations" disabled></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Sign out" href="/logout"></nys-dropdownmenuitem>
</nys-dropdownmenu>`,
        type: "auto",
      },
    },
  },
};

export const WithNYSLogo: Story = {
  render: () => {
    return html`
      <nys-globalheader nysLogo appName="Admin Dashboard"></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader nysLogo appName="Admin Dashboard"></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};
