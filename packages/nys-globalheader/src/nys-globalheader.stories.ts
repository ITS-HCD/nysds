import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalheader";
import "@nysds/nys-icon";
import "@nysds/nys-avatar";
import "@nysds/nys-button";
import "@nysds/nys-dropdownmenu";

// Define the structure of the args used in the stories
interface NysGlobalHeaderArgs {
  appName: string;
  agencyName: string;
  homepageLink: string;
  showBrandMark: boolean;
}

const meta: Meta<NysGlobalHeaderArgs> = {
  title: "Components/GlobalHeader",
  component: "nys-globalheader",
  argTypes: {
    appName: { control: "text" },
    agencyName: { control: "text" },
    homepageLink: { control: "text" },
    showBrandMark: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysGlobalHeaderArgs>;

export const Basic: Story = {
  args: {
    appName: "User Registration Form",
    agencyName: "Office of Information Technology Services",
    showBrandMark: false,
  },
  render: (args) => html`
    <nys-globalheader
      .agencyName=${args.agencyName}
      .appName=${args.appName}
      .homepageLink=${args.homepageLink}
      ?showBrandMark=${args.showBrandMark}
    >
    </nys-globalheader>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader appName="User Registration Form" agencyName="Office of Information Technology Services">
</nys-globalheader>
        `,
        type: "auto",
      },
    },
  },
};

export const OnlyAgencyName: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
    homepageLink: "https://its.ny.gov",
  },
  render: Basic.render,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Office of Information Technology Services" homepageLink="https://its.ny.gov">
</nys-globalheader>
`.trim(),
        type: "auto",
      },
    },
  },
};

export const OnlyAppName: Story = {
  args: {
    appName: "NYS Employee Portal",
  },
  render: Basic.render,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader appName="NYS Employee Portal">
</nys-globalheader>
`.trim(),
        type: "auto",
      },
    },
  },
};

export const WithBothNames: Story = {
  args: {
    appName: "Unemployment Insurance Benefits",
    agencyName: "Department of Labor",
  },
  render: Basic.render,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Department of Labor" appName="Unemployment Insurance Benefits">
</nys-globalheader>
`.trim(),
        type: "auto",
      },
    },
  },
};

export const WithLinks: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalheader
      .agencyName=${args.agencyName}
      .appName=${args.appName}
      .homepageLink=${args.homepageLink}
      ?showBrandMark=${args.showBrandMark}
    >
      <ul>
        <li><a href="https://its.ny.gov/services">Services</a></li>
        <li><a href="https://its.ny.gov/get-help">Help Center</a></li>
        <li><a href="https://its.ny.gov/cybersecurity">Cybersecurity</a></li>
        <li><a href="https://its.ny.gov/policies">Policies and Laws</a></li>
        <li><a href="https://its.ny.gov/procurement">Procurement</a></li>
        <li><a href="https://its.ny.gov/about-us">About Us</a></li>
      </ul>
    </nys-globalheader>
  `,
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
</nys-globalheader>
`.trim(),
        type: "auto",
      },
    },
  },
};

export const UserActions: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalheader
      .agencyName=${args.agencyName}
      .appName=${args.appName}
      .homepageLink=${args.homepageLink}
    >
      <nys-button id="my-action-slot" slot="user-actions" label="Log out" prefixIcon="slotted">
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
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Office of Information Technology Services">
  <nys-button slot="user-actions" label="Log out" prefixIcon="slotted">
    <nys-avatar
      slot="prefix-icon"
      ariaLabel="User avatar"
      initials="NY"
    ></nys-avatar>
  </nys-button>
</nys-globalheader>
<nys-dropdownmenu id="dropdownmenu" for="my-action-slot">
  <nys-dropdownmenuitem label="Profile" href="/profile"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Repositories & Github Pages" href="/repos"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Organizations" href="/organizations" disabled></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Sign out" href="/logout"></nys-dropdownmenuitem>
</nys-dropdownmenu>
`.trim(),
        type: "auto",
      },
    },
  },
};

export const WithBrandMark: Story = {
  args: {
    ...Basic.args,
    showBrandMark: true,
  },
  render: Basic.render,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader appName="User Registration Form" agencyName="Office of Information Technology Services">
</nys-globalheader>
        `,
        type: "auto",
      },
    },
  },
};
