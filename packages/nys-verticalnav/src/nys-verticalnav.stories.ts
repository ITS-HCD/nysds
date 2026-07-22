import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-verticalnav";
import "./nys-verticalnavgroup";
import "@nysds/nys-divider";
import "@nysds/nys-globalheader";
import "@nysds/nys-globalfooter";
import "@nysds/nys-button";

const meta: Meta = {
  title: "Components/Verticalnav",
  component: "nys-verticalnav",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const BasicVerticalNavGroup: Story = {
  args: {
    heading: "Page navigation",
    hideHeading: false,
    expanded: false,
    label: "Accessibility",
    disabled: false,
    active: false,
  },
  render: (args) => {
    return html`
      <nys-verticalnav
        header="NYS Design System"
        heading=${args.heading}
        ?hideHeading=${args.hideHeading}
        ?expanded=${args.expanded}
      >
        <ul>
          <li><a href="/foundations">Foundations</a></li>
          <li>
            <nys-verticalnavgroup
              label=${args.label}
              ?disabled=${args.disabled}
              ?active=${args.active}
            >
              <ul>
                <li><a href="">WCAG Guidelines</a></li>
                <li><a href="">Screen Readers</a></li>
                <li><a href="">Color Contrast</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav header="NYS Design System">
  <ul>
    <li><a href="/foundations">Foundations</a></li>
    <li>
      <nys-verticalnavgroup label="Accessibility">
        <ul>
          <li><a href="">WCAG Guidelines</a></li>
          <li><a href="">Screen Readers</a></li>
          <li><a href="">Color Contrast</a></li>
        </ul>
      </nys-verticalnavgroup>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const ActiveGroup: Story = {
  render: () => {
    return html`
      <nys-verticalnav header="NYS Design System">
        <ul>
          <li><a href="/foundations">Foundations</a></li>
          <li>
            <nys-verticalnavgroup label="Accessibility">
              <ul>
                <li>
                  <a aria-current="page" href="">WCAG Guidelines</a>
                </li>
                <li><a href="">Screen Readers</a></li>
                <li><a href="">Color Contrast</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav header="NYS Design System">
  <ul>
    <li><a href="/foundations">Foundations</a></li>
    <li>
      <nys-verticalnavgroup label="Accessibility">
        <ul>
          <li>
            <a aria-current="page" href="">WCAG Guidelines</a>
          </li>
          <li><a href="">Screen Readers</a></li>
          <li><a href="">Color Contrast</a></li>
        </ul>
      </nys-verticalnavgroup>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const DisabledGroup: Story = {
  render: () => {
    return html`
      <nys-verticalnav header="NYS Design System">
        <ul>
          <li>
            <nys-verticalnavgroup disabled label="Accessibility">
              <ul>
                <li>
                  <a aria-disabled="true">WCAG Guidelines</a>
                </li>
                <li><a href="">Screen Readers</a></li>
                <li><a href="">Color Contrast</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav header="NYS Design System">
  <ul>
    <li>
      <nys-verticalnavgroup disabled label="Accessibility">
        <ul>
          <li>
            <a aria-disabled="true">WCAG Guidelines</a>
          </li>
          <li><a href="">Screen Readers</a></li>
          <li><a href="">Color Contrast</a></li>
        </ul>
      </nys-verticalnavgroup>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const Basic: Story = {
  render: () => {
    return html`
      <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>
            <h3>Freshwater Fishing Regulations</h3>
            <ul>
              <li><a href="">Places to Fish</a></li>
              <li><a href="">Learn to Fish</a></li>
              <li><a href="">Ice Fishing</a></li>
            </ul>
          </li>
        </ul>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li>
      <h3>Freshwater Fishing Regulations</h3>
      <ul>
        <li><a href="">Places to Fish</a></li>
        <li><a href="">Learn to Fish</a></li>
        <li><a href="">Ice Fishing</a></li>
      </ul>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const HeaderSlot: Story = {
  render: () => {
    return html`
      <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
        <div slot="header">
          <h2>Freshwater Fishing</h2>
          <p>2026 Season Open</p>
        </div>

        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
        </ul>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
  <div slot="header">
    <h2>Freshwater Fishing</h2>
    <p>2026 Season Open</p>
  </div>

  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const FooterSlot: Story = {
  render: () => {
    return html`
      <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
        </ul>

        <div slot="footer">
          <nys-divider></nys-divider>
          <p>Regulations last updated: January 2026</p>
          <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
        </div>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
  </ul>

  <div slot="footer">
    <nys-divider></nys-divider>
    <p>Regulations last updated: January 2026</p>
    <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
  </div>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const HeadingAndFooter: Story = {
  render: () => {
    return html`
      <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
        <div slot="heading">
          <h2>Freshwater Fishing</h2>
          <p>2026 Season Open</p>
        </div>

        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
        </ul>

        <div slot="footer">
          <nys-divider></nys-divider>
          <p>Regulations last updated: January 2026</p>
          <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
        </div>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
  <div slot="heading">
    <h2>Freshwater Fishing</h2>
    <p>2026 Season Open</p>
  </div>

  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
  </ul>

  <div slot="footer">
    <nys-divider></nys-divider>
    <p>Regulations last updated: January 2026</p>
    <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
  </div>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const DropdownGroup: Story = {
  render: () => {
    return html`
      <nys-verticalnav heading="NYS Design System" headingLevel="h2">
        <ul>
          <li><a href="/">Foundations</a></li>
          <li><a href="/components">Components</a></li>
          <li>
            <nys-verticalnavgroup label="Accessibility">
              <ul>
                <li><a href="">WCAG Guidelines</a></li>
                <li><a href="">Screen Readers</a></li>
                <li><a href="">Color Contrast</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav heading="NYS Design System" headingLevel="h2">
  <ul>
    <li><a href="/">Foundations</a></li>
    <li><a href="/components">Components</a></li>
    <li>
      <nys-verticalnavgroup label="Accessibility">
        <ul>
          <li><a href="">WCAG Guidelines</a></li>
          <li><a href="">Screen Readers</a></li>
          <li><a href="">Color Contrast</a></li>
        </ul>
      </nys-verticalnavgroup>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const ActiveState: Story = {
  render: () => {
    return html`
      <nys-verticalnav heading="NYS Design System" headingLevel="h2">
        <ul>
          <li><a href="/">Foundations</a></li>
          <li>
            <nys-verticalnavgroup label="Accessibility">
              <ul>
                <li>
                  <a aria-current="page" href="">WCAG Guidelines</a>
                </li>
                <li><a href="">Screen Readers</a></li>
                <li><a href="">Color Contrast</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav heading="NYS Design System" headingLevel="h2">
  <ul>
    <li><a href="/">Foundations</a></li>
    <li>
      <nys-verticalnavgroup label="Accessibility">
        <ul>
          <li>
            <a aria-current="page" href="">WCAG Guidelines</a>
          </li>
          <li><a href="">Screen Readers</a></li>
          <li><a href="">Color Contrast</a></li>
        </ul>
      </nys-verticalnavgroup>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => {
    return html`
      <nys-verticalnav heading="NYS Design System" headingLevel="h2">
        <ul>
          <li><a href="/">Foundations</a></li>
          <li>
            <nys-verticalnavgroup disabled label="Accessibility">
              <ul>
                <li><a aria-disabled="true">WCAG Guidelines</a></li>
                <li><a href="">Screen Readers</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav heading="NYS Design System" headingLevel="h2">
  <ul>
    <li><a href="/">Foundations</a></li>
    <li>
      <nys-verticalnavgroup disabled label="Accessibility">
        <ul>
          <li><a aria-disabled="true">WCAG Guidelines</a></li>
          <li><a href="">Screen Readers</a></li>
        </ul>
      </nys-verticalnavgroup>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const HiddenHeading: Story = {
  render: () => {
    return html`
      <nys-verticalnav heading="Section navigation" hideHeading>
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/service">Service</a></li>
        </ul>
      </nys-verticalnav>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav heading="Section navigation" hideHeading>
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/service">Service</a></li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const PageLayout: Story = {
  render: () => {
    return html`
      <nys-globalheader
        homepageLink="https://ny.gov"
        agencyName="Office of Information Technology Services"
      ></nys-globalheader>

      <nys-verticalnav heading="NYS Design System" headingLevel="h2">
        <ul>
          <li><a href="/">Foundations</a></li>
          <li><a href="/components" aria-current="page">Components</a></li>
          <li>
            <nys-verticalnavgroup label="Accessibility">
              <ul>
                <li><a href="">WCAG Guidelines</a></li>
                <li><a href="">Screen Readers</a></li>
                <li><a href="">Color Contrast</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>

      <main>
        <p>Place content here.</p>
      </main>

      <nys-globalfooter></nys-globalfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader
  homepageLink="https://ny.gov"
  agencyName="Office of Information Technology Services"
></nys-globalheader>

<nys-verticalnav heading="NYS Design System" headingLevel="h2">
  <ul>
    <li><a href="/">Foundations</a></li>
    <li><a href="/components" aria-current="page">Components</a></li>
    <li>
      <nys-verticalnavgroup label="Accessibility">
        <ul>
          <li><a href="">WCAG Guidelines</a></li>
          <li><a href="">Screen Readers</a></li>
          <li><a href="">Color Contrast</a></li>
        </ul>
      </nys-verticalnavgroup>
    </li>
  </ul>
</nys-verticalnav>

<main>
  <p>Place content here.</p>
</main>

<nys-globalfooter></nys-globalfooter>`,
        type: "auto",
      },
    },
  },
};

export const MobileControls: Story = {
  render: () => {
    return html`
      <nys-verticalnav id="my-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
        </ul>
      </nys-verticalnav>

      <nys-button
        label="Toggle navigation"
        onclick="document.querySelector('#my-nav').toggle()"
      ></nys-button>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav id="my-nav">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
  </ul>
</nys-verticalnav>

<nys-button
  label="Toggle navigation"
  onclick="document.querySelector('#my-nav').toggle()"
></nys-button>`,
        type: "auto",
      },
    },
  },
};
