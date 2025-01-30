import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-unavfooter";

const meta: Meta = {
  title: "Components/UnavFooter",
  component: "nys-unavfooter",
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Basic
export const Basic: Story = {
  render: () => html`
    <nys-unavfooter>
      <ul>
        <li><a href="https://its.ny.gov/agencies">Agencies</a></li>
        <li><a href="https://its.ny.gov/app-directory">App Directory</a></li>
        <li><a href="https://its.ny.gov/counties">Counties</a></li>
        <li><a href="https://its.ny.gov/events">Events</a></li>
        <li><a href="https://its.ny.gov/programs">Programs</a></li>
        <li><a href="https://its.ny.gov/services">Services</a></li>
      </ul>
    </nys-unavfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavfooter>
  <ul>
    <li><a href="https://its.ny.gov/agencies">Agencies</a></li>
    <li><a href="https://its.ny.gov/app-directory">App Directory</a></li>
    <li><a href="https://its.ny.gov/counties">Counties</a></li>
    <li><a href="https://its.ny.gov/events">Events</a></li>
    <li><a href="https://its.ny.gov/programs">Programs</a></li>
    <li><a href="https://its.ny.gov/services">Services</a></li>
  </ul>
</nys-unavfooter>
        `,
        type: "auto",
      },
    },
  },
};

// Story: Without Links
export const WithoutLinks: Story = {
  render: () => html`
    <nys-unavfooter></nys-unavfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavfooter>
</nys-unavfooter>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: With Links
export const WithLinks: Story = {
  render: () => html`
    <nys-unavfooter>
      <ul>
        <li><a href="https://its.ny.gov/agencies">Agencies</a></li>
        <li><a href="https://its.ny.gov/app-directory">App Directory</a></li>
        <li><a href="https://its.ny.gov/counties">Counties</a></li>
        <li><a href="https://its.ny.gov/events">Events</a></li>
        <li><a href="https://its.ny.gov/programs">Programs</a></li>
        <li><a href="https://its.ny.gov/services">Services</a></li>
      </ul>
    </nys-unavfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavfooter agencyName="Office of Information Technology Services">
  <ul>
    <li><a href="https://its.ny.gov/agencies">Agencies</a></li>
    <li><a href="https://its.ny.gov/app-directory">App Directory</a></li>
    <li><a href="https://its.ny.gov/counties">Counties</a></li>
    <li><a href="https://its.ny.gov/events">Events</a></li>
    <li><a href="https://its.ny.gov/programs">Programs</a></li>
    <li><a href="https://its.ny.gov/services">Services</a></li>
  </ul>
</nys-unavfooter>
`.trim(),
        type: "auto",
      },
    },
  },
};
