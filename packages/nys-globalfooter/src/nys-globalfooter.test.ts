import { expect, html, fixture } from "@open-wc/testing";
import { NysGlobalFooter } from "./nys-globalfooter";
import "../dist/nys-globalfooter.js";

describe("nys-globalfooter", () => {
  it("should render with agencyName when provided", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter
        agencyName="Office of Information Technology Services"
      ></nys-globalfooter>`,
    );
    expect(el).to.exist;

    const agencyName = el.shadowRoot?.querySelector(".nys-globalfooter__name");

    expect(agencyName?.textContent?.trim()).to.equal(
      "Office of Information Technology Services",
    );
  });

  it("should render with agencySubheading when provided", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter
        agencyName="Office of Information Technology Services"
        agencySubheading="NYS Design System"
      ></nys-globalfooter>`,
    );
    expect(el).to.exist;

    const agencyName = el.shadowRoot?.querySelector(
      ".nys-globalfooter__subheading",
    );

    expect(agencyName?.textContent?.trim()).to.equal("NYS Design System");
  });

  it("renders a link wrapper when homepageLink is set", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter
        agencyName="Tax Department"
        homepageLink="https://ny.gov"
      ></nys-globalfooter>`,
    );

    const link = el.shadowRoot?.querySelector("a") as HTMLAnchorElement;

    expect(link).to.exist;
    expect(link.href).to.include("https://ny.gov");
  });
});
