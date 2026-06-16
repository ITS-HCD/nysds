import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-verticalnav";
import "@nysds/nys-icon";
import "@nysds/nys-accordion";
import "@nysds/nys-divider";
import "@nysds/nys-unavheader";
import "@nysds/nys-unavfooter";
import "@nysds/nys-globalheader";
import "@nysds/nys-globalfooter";

interface NysVerticalnavArgs {
  id: string;
  hideHeader: boolean;
  headerLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  header: string;
}

const meta: Meta<NysVerticalnavArgs> = {
  title: "Components/Verticalnav",
  component: "nys-verticalnav",
  argTypes: {
    id: { control: "text" },
    header: { control: "text" },
    hideHeader: { control: "boolean" },
    headerLevel: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
    },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysVerticalnavArgs>;

export const Basic: Story = {
  args: {
    id: "verticalnav1",
    header: "Freshwater Fishing",
    hideHeader: false,
    headerLevel: "h2",
  },
  render: (args) => html`
    <nys-verticalnav
      id=${args.id}
      header=${args.header}
      ?hideHeader=${args.hideHeader}
      headerLevel=${args.headerLevel}
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
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav header="Freshwater Fishing" headerLevel="h2">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services"><nys-icon></nys-icon> Services</a></li>
    <li>
      <h3>{{Section Header}}</h3>
      <ul>
        <li><a href="">{{sublinktext}}</a></li>
        <li><a href="">{{sublinktext}}</a></li>
      </ul>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const WithHeaderSlot: Story = {
  args: {
    id: "verticalnav2",
    header: "Freshwater Fishing",
    hideHeader: false,
    headerLevel: "h2",
  },
  render: (args) => html`
    <style>
      [slot="header"] p {
        margin: 0;
        font-size: var(--nys-font-size-xs, 0.75rem);
        color: var(--nys-color-text-weak, #4a4d4f);
        letter-spacing: 0.08em;
        font-weight: 600;
      }
      [slot="header"] h2 {
        margin: 0;
        font-size: var(--nys-font-size-h4, 1.25rem);
        color: var(--nys-color-theme, #154973);
      }
      [slot="header"] p:last-child {
        font-size: var(--nys-font-size-xs, 0.75rem);
        color: var(--nys-color-success, #2e7d32);
        font-weight: 500;
      }
    </style>
    <nys-verticalnav
      id=${args.id}
      header=${args.header}
      ?hideHeader=${args.hideHeader}
      headerLevel=${args.headerLevel}
    >
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
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav header="Freshwater Fishing" headerLevel="h2">
  <div slot="header">
    <h2>🎣 Freshwater Fishing</h2>
    <p>2024 Season Guide</p>
  </div>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li>
      <h3>{{Section Header}}</h3>
      <ul>
        <li><a href="">{{sublinktext}}</a></li>
        <li><a href="">{{sublinktext}}</a></li>
      </ul>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const WithFooterSlot: Story = {
  args: {
    id: "verticalnav3",
    header: "Freshwater Fishing",
    hideHeader: false,
    headerLevel: "h2",
  },
  render: (args) => html`
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

    <nys-verticalnav
      id=${args.id}
      header=${args.header}
      ?hideHeader=${args.hideHeader}
      headerLevel=${args.headerLevel}
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
      <div
        slot="footer"
        style="font-size:0.875rem;color:#555;padding-top:0.5rem"
      >
        <nys-divider></nys-divider>
        <p>Regulations last updated: January 2024</p>
        <a href="/contact-dec">Contact the DEC for fishing inquiries</a>
      </div>
    </nys-verticalnav>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav header="Freshwater Fishing" headerLevel="h2">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li>
      <h3>{{Section Header}}</h3>
      <ul>
        <li><a href="">{{sublinktext}}</a></li>
        <li><a href="">{{sublinktext}}</a></li>
      </ul>
    </li>
  </ul>
  <div slot="footer">
    <nys-divider></nys-divider>
    <p>Last updated: January 2024</p>
  </div>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const WithHeaderAndFooterSlot: Story = {
  args: {
    id: "verticalnav4",
    header: "Freshwater Fishing",
    hideHeader: false,
    headerLevel: "h2",
  },
  render: (args) => html`
    <nys-verticalnav
      id=${args.id}
      header=${args.header}
      ?hideHeader=${args.hideHeader}
      headerLevel=${args.headerLevel}
    >
      <div slot="header">
        <h2 style="margin:0">🎣 Freshwater Fishing</h2>
        <p style="margin:0;font-size:0.875rem;color:#555">2024 Season Guide</p>
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
      <div
        slot="footer"
        style="font-size:0.875rem;color:#555;padding-top:0.5rem"
      >
        <nys-divider></nys-divider>
        <p style="margin:0.5rem 0 0">Last updated: January 2024</p>
      </div>
    </nys-verticalnav>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav header="Freshwater Fishing" headerLevel="h2">
  <div slot="header">
    <h2>🎣 Freshwater Fishing</h2>
    <p>2024 Season Guide</p>
  </div>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li>
      <h3>{{Section Header}}</h3>
      <ul>
        <li><a href="">{{sublinktext}}</a></li>
        <li><a href="">{{sublinktext}}</a></li>
      </ul>
    </li>
  </ul>
  <div slot="footer">
    <nys-divider></nys-divider>
    <p>Last updated: January 2024</p>
  </div>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};

export const WithDropdownGroup: Story = {
  args: {
    id: "verticalnav5",
    header: "NYS Design System",
    hideHeader: false,
    headerLevel: "h2",
  },
  render: (args) => html`
    <nys-verticalnav
      id=${args.id}
      header=${args.header}
      ?hideHeader=${args.hideHeader}
      headerLevel=${args.headerLevel}
    >
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
  `,
};

export const WithActiveStates: Story = {
  args: {
    id: "verticalnav5",
    header: "NYS Design System",
    hideHeader: false,
    headerLevel: "h2",
  },
  render: (args) => html`
    <nys-verticalnav
      id=${args.id}
      header=${args.header}
      ?hideHeader=${args.hideHeader}
      headerLevel=${args.headerLevel}
    >
      <ul>
        <li><a href="/">Foundations</a></li>
        <li><a href="/components">Components</a></li>
        <li>
          <nys-verticalnavgroup label="Accessibility">
            <ul>
              <li><a aria-current="page" href="">WCAG Guidelines</a></li>
              <li><a href="">Screen Readers</a></li>
              <li><a href="">Color Contrast</a></li>
            </ul>
          </nys-verticalnavgroup>
        </li>
        <li>
          <h3>Resources</h3>
          <ul>
            <li><a aria-current="page" href="">Design Tokens</a></li>
            <li><a href="">Utilities</a></li>
          </ul>
        </li>
      </ul>
    </nys-verticalnav>
  `,
};

export const WithDisabledStates: Story = {
  args: {
    id: "verticalnav5",
    header: "NYS Design System",
    hideHeader: false,
    headerLevel: "h2",
  },
  render: (args) => html`
    <nys-verticalnav
      id=${args.id}
      header=${args.header}
      ?hideHeader=${args.hideHeader}
      headerLevel=${args.headerLevel}
    >
      <ul>
        <li><a href="/">Foundations</a></li>
        <li><a href="/components">Components</a></li>
        <li>
          <nys-verticalnavgroup disabled label="Accessibility">
            <ul>
              <li>
                <a aria-disabled="true" tabindex="-1" href=""
                  >WCAG Guidelines</a
                >
              </li>
              <li><a href="">Screen Readers</a></li>
              <li><a href="">Color Contrast</a></li>
            </ul>
          </nys-verticalnavgroup>
        </li>
        <li>
          <h3>Resources</h3>
          <ul>
            <li>
              <a aria-disabled="true" tabindex="-1" href="">Design Tokens</a>
            </li>
            <li><a href="">Utilities</a></li>
          </ul>
        </li>
      </ul>
    </nys-verticalnav>
  `,
};

export const PageLayout: Story = {
  args: {
    id: "verticalnav-layout",
    header: "NYS Design System",
    hideHeader: false,
    headerLevel: "h2",
  },
  render: (args) => html`
    <style>
      .story-page {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        font-family: var(--nys-font-family-ui, "Proxima Nova", sans-serif);
      }

      .story-page__body {
        display: flex;
        flex: 1;
      }

      .story-page__main {
        flex: 1;
        padding: var(--nys-space-400, 32px);
      }

      @media (max-width: 1023px) {
        .story-page__body {
          flex-direction: column;
          padding: var(--nys-size-400, 32px);
        }
      }
    </style>

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

      <!-- Body: sidebar + main -->
      <div class="story-page__body">
        <nys-verticalnav
          id=${args.id}
          header=${args.header}
          ?hideHeader=${args.hideHeader}
          headerLevel=${args.headerLevel}
        >
          <ul>
            <li><a href="/">Foundations</a></li>
            <li><a href="/components">Components</a></li>
            <li>
              <nys-verticalnavgroup label="Accessibility">
                <ul>
                  <li><a href="">WCAG Guidelines</a></li>
                  <li>
                    <a href="">Screen Readers</a>
                  </li>
                  <li>
                    <a href="">Color Contrast</a>
                  </li>
                </ul>
              </nys-verticalnavgroup>
            </li>
            <li>
              <h3>Resources</h3>
              <ul>
                <li>
                  <a href="">Design Tokens</a>
                </li>
                <li><a href="">Utilities</a></li>
                <li><a href="">Learn</a></li>
                <li><a href="">What's New</a></li>
              </ul>
            </li>
          </ul>
        </nys-verticalnav>

        <main class="story-page__main">
          <p>Main content area</p>
        </main>
      </div>

      <nys-globalfooter agencyName="{agencyName}" homepageLink="https://">
        <ul>
          <li>
            <a href="https://"> Privacy Policy </a>
          </li>
          <li>
            <a href="https://"> Terms of Service </a>
          </li>
        </ul>
      </nys-globalfooter>

      <nys-unavfooter></nys-unavfooter>
    </div>
  `,
  parameters: {
    layout: "fullscreen",
    docs: {
      source: { code: "See render function" },
    },
  },
};
