import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalfooter";
import "@nysds/nys-divider";

const meta: Meta = {
  title: "Components/Globalfooter",
  component: "nys-globalfooter",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'Agency-branded footer with agency name and slotted content sections. Auto-layouts based on content structure.\n\nPlace above `nys-unavfooter`. Slot contact info, links, or other content. Use `<h4>` elements\nto create multi-column layouts; without `<h4>`, renders as compact single section.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysGlobalFooter agencyName="Office of Information Technology Services" />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-globalfooter agencyName="Office of Information Technology Services"></nys-globalfooter>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
    agencySubheading: "",
    homepageLink: "",
    landmarkLabel: "",
  },
  render: (args) => {
    return html`
      <nys-globalfooter
        agencyName=${args.agencyName}
        agencySubheading=${args.agencySubheading}
        homepageLink=${args.homepageLink}
        landmarkLabel=${args.landmarkLabel}
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

export const CustomLandmarkLabel: Story = {
  render: () => {
    return html`
      <!-- Names the contentinfo landmark directly instead of from the visible
      heading. Keep it distinct from nys-unavfooter's ("New York State"). -->
      <nys-globalfooter
        agencyName="Office of Information Technology Services"
        landmarkLabel="ITS"
      ></nys-globalfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Names the contentinfo landmark directly instead of from the visible
heading. Keep it distinct from nys-unavfooter's ("New York State"). -->
<nys-globalfooter
  agencyName="Office of Information Technology Services"
  landmarkLabel="ITS"
></nys-globalfooter>`,
        type: "auto",
      },
    },
  },
};
