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

  it("renders content in the user-actions slot", async () => {
    const el = await fixture<NysGlobalHeader>(html`
      <nys-globalheader appName="Test App" agencyName="Test Agency">
        <nys-button slot="user-actions" label="Log out"></nys-button>
      </nys-globalheader>
    `);

    await el.updateComplete;

    const userActionsSlot = el.shadowRoot?.querySelector(
      'slot[name="user-actions"]',
    ) as HTMLSlotElement;

    expect(userActionsSlot).to.exist;
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
