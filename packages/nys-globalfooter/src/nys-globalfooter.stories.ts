import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-globalfooter";

// Define the structure of the args used in the stories
interface NysGlobalFooterArgs {
  agencyName: string;
  homepageLink: string;
  disableHomepageLink: boolean;
}

const meta: Meta<NysGlobalFooterArgs> = {
  title: "Components/GlobalFooter",
  component: "nys-globalfooter",
  argTypes: {
    agencyName: { control: "text" },
    homepageLink: { control: "text" },
    disableHomepageLink: { control: "boolean" },
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
    <nys-globalfooter .agencyName=${args.agencyName}       .homepageLink=${args.homepageLink}
      ?disableHomepageLink=${args.disableHomepageLink}>
      <ul>
        <li><a href="https://its.ny.gov">ITS Home</a></li>
        <li><a href="https://its.ny.gov/about">About ITS</a></li>
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
    <li><a href="https://its.ny.gov/about">About ITS</a></li>
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
  },
  render: (args) => html`
    <nys-globalfooter .agencyName=${args.agencyName} .homepageLink=${args.homepageLink}
      ?disableHomepageLink=${args.disableHomepageLink}></nys-globalfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter agencyName="Office of Information Technology Services">
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
    <nys-globalfooter .agencyName=${args.agencyName}       .homepageLink=${args.homepageLink}
      ?disableHomepageLink=${args.disableHomepageLink}>
      <ul>
        <li><a href="https://its.ny.gov">ITS Home</a></li>
        <li><a href="https://its.ny.gov/about">About ITS</a></li>
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
    <li><a href="https://its.ny.gov/about">About ITS</a></li>
  </ul>
</nys-globalfooter>
`.trim(),
        type: "auto",
      },
    },
  },
};
