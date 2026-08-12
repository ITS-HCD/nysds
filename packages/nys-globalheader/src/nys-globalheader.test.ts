import { expect, html, fixture } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
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

    const active = el.querySelector("li.active a");

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
    const testSlot = el.querySelector(".test-slot");
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

    expect(el.querySelectorAll("a").length).to.equal(2);
    // And its presence is now reflected in the shadow-rendered button.
    expect(
      el.shadowRoot!.querySelector(".nys-globalheader__mobile-menu-button"),
    ).to.exist;

    // --- Remove slot content ---
    el.removeChild(ul);

    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(el.querySelectorAll("a").length).to.equal(0);
    expect(
      el.shadowRoot!.querySelector(".nys-globalheader__mobile-menu-button"),
    ).to.not.exist;
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

  it("sets active class on clicked nav link", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li class="active"><a href="/one">One</a></li>
          <li><a href="/two">Two</a></li>
        </ul>
      </nys-globalheader>
    `);

    await el.updateComplete;

    const links = el.querySelectorAll("a");
    clickWithoutNavigation(links[1] as HTMLElement);

    await el.updateComplete;

    const activeLis = el.querySelectorAll("li.active");
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

  it("renders a nav landmark for navigation content", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader>
        <ul>
          <li><a href="/one">One</a></li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    // The links are slotted straight through — no separate desktop/mobile
    // copies — so there is exactly one nav landmark, styled responsively.
    const nav = el.shadowRoot?.querySelector("nav.nys-globalheader__content");
    expect(nav).to.exist;
    expect(nav?.getAttribute("aria-label")).to.exist;
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

  // --- #1795 — the paired landmark names must be author-overridable. ---
  it("lets the author name the banner landmark directly", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader
        agencyName="Office of Information Technology Services"
        landmarkLabel="ITS"
      ></nys-globalheader>`,
    );

    const header = el.shadowRoot?.querySelector("header");
    expect(header?.getAttribute("aria-label")).to.equal("ITS");
    // Never both: aria-labelledby would win and the override would do nothing.
    expect(header?.hasAttribute("aria-labelledby")).to.be.false;
  });

  it("overrides the default banner name when there is no visible title", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader landmarkLabel="Portal"></nys-globalheader>`,
    );

    const header = el.shadowRoot?.querySelector("header");
    expect(header?.getAttribute("aria-label")).to.equal("Portal");
  });

  it("ignores a blank landmarkLabel and keeps naming from the visible title", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader
        agencyName="Office of Information Technology Services"
        landmarkLabel="   "
      ></nys-globalheader>`,
    );

    const header = el.shadowRoot?.querySelector("header");
    expect(header?.getAttribute("aria-labelledby")).to.equal(
      `${el.id}-agencyname`,
    );
    expect(header?.hasAttribute("aria-label")).to.be.false;
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

    // The links are the author's own light-DOM nodes, slotted through rather
    // than cloned into the shadow DOM, so they're queried on the host.
    const active = el.querySelector("li.active a");
    const inactive = el.querySelector('li:not(.active) a[href="/about"]');
    expect(active?.getAttribute("aria-current")).to.equal("page");
    expect(inactive?.getAttribute("aria-current")).to.be.null;
  });

  // --- Regression: #1726 — an author-set aria-current must not be overwritten
  // by the pathname heuristic. ---
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

    const authored = el.querySelector('a[href="/about"]');
    const pathnameMatch = el.querySelector('a[href="/services"]');

    expect(authored?.getAttribute("aria-current")).to.equal("page");
    // The pathname match must not steal the current-page state.
    expect(pathnameMatch?.getAttribute("aria-current")).to.be.null;
    // ...and the visual active state follows the author, not the URL.
    expect(authored?.closest("li")?.classList.contains("active")).to.be.true;
    expect(pathnameMatch?.closest("li")?.classList.contains("active")).to.be
      .false;
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

    clickWithoutNavigation(el.querySelector('a[href="/services"]')!);
    await el.updateComplete;

    expect(
      el.querySelector('a[href="/about"]')?.getAttribute("aria-current"),
    ).to.equal("page");
    expect(
      el.querySelector('a[href="/services"]')?.getAttribute("aria-current"),
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

    expect(
      el.querySelector('a[href="/services"]')?.getAttribute("aria-current"),
    ).to.equal("page");
  });

  it("preserves the author's other attributes on the slotted link", async () => {
    // No cloning anymore, so this is really just confirming the node
    // rendered through the slot is the same node the author wrote.
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

    const link = el.querySelector('a[href="/reports"]');
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

    // One nav now, used both for the desktop bar and the mobile panel, so
    // the toggle controls that single landmark.
    const controls = button.getAttribute("aria-controls");
    expect(controls).to.equal(`${el.id}-nav`);
    const nav = el.shadowRoot?.querySelector(`#${controls}`);
    expect(nav).to.exist;

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

  it("registers every nys-* element it renders", async () => {
    // Mobile menu icon only renders once there is link content to toggle.
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader agencyName="Test">
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });
});

// ---------------------------------------------------------------------------
// Mobile menu focus trap (#1101)
// ---------------------------------------------------------------------------

describe("nys-globalheader mobile menu focus trap", () => {
  /**
   * The test browser runs above the 1024px breakpoint, where the menu and its
   * toggle are `display: none` — and `focus()` is a no-op on anything that is not
   * rendered. Force the mobile layout on so the trap has real focusable stops,
   * exactly as it would below the breakpoint.
   */
  function forceMobileLayout(el: NysGlobalHeader) {
    const toggleContainer = el.shadowRoot?.querySelector<HTMLElement>(
      ".nys-globalheader__button-container",
    );
    const nav = el.shadowRoot?.querySelector<HTMLElement>(
      ".nys-globalheader__content",
    );
    if (toggleContainer) toggleContainer.style.display = "flex";
    if (nav) nav.style.display = "flex";
  }

  async function openMenu() {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader agencyName="Test Agency">
        <ul>
          <li><a href="/one">One</a></li>
          <li><a href="/two">Two</a></li>
          <li><a href="/three">Three</a></li>
        </ul>
      </nys-globalheader>
    `);
    // The toggle only renders once the slot handler has reported link content,
    // which lands a cycle after the first render.
    await el.updateComplete;
    await el.updateComplete;
    forceMobileLayout(el);

    const toggle = el.shadowRoot!.querySelector<HTMLButtonElement>(
      ".nys-globalheader__mobile-menu-button",
    )!;
    toggle.click();
    await el.updateComplete;

    // The links are the author's own light-DOM nodes, slotted straight
    // through — there's no separate mobile copy to query anymore.
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>("a"));

    return { el, toggle, links };
  }

  function pressKey(key: string, shiftKey = false) {
    const event = new KeyboardEvent("keydown", {
      key,
      shiftKey,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    return event;
  }

  it("wraps Tab from the last menu link back to the toggle", async () => {
    const { el, toggle, links } = await openMenu();

    const last = links[links.length - 1];
    last.focus();
    // The link is light DOM, not shadow DOM, so it shows up on `document`
    // directly rather than via `el.shadowRoot.activeElement`.
    expect(document.activeElement).to.equal(last);

    const event = pressKey("Tab");
    expect(event.defaultPrevented).to.be.true;
    expect(el.shadowRoot!.activeElement).to.equal(toggle);
  });

  it("wraps Shift+Tab from the toggle to the last menu link", async () => {
    const { el, toggle, links } = await openMenu();

    toggle.focus();
    expect(el.shadowRoot!.activeElement).to.equal(toggle);

    const event = pressKey("Tab", true);
    expect(event.defaultPrevented).to.be.true;
    expect(document.activeElement).to.equal(links[links.length - 1]);
  });

  it("leaves Tab alone in the middle of the menu so the browser advances normally", async () => {
    const { links } = await openMenu();

    links[0].focus();
    const event = pressKey("Tab");
    expect(event.defaultPrevented).to.be.false;
    // Focus is still inside the menu; the browser moves it from here.
    expect(document.activeElement).to.equal(links[0]);
  });

  it("pulls focus back into the menu when it has escaped altogether", async () => {
    const { el, toggle } = await openMenu();

    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.focus();

    const event = pressKey("Tab");
    expect(event.defaultPrevented).to.be.true;
    expect(el.shadowRoot!.activeElement).to.equal(toggle);

    outside.remove();
  });

  it("does not trap Tab while the menu is closed", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader agencyName="Test Agency">
        <ul>
          <li><a href="/one">One</a></li>
        </ul>
      </nys-globalheader>
    `);
    await el.updateComplete;

    const event = pressKey("Tab");
    expect(event.defaultPrevented).to.be.false;
  });

  it("closes the menu on Escape and returns focus to the toggle", async () => {
    const { el, toggle, links } = await openMenu();

    links[0].focus();
    const event = pressKey("Escape");
    await el.updateComplete;

    expect(event.defaultPrevented).to.be.true;
    expect(toggle.getAttribute("aria-expanded")).to.equal("false");
    expect(el.shadowRoot!.activeElement).to.equal(toggle);
  });

  it("closes on an outside click without stealing focus", async () => {
    const { el, toggle } = await openMenu();

    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.focus();

    document.body.click();
    await el.updateComplete;

    expect(toggle.getAttribute("aria-expanded")).to.equal("false");
    expect(document.activeElement).to.equal(outside);

    outside.remove();
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
