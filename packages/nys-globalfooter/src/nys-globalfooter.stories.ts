import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-globalfooter";

// Define the structure of the args used in the stories
interface NysGlobalFooterArgs {
  agencyName: string;
}

const meta: Meta<NysGlobalFooterArgs> = {
  title: "Components/GlobalFooter",
  component: "nys-globalfooter",
  argTypes: {
    agencyName: { control: "text" },
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
    <nys-globalfooter .agencyName=${args.agencyName}>
      <ul>
        <li><a href="https://its.ny.gov">ITS Home</a></li>
        <li><a href="https://its.ny.gov/about">About ITS</a></li>
        <li><a href="https://its.ny.gov/contact">Contact ITS</a></li>
        <li><a href="https://its.ny.gov/privacy">Privacy Policy</a></li>
        <li><a href="https://its.ny.gov/accessibility">Accessibility</a></li>
        <li><a href="https://its.ny.gov/terms">Terms of Use</a></li>
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
    <li><a href="https://its.ny.gov/contact">Contact ITS</a></li>
    <li><a href="https://its.ny.gov/privacy">Privacy Policy</a></li>
    <li><a href="https://its.ny.gov/accessibility">Accessibility</a></li>
    <li><a href="https://its.ny.gov/terms">Terms of Use</a></li>
  </ul>
</nys-globalfooter>
        `,
        type: "auto",
      },
    },
  },
};

// Story: Without Links
export const WithoutLinks: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalfooter .agencyName=${args.agencyName}></nys-globalfooter>
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
export const WithLinks: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalfooter .agencyName=${args.agencyName}>
      <ul>
        <li><a href="https://its.ny.gov">ITS Home</a></li>
        <li><a href="https://its.ny.gov/about">About ITS</a></li>
        <li><a href="https://its.ny.gov/contact">Contact ITS</a></li>
        <li><a href="https://its.ny.gov/privacy">Privacy Policy</a></li>
        <li><a href="https://its.ny.gov/accessibility">Accessibility</a></li>
        <li><a href="https://its.ny.gov/terms">Terms of Use</a></li>
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
    <li><a href="https://its.ny.gov/contact">Contact ITS</a></li>
    <li><a href="https://its.ny.gov/privacy">Privacy Policy</a></li>
    <li><a href="https://its.ny.gov/accessibility">Accessibility</a></li>
    <li><a href="https://its.ny.gov/terms">Terms of Use</a></li>
  </ul>
</nys-globalfooter>
`.trim(),
        type: "auto",
      },
    },
  },
};
