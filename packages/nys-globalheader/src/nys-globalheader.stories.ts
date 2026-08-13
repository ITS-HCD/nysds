import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalheader";
import "@nysds/nys-avatar";
import "@nysds/nys-button";
import "@nysds/nys-unavheader";
import "@nysds/nys-unavfooter";
import "@nysds/nys-globalfooter";
import "@nysds/nys-dropdownmenu";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Globalheader",
  component: "nys-globalheader",
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
    appName: "User Registration Form",
    agencyName: "Office of Information Technology Services",
    homepageLink: "",
    nysLogo: false,
    landmarkLabel: "",
  },
  render: (args) => {
    return html`
      <nys-globalheader
        appName=${args.appName}
        agencyName=${args.agencyName}
        homepageLink=${args.homepageLink}
        ?nysLogo=${args.nysLogo}
        landmarkLabel=${args.landmarkLabel}
      ></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader
  appName="User Registration Form"
  agencyName="Office of Information Technology Services"
></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const HomepageLink: Story = {
  render: () => {
    return html`
      <nys-globalheader
        agencyName="Office of Information Technology Services"
        homepageLink="https://its.ny.gov"
      ></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader
  agencyName="Office of Information Technology Services"
  homepageLink="https://its.ny.gov"
></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const OnlyAgencyName: Story = {
  render: () => {
    return html`
      <nys-globalheader
        agencyName="Office of Information Technology Services"
      ></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Office of Information Technology Services"></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const OnlyAppName: Story = {
  render: () => {
    return html`
      <nys-globalheader appName="User Registration Form"></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader appName="User Registration Form"></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const WithLinks: Story = {
  render: () => {
    return html`
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
    `;
  },
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
</nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const AuthorcontrolledActiveLink: Story = {
  render: () => {
    return html`
      <!-- Set aria-current yourself and the header stops guessing from the URL. -->
      <nys-globalheader agencyName="Office of Information Technology Services">
        <ul>
          <li><a href="#/services">Services</a></li>
          <li><a href="#/help" aria-current="page">Help Center</a></li>
        </ul>
      </nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Set aria-current yourself and the header stops guessing from the URL. -->
<nys-globalheader agencyName="Office of Information Technology Services">
  <ul>
    <li><a href="#/services">Services</a></li>
    <li><a href="#/help" aria-current="page">Help Center</a></li>
  </ul>
</nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const UserActions: Story = {
  render: () => {
    return html`
      <nys-globalheader agencyName="Office of Information Technology Services">
        <nys-button slot="user-actions" label="Log out">
          <nys-avatar
            slot="prefix-icon"
            ariaLabel="User avatar"
            initials="NY"
          ></nys-avatar>
        </nys-button>
      </nys-globalheader>
      <nys-dropdownmenu id="dropdownmenu" for="my-action-slot">
        <nys-dropdownmenuitem
          label="Profile"
          href="/profile"
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Repositories & Github Pages"
          href="/repos"
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Organizations"
          href="/organizations"
          disabled
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Sign out"
          href="/logout"
        ></nys-dropdownmenuitem>
      </nys-dropdownmenu>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Office of Information Technology Services">
  <nys-button slot="user-actions" label="Log out">
    <nys-avatar slot="prefix-icon" ariaLabel="User avatar" initials="NY"></nys-avatar>
  </nys-button>
</nys-globalheader>
<nys-dropdownmenu id="dropdownmenu" for="my-action-slot">
  <nys-dropdownmenuitem label="Profile" href="/profile"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Repositories & Github Pages" href="/repos"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Organizations" href="/organizations" disabled></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Sign out" href="/logout"></nys-dropdownmenuitem>
</nys-dropdownmenu>`,
        type: "auto",
      },
    },
  },
};

export const WithNYSLogo: Story = {
  render: () => {
    return html`
      <nys-globalheader nysLogo appName="Admin Dashboard"></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader nysLogo appName="Admin Dashboard"></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};

export const CustomLandmarkLabel: Story = {
  render: () => {
    return html`
      <!-- Names the banner landmark directly instead of from the visible title.
      Keep it distinct from nys-unavheader's ("New York State"). -->
      <nys-globalheader
        agencyName="Office of Information Technology Services"
        landmarkLabel="ITS"
      ></nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Names the banner landmark directly instead of from the visible title.
Keep it distinct from nys-unavheader's ("New York State"). -->
<nys-globalheader
  agencyName="Office of Information Technology Services"
  landmarkLabel="ITS"
></nys-globalheader>`,
        type: "auto",
      },
    },
  },
};


export const TEST: Story = {
  render: () => {
    return html`
    <nys-unavheader></nys-unavheader>
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
      <main role="main" id="main-content">
  <div class="nys-grid-container-widescreen">
    <div class="nys-grid-row nys-grid-gap">
      <aside style="background: pink"  class="nys-desktop:nys-grid-col-auto">
        <nav class="section-nav accordion" aria-label="Section Navigation">
          <button class="section-nav__toggle accordion__trigger" type="button" aria-expanded="false" aria-controls="accordion-panel-foundations">
            <span class="accordion__label">Foundations</span>
            <nys-icon name="chevron_down" size="xl" aria-hidden="true"></nys-icon>
          </button>
          <ul class="section-nav__list accordion__panel" id="accordion-panel-foundations" hidden>
            <li class="section-nav__item section-nav__item--active-section section-nav__item--active">
              <a class="section-nav__link" href="/foundations/" aria-current="page">Foundations</a>
            </li>
            <li class="section-nav__item"><a class="section-nav__link" href="/foundations/design/">Design</a></li>
            <li class="section-nav__item">
              <a class="section-nav__link" href="/foundations/accessibility/">Accessibility</a>
              <ul class="section-nav__list" hidden>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/accessibility/developers/">Developers</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/accessibility/content/">Content Creators</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/accessibility/leadership/">Leadership</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/accessibility/learn/">Learning Resources</a></li>
              </ul>
            </li>
            <li class="section-nav__item"><a class="section-nav__link" href="/foundations/components/">Web Components</a></li>
            <li class="section-nav__item"><a class="section-nav__link" href="/foundations/styles/">CSS</a></li>
            <li class="section-nav__item"><a class="section-nav__link" href="/foundations/tokens/">Design Tokens</a></li>
            <li class="section-nav__item"><a class="section-nav__link" href="/foundations/themes/">Theming</a></li>
            <li class="section-nav__item"><a class="section-nav__link" href="/foundations/forms/">Forms</a></li>
            <li class="section-nav__item"><a class="section-nav__link" href="/foundations/typography/">Typography</a></li>
            <li class="section-nav__item">
              <a class="section-nav__link" href="/foundations/utilities/">Utilities</a>
              <ul class="section-nav__list" hidden>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/display/">Display</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/flex/">Flexbox</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/float/">Float</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/grid/">Grid</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/margin-padding/">Margin and Padding</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/opacity/">Opacity</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/overflow/">Overflow</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/position/">Position</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/responsive/">Responsive Utilities</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/typography/">Typography</a></li>
                <li class="section-nav__item"><a class="section-nav__link" href="/foundations/utilities/zindex/">Z-Index</a></li>
              </ul>
            </li>
            <li class="section-nav__item"><a class="section-nav__link" href="/foundations/hiding/">Hiding Content</a></li>
          </ul>
        </nav>
      </aside>

      <div class="nys-desktop:nys-grid-col-fill">
        <h1 id="foundations">Foundations</h1>
        <p>The NYS Design System is more than a collection of components. It is a set of shared decisions — about color, spacing, typography, accessibility, and interaction — that make those components consistent, themeable, and predictable across every New York State agency.</p>
        <p>Foundations are where those decisions live. They define how components get their styles, how themes change an entire site's appearance without touching component code, how forms validate and submit, and how accessibility is built in from the start.</p>
        <p>Whether you are building a new application with NYSDS components or integrating the design system's styles into an existing site, understanding these foundations will help you work with the system instead of around it.</p>

        <h2 id="system-foundations">
          System Foundations
          <nys-tooltip text="Copy link" focusable="true" for="heading-link-icon-system-foundations"></nys-tooltip>
          <nys-icon name="link" id="heading-link-icon-system-foundations" arialabel="Hint: Copy link"></nys-icon>
        </h2>
        <p>How the design system is built — the token layers, styling framework, theming system, component architecture, and accessibility standards that power everything.</p>
        <div class="nys-grid-row nys-grid-gap-300">
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/foundations/accessibility/" aria-label="Accessibility">
              <div class="card__inner">
                <div class="card__title">Accessibility</div>
                <div class="card__desc">How the design system supports WCAG 2.2 AA compliance, with guidance for developers, content creators, and leadership.</div>
              </div>
            </a>
          </div>
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/foundations/styles/" aria-label="Styles Framework">
              <div class="card__inner">
                <div class="card__title">Styles Framework</div>
                <div class="card__desc">The <code>@nysds/styles</code> CSS package — design tokens as custom properties, a CSS reset, typography classes, and layout utilities.</div>
              </div>
            </a>
          </div>
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/foundations/themes/" aria-label="Agency Themes">
              <div class="card__inner">
                <div class="card__title">Agency Themes</div>
                <div class="card__desc">Apply agency-specific color palettes with a single attribute — build once, switch themes, and every component updates automatically.</div>
              </div>
            </a>
          </div>
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/foundations/tokens/" aria-label="Design Tokens">
              <div class="card__inner">
                <div class="card__title">Design Tokens</div>
                <div class="card__desc">The shared language of colors, spacing, and typography values — how primitive, semantic, and theme tokens connect design decisions to code.</div>
              </div>
            </a>
          </div>
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/foundations/components/" aria-label="How Components Work">
              <div class="card__inner">
                <div class="card__title">How Components Work</div>
                <div class="card__desc">Web components, shadow DOM, slots, CSS custom properties, and the patterns you need to use NYSDS components effectively.</div>
              </div>
            </a>
          </div>
        </div>

        <h2 id="implementation-guides">
          Implementation Guides
          <nys-tooltip text="Copy link" focusable="true" for="heading-link-icon-implementation-guides"></nys-tooltip>
          <nys-icon name="link" id="heading-link-icon-implementation-guides" arialabel="Hint: Copy link"></nys-icon>
        </h2>
        <p>Practical references for building interfaces with the design system — typography, form patterns, layout utilities, and the broader design process.</p>
        <div class="nys-grid-row nys-grid-gap-300">
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/foundations/design/" aria-label="Design">
              <div class="card__inner">
                <div class="card__title">Design</div>
                <div class="card__desc">Where the design system fits in the broader UX process — from strategy and scope to the interface layer.</div>
              </div>
            </a>
          </div>
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/foundations/typography/" aria-label="Typography">
              <div class="card__inner">
                <div class="card__title">Typography</div>
                <div class="card__desc">Core typefaces, typography tokens, font installation, and utility classes for consistent, accessible type across your application.</div>
              </div>
            </a>
          </div>
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/foundations/forms/" aria-label="Form Patterns">
              <div class="card__inner">
                <div class="card__title">Form Patterns</div>
                <div class="card__desc">Form association, validation strategies, event handling, and submission patterns that work across all NYSDS form components.</div>
              </div>
            </a>
          </div>
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/foundations/utilities/" aria-label="Utilities">
              <div class="card__inner">
                <div class="card__title">Utilities</div>
                <div class="card__desc">Layout grid, flexbox, spacing, display, and responsive utility classes for rapid, consistent page layout.</div>
              </div>
            </a>
          </div>
        </div>

        <h2 id="reference">
          Reference
          <nys-tooltip text="Copy link" focusable="true" for="heading-link-icon-reference"></nys-tooltip>
          <nys-icon name="link" id="heading-link-icon-reference" arialabel="Hint: Copy link"></nys-icon>
        </h2>
        <p>Need to look up a specific token value or component API? These are also always available in the main navigation.</p>
        <div class="nys-grid-row nys-grid-gap-300">
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/tokens/" aria-label="Token Browser">
              <div class="card__inner">
                <div class="card__title">Token Browser</div>
                <div class="card__desc">Browse all design tokens — colors, spacing, typography, and theme values — with an interactive theme switcher.</div>
              </div>
            </a>
          </div>
          <div class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
            <a class="card card__no-border card__flat nys-flex-fill" href="/components/" aria-label="Component Catalog">
              <div class="card__inner">
                <div class="card__title">Component Catalog</div>
                <div class="card__desc">All 27 NYSDS components — properties, events, accessibility details, and copy-paste examples.</div>
              </div>
            </a>
          </div>
        </div>

        <div class="edit-page-link">
          <p><a href="https://github.com/its-hcd/nysds-site/edit/main/src/content/pages/foundations/index.md">Edit this page on GitHub</a> (Permissions required)</p>
          <p>Last updated: August 13, 2026</p>
        </div>
      </div>

      <aside class="nys-desktop:nys-grid-col-2">
        <div id="onpage-nav" class="onpage-nav">
          <p><strong>On this page</strong></p>
          <!-- populated client-side from h2s on the real page; leave empty here -->
        </div>
      </aside>
    </div>
  </div>
</main>
      <nys-globalfooter agencyName="Office of Information Technology Services" homepageLink="https://ny.gov">
  <ul>
    <li><a href="https://its.ny.gov">ITS Home</a></li>
    <li><a href="https://its.ny.gov/about">About ITS</a></li>
  </ul>
</nys-globalfooter>
<nys-unavfooter></nys-unavfooter>
    `;
  },
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
</nys-globalheader>`,
        type: "auto",
      },
    },
  },
};
