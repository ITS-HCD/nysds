import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalheader";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysGlobalHeaderArgs {
  appName: string;
  agencyName: string;
  homepageLink: string;
}

const meta: Meta<NysGlobalHeaderArgs> = {
  title: "Components/GlobalHeader",
  component: "nys-globalheader",
  argTypes: {
    appName: { control: "text" },
    agencyName: { control: "text" },
    homepageLink: { control: "text" },
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

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Basic
export const Basic: Story = {
  args: {
    appName: "User Registration Form",
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalheader
      .agencyName=${args.agencyName}
      .appName=${args.appName}
      .homepageLink=${args.homepageLink}
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

// Story: Without Application Name
export const OnlyAgencyName: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
    homepageLink: "https://its.ny.gov",
  },
  render: (args) => html`
    <nys-globalheader
      .agencyName=${args.agencyName}
      .appName=${args.appName}
      .homepageLink=${args.homepageLink}
    >
    </nys-globalheader>
  `,
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

// Story: Without Application Name
export const OnlyAppName: Story = {
  args: {
    appName: "NYS Employee Portal",
  },
  render: (args) => html`
    <nys-globalheader
      .agencyName=${args.agencyName}
      .appName=${args.appName}
      .homepageLink=${args.homepageLink}
    >
    </nys-globalheader>
  `,
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

// Story: Without Application Name
export const WithBothNames: Story = {
  args: {
    appName: "Unemployment Insurance Benefits",
    agencyName: "Department of Labor",
  },
  render: (args) => html`
    <nys-globalheader
      .agencyName=${args.agencyName}
      .appName=${args.appName}
      .homepageLink=${args.homepageLink}
    >
    </nys-globalheader>
  `,
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

// Story: Without Application Name
export const WithLinks: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalheader
      .agencyName=${args.agencyName}
      .appName=${args.appName}
      .homepageLink=${args.homepageLink}
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
