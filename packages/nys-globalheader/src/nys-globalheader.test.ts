import { expect, html, fixture } from "@open-wc/testing";
import { NysGlobalHeader } from "./nys-globalheader";
import "../dist/nys-globalheader.js";

describe("nys-globalheader", () => {
  it("should render with the appName and agencyName when provided", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader
        appName="User Registration Form"
        agencyName="Office of Information Technology Services"
      ></nys-globalheader>`,
    );
    expect(el).to.exist;

    const appName = el.shadowRoot?.querySelector(".nys-globalheader__appName");
    const agencyName = el.shadowRoot?.querySelector(
      ".nys-globalheader__agencyName",
    );

    expect(appName?.textContent?.trim()).to.equal("User Registration Form");
    expect(agencyName?.textContent?.trim()).to.equal(
      "Office of Information Technology Services",
    );
  });

  it("renders a link wrapper when homepageLink is set", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader
        appName="eFile"
        agencyName="Tax Department"
        homepageLink="https://ny.gov"
      ></nys-globalheader>`,
    );

    const link = el.shadowRoot?.querySelector(
      ".nys-globalheader__name-container-link",
    ) as HTMLAnchorElement;

    expect(link).to.exist;
    expect(link.href).to.include("https://ny.gov");
  });

  it("renders the NYS brand logo when nysLogo property is set", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader
        appName="Admin Dashboard"
        homepageLink="https://ny.gov"
        nysLogo
      ></nys-globalheader>`,
    );

    await el.updateComplete;
    const brandMark = el.shadowRoot?.querySelector(
      "#nys-unavheader__logo",
    ) as HTMLElement;
    expect(brandMark).to.exist;
  });

  it("highlights the active link based on current URL", async () => {
    history.pushState({}, "", "/services");

    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li><a href="/services">Services</a></li>
          <li><a href="/services/tools">Tools</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nys-globalheader>
    `);

    await el.updateComplete;

    const active = el.shadowRoot?.querySelector(
      ".nys-globalheader__content li.active a",
    );

    expect(active?.getAttribute("href")).to.equal("/services");
  });

  it("supports slot content", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader
        homepageLink="https://ny.gov"
        agencyName="Office of Information Technology Services"
      >
        <ul class="test-slot">
          <li><a href="https://its.ny.gov/services">Services</a></li>
          <li><a href="https://its.ny.gov/about-us">About Us</a></li>
        </ul>
      </nys-globalheader>
    `);

    await el.updateComplete;

    // Check if the slot has content
    const content = el.shadowRoot?.querySelector(".nys-globalheader__content");
    const testSlot = content?.querySelector(".test-slot");
    expect(testSlot).to.exist;
    expect(testSlot?.textContent).to.include("Services");
  });

  it("updates containers when slot content is added and removed", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader></nys-globalheader>
    `);

    await el.updateComplete;

    // --- Add slot content ---
    const ul = document.createElement("ul");
    ul.innerHTML = `<li><a href="/one">One</a></li><li><a href="/two">Two</a></li>`;
    el.appendChild(ul);

    // Wait for slotchange to fire, then for Lit to settle
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const desktop = el.shadowRoot!.querySelector(
      ".nys-globalheader__content",
    ) as HTMLElement;
    const mobile = el.shadowRoot!.querySelector(
      ".nys-globalheader__content-mobile",
    ) as HTMLElement;

    expect(desktop.querySelectorAll("a").length).to.equal(2);
    expect(mobile.querySelectorAll("a").length).to.equal(2);

    // --- Remove slot content ---
    el.removeChild(ul);

    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(desktop.innerHTML).to.equal("");
    expect(mobile.innerHTML).to.equal("");
  });

  it("renders content in the user-actions slot", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader appName="Test App" agencyName="Test Agency">
        <nys-button slot="user-actions" label="Log out"></nys-button>
      </nys-globalheader>
    `);

    await el.updateComplete;

    const button = el.querySelector('nys-button[slot="user-actions"]');

    expect(button).to.exist;
  });

  it("sets active class on clicked nav link (desktop and mobile)", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li class="active"><a href="/one">One</a></li>
          <li><a href="/two">Two</a></li>
        </ul>
      </nys-globalheader>
    `);

    await el.updateComplete;

    // ---------- Desktop ----------
    const desktop = el.shadowRoot!.querySelector(
      ".nys-globalheader__content",
    ) as HTMLElement;

    const desktopLinks = desktop.querySelectorAll("a");
    clickWithoutNavigation(desktopLinks[1] as HTMLElement);

    await el.updateComplete;

    let activeLis = desktop.querySelectorAll("li.active");
    expect(activeLis.length).to.equal(1);
    expect(activeLis[0].textContent?.trim()).to.equal("Two");

    // ---------- Mobile ----------
    const mobileButton = el.shadowRoot!.querySelector(
      ".nys-globalheader__mobile-menu-button",
    ) as HTMLButtonElement;

    mobileButton.click();
    await el.updateComplete;

    const mobile = el.shadowRoot!.querySelector(
      ".nys-globalheader__content-mobile",
    ) as HTMLElement;

    const mobileLinks = mobile.querySelectorAll("a");
    clickWithoutNavigation(mobileLinks[1] as HTMLElement);

    await el.updateComplete;

    activeLis = mobile.querySelectorAll("li.active");
    expect(activeLis.length).to.equal(1);
    expect(activeLis[0].textContent?.trim()).to.equal("Two");
  });
});

// Accessibility Tests
describe("nys-globalheader", () => {
  it("auto-generates an id when none is provided", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader appName="Test"></nys-globalheader>`,
    );
    await el.updateComplete;
    expect(el.id).to.match(/^nys-globalheader-\d+-\d+$/);
  });

  it("preserves a consumer-provided id", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader id="my-header" appName="Test"></nys-globalheader>`,
    );
    await el.updateComplete;
    expect(el.id).to.equal("my-header");
  });

  it("renders nav landmarks for navigation content", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li><a href="/one">One</a></li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    const desktopNav = el.shadowRoot?.querySelector(
      "nav.nys-globalheader__content",
    );
    const mobileNav = el.shadowRoot?.querySelector(
      "nav.nys-globalheader__content-mobile",
    );
    expect(desktopNav).to.exist;
    expect(mobileNav).to.exist;
    expect(desktopNav?.getAttribute("aria-label")).to.exist;
    expect(mobileNav?.getAttribute("aria-label")).to.exist;
  });

  // --- Regression: #1795 — paired with nys-unavheader this is one of two banner
  // landmarks, so it needs a name of its own. ---
  it("names the banner landmark from the visible app name", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader
        appName="User Registration Form"
        agencyName="Office of Information Technology Services"
      ></nys-globalheader>`,
    );

    const header = el.shadowRoot?.querySelector("header");
    const appName = el.shadowRoot?.querySelector(".nys-globalheader__appName");
    expect(appName?.id).to.equal(`${el.id}-appname`);
    expect(header?.getAttribute("aria-labelledby")).to.equal(appName?.id);
    expect(header?.hasAttribute("aria-label")).to.be.false;
  });

  it("names the banner landmark from the agency name when there is no app name", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader
        agencyName="Office of Information Technology Services"
      ></nys-globalheader>`,
    );

    const header = el.shadowRoot?.querySelector("header");
    const agencyName = el.shadowRoot?.querySelector(
      ".nys-globalheader__agencyName",
    );
    expect(agencyName?.id).to.equal(`${el.id}-agencyname`);
    expect(header?.getAttribute("aria-labelledby")).to.equal(agencyName?.id);
  });

  it("keeps the banner name reference when the title is a homepage link", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader
        appName="eFile"
        agencyName="Tax Department"
        homepageLink="https://ny.gov"
      ></nys-globalheader>`,
    );

    const header = el.shadowRoot?.querySelector("header");
    const appName = el.shadowRoot?.querySelector(
      ".nys-globalheader__name-container-link .nys-globalheader__appName",
    );
    expect(appName, "the title should render inside the link").to.exist;
    expect(header?.getAttribute("aria-labelledby")).to.equal(
      `${el.id}-appname`,
    );
  });

  it("falls back to a default banner name when no title is provided", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader></nys-globalheader>`,
    );

    const header = el.shadowRoot?.querySelector("header");
    // Nothing visible to point at, so the landmark still needs a name of its own
    // to stay distinguishable from the statewide header.
    expect(header?.hasAttribute("aria-labelledby")).to.be.false;
    expect(header?.getAttribute("aria-label")).to.equal("Site");
  });

  it("sets aria-current=page on the active link (WCAG 1.4.1)", async () => {
    history.pushState({}, "", "/services");

    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li><a href="/services">Services</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    const active = el.shadowRoot?.querySelector(
      ".nys-globalheader__content li.active a",
    );
    const inactive = el.shadowRoot?.querySelector(
      '.nys-globalheader__content li:not(.active) a[href="/about"]',
    );
    expect(active?.getAttribute("aria-current")).to.equal("page");
    expect(inactive?.getAttribute("aria-current")).to.be.null;
  });

  // --- Regression: #1726 — an author-set aria-current must survive the clone into
  // the shadow DOM and must not be overwritten by the pathname heuristic. ---
  it("honors an author-set aria-current instead of matching the pathname", async () => {
    history.pushState({}, "", "/services");

    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li><a href="/services">Services</a></li>
          <li><a href="/about" aria-current="page">About</a></li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    // Both the desktop and the mobile copy are rebuilt from the same light DOM.
    for (const selector of [
      ".nys-globalheader__content",
      ".nys-globalheader__content-mobile",
    ]) {
      const nav = el.shadowRoot?.querySelector(selector) as HTMLElement;
      const authored = nav.querySelector('a[href="/about"]');
      const pathnameMatch = nav.querySelector('a[href="/services"]');

      expect(authored?.getAttribute("aria-current"), selector).to.equal("page");
      // The pathname match must not steal the current-page state.
      expect(pathnameMatch?.getAttribute("aria-current"), selector).to.be.null;
      // ...and the visual active state follows the author, not the URL.
      expect(authored?.closest("li")?.classList.contains("active"), selector).to
        .be.true;
      expect(
        pathnameMatch?.closest("li")?.classList.contains("active"),
        selector,
      ).to.be.false;
    }
  });

  it("leaves an author-set aria-current in place when another link is clicked", async () => {
    history.pushState({}, "", "/services");

    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li><a href="/services">Services</a></li>
          <li><a href="/about" aria-current="page">About</a></li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    const nav = el.shadowRoot?.querySelector(
      ".nys-globalheader__content",
    ) as HTMLElement;
    clickWithoutNavigation(nav.querySelector('a[href="/services"]')!);
    await el.updateComplete;

    expect(
      nav.querySelector('a[href="/about"]')?.getAttribute("aria-current"),
    ).to.equal("page");
    expect(
      nav.querySelector('a[href="/services"]')?.getAttribute("aria-current"),
    ).to.be.null;
  });

  it("treats aria-current=false as 'not current' and keeps the pathname default", async () => {
    history.pushState({}, "", "/services");

    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li><a href="/services">Services</a></li>
          <li><a href="/about" aria-current="false">About</a></li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    const nav = el.shadowRoot?.querySelector(
      ".nys-globalheader__content",
    ) as HTMLElement;
    expect(
      nav.querySelector('a[href="/services"]')?.getAttribute("aria-current"),
    ).to.equal("page");
  });

  it("preserves the author's other attributes on cloned nav links", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li>
            <a
              href="/reports"
              aria-label="Annual reports"
              aria-describedby="hint"
              rel="noopener"
              data-testid="reports"
              >Reports</a
            >
          </li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    const link = el.shadowRoot?.querySelector(
      '.nys-globalheader__content a[href="/reports"]',
    );
    expect(link?.getAttribute("aria-label")).to.equal("Annual reports");
    expect(link?.getAttribute("aria-describedby")).to.equal("hint");
    expect(link?.getAttribute("rel")).to.equal("noopener");
    expect(link?.getAttribute("data-testid")).to.equal("reports");
  });

  it("exposes aria-expanded and aria-controls on the mobile menu button (WCAG 4.1.2)", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li><a href="/one">One</a></li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    const button = el.shadowRoot?.querySelector(
      ".nys-globalheader__mobile-menu-button",
    ) as HTMLButtonElement;

    expect(button.getAttribute("aria-expanded")).to.equal("false");

    const controls = button.getAttribute("aria-controls");
    expect(controls).to.equal(`${el.id}-mobile-nav`);
    const mobileNav = el.shadowRoot?.querySelector(`#${controls}`);
    expect(mobileNav).to.exist;

    button.click();
    await el.updateComplete;
    expect(button.getAttribute("aria-expanded")).to.equal("true");

    button.click();
    await el.updateComplete;
    expect(button.getAttribute("aria-expanded")).to.equal("false");
  });

  it("should handle mobile responsiveness", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader
        homepageLink="https://ny.gov"
        agencyName="Office of Information Technology Services"
      >
        <ul class="test-slot">
          <li><a href="https://its.ny.gov/services">Services</a></li>
          <li><a href="https://its.ny.gov/about-us">About Us</a></li>
        </ul>
      </nys-globalheader>
    `);

    await el.updateComplete;

    const mobileButton = el.shadowRoot?.querySelector(
      ".nys-globalheader__mobile-menu-button",
    ) as HTMLButtonElement;

    const buttonIcon = mobileButton.querySelector("nys-icon") as HTMLElement;
    const labelSpan = mobileButton?.querySelector(
      ".nys-globalheader__mobile-menu-button-text",
    ) as HTMLSpanElement;

    expect(labelSpan.textContent?.trim()).to.include("MENU");

    mobileButton.click();
    await el.updateComplete;
    expect(buttonIcon.getAttribute("name")).to.equal("close");
    expect(labelSpan.textContent?.trim()).to.include("CLOSE");

    mobileButton.click();
    await el.updateComplete;
    expect(buttonIcon.getAttribute("name")).to.equal("menu");
    expect(labelSpan.textContent?.trim()).to.include("MENU");
  });
});

/**
 * Prevents real browser navigation when clicking <a> in tests.
 * Required for Chromium / Firefox in web-test-runner.
 */
function clickWithoutNavigation(el: HTMLElement) {
  el.addEventListener(
    "click",
    (e) => {
      e.preventDefault(); // stop navigation only
    },
    { capture: true, once: true },
  );

  el.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  );
}
