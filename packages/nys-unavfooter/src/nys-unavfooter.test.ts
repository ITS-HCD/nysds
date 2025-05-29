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
    expect(logoLink?.getAttribute("aria-label")).to.equal(
      "logo of New York State",
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

/*** Accessibility tests ***/
/*
 * Ensure that the <unav-footer> logo is readable for screen readers:
 * - Verify that the logo is properly read by screen readers when the <unav-footer> is focused.
 */