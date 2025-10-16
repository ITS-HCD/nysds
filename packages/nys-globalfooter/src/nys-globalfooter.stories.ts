import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalfooter";

// Define the structure of the args used in the stories
interface NysGlobalFooterArgs {
  agencyName: string;
  homepageLink: string;
}

const meta: Meta<NysGlobalFooterArgs> = {
  title: "Components/GlobalFooter",
  component: "nys-globalfooter",
  argTypes: {
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
type Story = StoryObj<NysGlobalFooterArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Basic
export const Basic: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalfooter
      .agencyName=${args.agencyName}
      .homepageLink=${args.homepageLink}
    >
      <ul>
        <li><a href="https://its.ny.gov">ITS Home</a></li>
        <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
      </ul>
    </nys-globalfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter agencyName="Office of Information Technology Services">
 <ul>
    <li><a href="https://its.ny.gov">ITS Home</a></li>
    <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
  </ul>
</nys-globalfooter>
        `,
        type: "auto",
      },
    },
  },
};

// Story: Without Links
export const WithoutMenuLinks: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
    homepageLink: "https://its.ny.gov",
  },
  render: (args) => html`
    <nys-globalfooter
      .agencyName=${args.agencyName}
      .homepageLink=${args.homepageLink}
    ></nys-globalfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter agencyName="Office of Information Technology Services" homepageLink="https://its.ny.gov">
</nys-globalfooter>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: With Links
export const WithMenuLinks: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalfooter
      .agencyName=${args.agencyName}
      .homepageLink=${args.homepageLink}
    >
      <ul>
        <li><a href="https://its.ny.gov">ITS Home</a></li>
        <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
      </ul>
    </nys-globalfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter agencyName="Office of Information Technology Services">
  <ul>
    <li><a href="https://its.ny.gov">ITS Home</a></li>
    <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
  </ul>
</nys-globalfooter>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: With Column Links
export const WithColumnLinks: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalfooter
      .agencyName=${args.agencyName}
      .homepageLink=${args.homepageLink}
    >
      <ul>
        <li>
          <span>About</span>
          <ul>
            <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
            <li><a href="https://its.ny.gov/contact-us">Contact</a></li>
            <li><a href="https://its.ny.gov/policies">Policies</a></li>
          </ul>
        </li>
        <li>
          <span>Resources</span>
          <ul>
            <li><a href="https://its.ny.gov/resources">Developer Tools</a></li>
            <li><a href="https://its.ny.gov/accessibility">Accessibility</a></li>
            <li><a href="https://its.ny.gov/privacy">Privacy</a></li>
          </ul>
        </li>
      </ul>
    </nys-globalfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter agencyName="Office of Information Technology Services">
  <ul>
    <li>
      <span>About</span>
      <ul>
        <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
        <li><a href="https://its.ny.gov/contact-us">Contact</a></li>
        <li><a href="https://its.ny.gov/policies">Policies</a></li>
      </ul>
    </li>
    <li>
      <span>Resources</span>
      <ul>
        <li><a href="https://its.ny.gov/resources">Developer Tools</a></li>
        <li><a href="https://its.ny.gov/accessibility">Accessibility</a></li>
        <li><a href="https://its.ny.gov/privacy">Privacy</a></li>
      </ul>
    </li>
  </ul>
</nys-globalfooter>
`.trim(),
        type: "auto",
      },
    },
  },
};
