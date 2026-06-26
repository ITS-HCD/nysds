import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalfooter";

const meta: Meta = {
  title: "Components/Globalfooter",
  component: "nys-globalfooter",
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
      <nys-globalfooter
        agencyName="Office of Information Technology Services"
      ></nys-globalfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter agencyName="Office of Information Technology Services"></nys-globalfooter>`,
        type: "auto",
      },
    },
  },
};

export const HomepageLink: Story = {
  render: () => {
    return html`
      <nys-globalfooter
        agencyName="Office of Information Technology Services"
        homepageLink="https://its.ny.gov"
      ></nys-globalfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter
  agencyName="Office of Information Technology Services"
  homepageLink="https://its.ny.gov"
></nys-globalfooter>`,
        type: "auto",
      },
    },
  },
};

export const MenuLinks: Story = {
  render: () => {
    return html`
      <nys-globalfooter agencyName="Office of Information Technology Services">
        <ul>
          <li><a href="https://its.ny.gov">ITS Home</a></li>
          <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
        </ul>
      </nys-globalfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter agencyName="Office of Information Technology Services">
  <ul>
    <li><a href="https://its.ny.gov">ITS Home</a></li>
    <li><a href="https://its.ny.gov/about-us">About ITS</a></li>
  </ul>
</nys-globalfooter>`,
        type: "auto",
      },
    },
  },
};

export const ColumnLinks: Story = {
  render: () => {
    return html`
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
              <li>
                <a href="https://its.ny.gov/resources">Developer Tools</a>
              </li>
              <li>
                <a href="https://its.ny.gov/accessibility">Accessibility</a>
              </li>
              <li><a href="https://its.ny.gov/privacy">Privacy</a></li>
            </ul>
          </li>
        </ul>
      </nys-globalfooter>
    `;
  },
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
</nys-globalfooter>`,
        type: "auto",
      },
    },
  },
};

export const Subheading: Story = {
  render: () => {
    return html`
      <nys-globalfooter
        agencyName="Office of Information Technology Services"
        agencySubheading="Innovating Technology for a Better New York"
      ></nys-globalfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter
  agencyName="Office of Information Technology Services"
  agencySubheading="Innovating Technology for a Better New York"
></nys-globalfooter>`,
        type: "auto",
      },
    },
  },
};
