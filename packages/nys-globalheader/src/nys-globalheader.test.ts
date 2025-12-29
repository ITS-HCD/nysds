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

  it("removes potentially dangerous elements from slotted content", async () => {
    const el = await fixture<NysGlobalHeader>(
      html`<nys-globalheader>
        <div>
          <script>
            alert("hello!");
          </script>
          <iframe src="https://malicious.example"></iframe>
          <img src="data:," onerror="alert('hello!')" />
          <ul class="safe">
            <li><a href="https://its.ny.gov/services">Services</a></li>
            <li><a href="https://its.ny.gov/about-us">About Us</a></li>
          </ul>
        </div>
      </nys-globalheader>`,
    );

    await el.updateComplete;

    // Check if slot removes dangerous elements
    const content = el.shadowRoot?.querySelector(".nys-globalheader__content");
    expect(content?.querySelector("script")).to.be.null;
    expect(content?.querySelector("iframe")).to.be.null;
    expect(content?.querySelector("img")).to.be.null;

    // Check if safe content remains
    const testSlot = content?.querySelector(".safe");
    expect(testSlot).to.exist;
    expect(testSlot?.textContent).to.include("Services");
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
