import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-verticalnav";
import "@nysds/nys-divider";
import "./nys-verticalnavgroup";
import "@nysds/nys-unavheader";
import "@nysds/nys-globalheader";
import "@nysds/nys-globalfooter";
import "@nysds/nys-unavfooter";

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

export const Basic: Story = {
  args: {
    heading: "Freshwater Fishing",
    hideHeading: false,
    expanded: false,
  },
  render: (args) => {
    return html`
      <nys-verticalnav
        headingLevel="h2"
        heading=${args.heading}
        ?hideHeading=${args.hideHeading}
        ?expanded=${args.expanded}
      >
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
      <style>
        [slot="header"] p {
          margin: 0;
          font-size: var(--nys-font-size-xs, 0.75rem);
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--nys-color-success, #2e7d32);
        }
        [slot="header"] h2 {
          margin: 0;
          font-size: var(--nys-font-size-h4, 1.25rem);
          color: var(--nys-color-theme, #154973);
        }
      </style>

      <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
        <div slot="header">
          <h2>Freshwater Fishing</h2>
          <p>2026 Season Open</p>
        </div>
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
  <div slot="header">
    <h2>Freshwater Fishing</h2>
    <p>2026 Season Open</p>
  </div>
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

export const FooterSlot: Story = {
  render: () => {
    return html`
      <style>
        [slot="footer"] {
          display: flex;
          flex-direction: column;
          gap: var(--nys-space-100, 8px);
        }
        [slot="footer"] p {
          margin: 0;
          font-size: var(--nys-font-size-xs, 0.75rem);
          color: var(--nys-color-text-weak, #4a4d4f);
        }
        [slot="footer"] a {
          font-size: var(--nys-font-size-sm, 0.875rem);
          color: var(--nys-color-theme, #154973);
        }
      </style>

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

        <div
          slot="footer"
          style="font-size: 0.875rem; color: #555; padding-top: 0.5rem"
        >
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
    <li>
      <h3>Freshwater Fishing Regulations</h3>
      <ul>
        <li><a href="">Places to Fish</a></li>
        <li><a href="">Learn to Fish</a></li>
        <li><a href="">Ice Fishing</a></li>
      </ul>
    </li>
  </ul>
  <div slot="footer" style="font-size: 0.875rem; color: #555; padding-top: 0.5rem">
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

export const HeaderAndFooterSlot: Story = {
  render: () => {
    return html`
      <style>
        [slot="header"] p {
          margin: 0;
          font-size: var(--nys-font-size-xs, 0.75rem);
          letter-spacing: 0.08em;
          color: var(--nys-color-success, #2e7d32);
          font-weight: 500;
        }
        [slot="header"] h2 {
          margin: 0;
          font-size: var(--nys-font-size-h4, 1.25rem);
          color: var(--nys-color-theme, #154973);
        }
        [slot="footer"] {
          display: flex;
          flex-direction: column;
          gap: var(--nys-space-100, 8px);
        }
        [slot="footer"] p {
          margin: 0;
          font-size: var(--nys-font-size-xs, 0.75rem);
          color: var(--nys-color-text-weak, #4a4d4f);
        }
        [slot="footer"] a {
          font-size: var(--nys-font-size-sm, 0.875rem);
          color: var(--nys-color-theme, #154973);
        }
      </style>

      <nys-verticalnav heading="Freshwater Fishing" headingLevel="h2">
        <div slot="header">
          <h2>Freshwater Fishing</h2>
          <p>2026 Season Open</p>
        </div>
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
  <div slot="header">
    <h2>Freshwater Fishing</h2>
    <p>2026 Season Open</p>
  </div>
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
          <li>
            <h3>Resources</h3>
            <ul>
              <li><a href="">Design Tokens</a></li>
              <li><a href="">Utilities</a></li>
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
    <li>
      <h3>Resources</h3>
      <ul>
        <li><a href="">Design Tokens</a></li>
        <li><a href="">Utilities</a></li>
      </ul>
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
          <li><a href="/components">Components</a></li>
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
          <li>
            <h3>Resources</h3>
            <ul>
              <li><a href="">Design Tokens</a></li>
              <li><a href="">Utilities</a></li>
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
<nys-verticalnav heading="NYS Design System" headingLevel="h2">
  <ul>
    <li><a href="/">Foundations</a></li>
    <li><a href="/components">Components</a></li>
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
    <li>
      <h3>Resources</h3>
      <ul>
        <li><a href="">Design Tokens</a></li>
        <li><a href="">Utilities</a></li>
      </ul>
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
          <li><a href="/components">Components</a></li>
          <li>
            <nys-verticalnavgroup disabled label="Accessibility">
              <ul>
                <li><a aria-disabled="true">WCAG Guidelines</a></li>
                <li><a href="">Screen Readers</a></li>
                <li><a href="">Color Contrast</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
          <li>
            <h3>Resources</h3>
            <ul>
              <li><a aria-disabled="true">Design Tokens</a></li>
              <li><a href="">Utilities</a></li>
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
<nys-verticalnav heading="NYS Design System" headingLevel="h2">
  <ul>
    <li><a href="/">Foundations</a></li>
    <li><a href="/components">Components</a></li>
    <li>
      <nys-verticalnavgroup disabled label="Accessibility">
        <ul>
          <li><a aria-disabled="true">WCAG Guidelines</a></li>
          <li><a href="">Screen Readers</a></li>
          <li><a href="">Color Contrast</a></li>
        </ul>
      </nys-verticalnavgroup>
    </li>
    <li>
      <h3>Resources</h3>
      <ul>
        <li><a aria-disabled="true">Design Tokens</a></li>
        <li><a href="">Utilities</a></li>
      </ul>
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
      <nys-verticalnav heading="NYS Design System" hideHeading>
        <ul>
          <li><a href="/">Foundations</a></li>
          <li><a href="/components">Components</a></li>
          <li>
            <nys-verticalnavgroup disabled label="Accessibility">
              <ul>
                <li><a aria-disabled="true">WCAG Guidelines</a></li>
                <li><a href="">Screen Readers</a></li>
                <li><a href="">Color Contrast</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
          <li>
            <h3>Resources</h3>
            <ul>
              <li><a aria-disabled="true">Design Tokens</a></li>
              <li><a href="">Utilities</a></li>
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
<nys-verticalnav heading="NYS Design System" hideHeading>
  <ul>
    <li><a href="/">Foundations</a></li>
    <li><a href="/components">Components</a></li>
    <li>
      <nys-verticalnavgroup disabled label="Accessibility">
        <ul>
          <li><a aria-disabled="true">WCAG Guidelines</a></li>
          <li><a href="">Screen Readers</a></li>
          <li><a href="">Color Contrast</a></li>
        </ul>
      </nys-verticalnavgroup>
    </li>
    <li>
      <h3>Resources</h3>
      <ul>
        <li><a aria-disabled="true">Design Tokens</a></li>
        <li><a href="">Utilities</a></li>
      </ul>
    </li>
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
      <style>
        .page-layout__body {
          background-color: var(--nys-color-white, #ffffff);
        }
        .page-layout__nav {
          padding: var(--nys-space-300, 24px) var(--nys-space-50, 4px)
            var(--nys-space-300, 24px) 0;
        }
        .page-layout__main {
          padding: var(--nys-space-400, 32px);
        }
      </style>
      <div>
        <nys-unavheader></nys-unavheader>
        <nys-globalheader
          homepageLink="https://ny.gov"
          agencyName="Office of Information Technology Services"
        >
          <ul>
            <li><a href="https://its.ny.gov/services">Services</a></li>
            <li><a href="https://its.ny.gov/get-help">Help Center</a></li>
          </ul>
        </nys-globalheader>
        <div class="page-layout__body">
          <div class="nys-grid-container nys-grid-gap-400">
            <div class="nys-grid-row">
              <div class="nys-desktop:nys-grid-col page-layout__nav">
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
                    <li>
                      <h3>Resources</h3>
                      <ul>
                        <li><a href="">Design Tokens</a></li>
                        <li><a href="">Utilities</a></li>
                      </ul>
                    </li>
                  </ul>
                </nys-verticalnav>
              </div>
              <main class="nys-desktop:nys-grid-col page-layout__main">
                <p>Place content here.</p>
              </main>
            </div>
          </div>
        </div>
        <nys-globalfooter
          agencyName="Agency Name"
          homepageLink="https://ny.gov"
        >
          <ul>
            <li><a href="https://">Privacy Policy</a></li>
            <li><a href="https://">Terms of Service</a></li>
          </ul>
        </nys-globalfooter>
        <nys-unavfooter></nys-unavfooter>
      </div>
      \`\`\`
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="story-page">
  <nys-unavheader></nys-unavheader>

  <nys-globalheader
    homepageLink="https://ny.gov"
    agencyName="Office of Information Technology Services"
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

  <div class="story-page__body">
    <div class="story-page__body--side">
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
          <li>
            <h3>Resources</h3>
            <ul>
              <li><a href="">Design Tokens</a></li>
              <li><a href="">Utilities</a></li>
              <li><a href="">Learn</a></li>
              <li><a href="">What's New</a></li>
            </ul>
          </li>
        </ul>
      </nys-verticalnav>
    </div>

    <main class="story-page__body--main">
      <p>Place content here.</p>
      <nys-button
        label="Toggle Expand/Collapse for vertical nav (mobile)"
        onclick="document.querySelector('nys-verticalnav').toggle()"
      ></nys-button>
    </main>
  </div>

  <nys-globalfooter agencyName="{agencyName}" homepageLink="https://">
    <ul>
      <li><a href="https://">Privacy Policy</a></li>
      <li><a href="https://">Terms of Service</a></li>
    </ul>
  </nys-globalfooter>

  <nys-unavfooter></nys-unavfooter>
</div>`,
        type: "auto",
      },
    },
  },
};
