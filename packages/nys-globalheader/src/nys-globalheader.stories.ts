import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalheader";
import "@nysds/nys-avatar";
import "@nysds/nys-button";
import "@nysds/nys-dropdownmenu";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Globalheader",
  component: "nys-globalheader",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'Agency-branded header with app/agency name, navigation, and responsive mobile menu.\n\nPlace below `nys-unavheader`. Slot navigation links as `<ul><li><a>` elements; active links\nare auto-highlighted based on current URL, unless you set `aria-current` on a link\nyourself — then the header leaves the current-page state entirely to you, which is\nwhat apps that don\'t route on the pathname (hash-routed SPAs, for example) need.\nMobile menu toggles automatically on narrow screens.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysGlobalHeader appName="User Registration Form" agencyName="Office of Information Technology Services" />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-globalheader appName="User Registration Form" agencyName="Office of Information Technology Services"></nys-globalheader>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    appName: "User Registration Form",
    agencyName: "Office of Information Technology Services",
    homepageLink: "",
    nysLogo: false,
    landmarkLabel: "",
  },
  render: (args) => {
    return html`
      <nys-globalheader
        appName=${args.appName}
        agencyName=${args.agencyName}
        homepageLink=${args.homepageLink}
        ?nysLogo=${args.nysLogo}
        landmarkLabel=${args.landmarkLabel}
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

export const HomepageLink: Story = {
  render: () => {
    return html`
      <nys-globalheader
        agencyName="Office of Information Technology Services"
        homepageLink="https://its.ny.gov"
      ></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader
  agencyName="Office of Information Technology Services"
  homepageLink="https://its.ny.gov"
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

export const AuthorcontrolledActiveLink: Story = {
  render: () => {
    return html`
      <!-- Set aria-current yourself and the header stops guessing from the URL. -->
      <nys-globalheader agencyName="Office of Information Technology Services">
        <ul>
          <li><a href="#/services">Services</a></li>
          <li><a href="#/help" aria-current="page">Help Center</a></li>
        </ul>
      </nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Set aria-current yourself and the header stops guessing from the URL. -->
<nys-globalheader agencyName="Office of Information Technology Services">
  <ul>
    <li><a href="#/services">Services</a></li>
    <li><a href="#/help" aria-current="page">Help Center</a></li>
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

export const CustomLandmarkLabel: Story = {
  render: () => {
    return html`
      <!-- Names the banner landmark directly instead of from the visible title.
      Keep it distinct from nys-unavheader's ("New York State"). -->
      <nys-globalheader
        agencyName="Office of Information Technology Services"
        landmarkLabel="ITS"
      ></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Names the banner landmark directly instead of from the visible title.
Keep it distinct from nys-unavheader's ("New York State"). -->
<nys-globalheader
  agencyName="Office of Information Technology Services"
  landmarkLabel="ITS"
></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};
