import { expect, html, fixture } from "@open-wc/testing";
import { NysUnavFooter } from "./nys-unavfooter";
import "../dist/nys-unavfooter.js";

describe("nys-unavfooter", () => {
  it("should render with NYS logo link", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    const logoLink = el.shadowRoot?.getElementById(
      "nys-unavheader__logolink",
    ) as HTMLAnchorElement;
    expect(logoLink).to.exist;
    expect(logoLink?.getAttribute("href")).to.equal("https://www.ny.gov");
    // aria-label conveys the destination and warns the link opens a new tab
    // (WCAG 2.4.4 Link Purpose, 3.2.5 Change on Request).
    expect(logoLink?.getAttribute("aria-label")).to.equal(
      "New York State home page (opens in a new tab)",
    );
  });

  it("renders the navigation texts", async () => {
    const el = await fixture(html`<nys-unavfooter></nys-unavfooter>`);
    const links = el.shadowRoot?.querySelectorAll("ul li a");

    const linkTexts = Array.from(links || []);
    expect(linkTexts).to.have.lengthOf(6);

    expect(linkTexts[0].textContent?.trim()).to.equal("Agencies");
    expect(linkTexts[1].textContent?.trim()).to.equal("App Directory");
    expect(linkTexts[2].textContent?.trim()).to.equal("Counties");
    expect(linkTexts[3].textContent?.trim()).to.equal("Events");
    expect(linkTexts[4].textContent?.trim()).to.equal("Programs");
    expect(linkTexts[5].textContent?.trim()).to.equal("Services");
  });

  it("renders the navigation links", async () => {
    const el = await fixture(html`<nys-unavfooter></nys-unavfooter>`);
    const links = el.shadowRoot?.querySelectorAll("ul li a");

    const linkHrefs = Array.from(links || []).map((link) =>
      link.getAttribute("href"),
    );
    expect(linkHrefs).to.have.lengthOf(6);

    expect(linkHrefs).to.include.members([
      "https://www.ny.gov/agencies",
      "https://www.ny.gov/mobileapps",
      "https://www.ny.gov/counties",
      "https://www.ny.gov/events",
      "https://www.ny.gov/programs",
      "https://www.ny.gov/services",
    ]);
  });
});

// Accessibility Tests
/*
 * Ensure that the <unav-footer> logo is readable for screen readers:
 * - Verify that the logo is properly read by screen readers when the <unav-footer> is focused.
 */
it("passes the a11y audit", async () => {
  const el = await fixture(html`<nys-unavfooter></nys-unavfooter>`);
  await expect(el).shadowDom.to.be.accessible();
});

describe("nys-unavfooter accessibility", () => {
  it("wraps the statewide links in a labeled navigation landmark (WCAG 1.3.1, 2.4.1)", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav, "a <nav> landmark should wrap the links").to.exist;
    expect(nav?.getAttribute("aria-label")).to.equal("New York State");
    // The link list lives inside the nav landmark.
    expect(nav?.querySelectorAll("ul li a")).to.have.lengthOf(6);
  });

  it("renders the statewide content-info footer landmark", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    const footer = el.shadowRoot?.querySelector("footer");
    expect(footer, "a <footer> landmark should be present").to.exist;
  });

  it("marks the decorative logo SVG as hidden from the a11y tree", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    const svg = el.shadowRoot
      ?.getElementById("nys-unavheader__logolink")
      ?.querySelector("svg");
    expect(svg, "the logo SVG should render").to.exist;
    expect(svg?.getAttribute("aria-hidden")).to.equal("true");
    expect(svg?.getAttribute("focusable")).to.equal("false");
  });

  it("opens the logo link safely in a new tab (rel noopener)", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    const logoLink = el.shadowRoot?.getElementById(
      "nys-unavheader__logolink",
    ) as HTMLAnchorElement;
    expect(logoLink?.getAttribute("target")).to.equal("_blank");
    expect(logoLink?.getAttribute("rel")).to.contain("noopener");
  });

  it("auto-generates a host id when none is provided", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    expect(el.id).to.match(/^nys-unavfooter-\d+-\d+$/);
  });

  it("preserves a consumer-supplied id", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter id="my-footer"></nys-unavfooter>`,
    );
    expect(el.id).to.equal("my-footer");
  });
});
