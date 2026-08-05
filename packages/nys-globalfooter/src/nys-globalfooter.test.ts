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

  it("supports slot content", async () => {
    const el = await fixture<NysGlobalFooter>(html`
      <nys-globalfooter agencyName="Office of Information Technology Services">
        <ul class="test-slot">
          <li><a href="https://its.ny.gov">ITS Home</a></li>
          <li><a href="https://its.ny.gov/about">About ITS</a></li>
        </ul>
      </nys-globalfooter>
    `);

    await el.updateComplete;

    // Check if the slot has content
    const content = el.shadowRoot?.querySelector(".nys-globalfooter__content");
    const testSlot = content?.querySelector(".test-slot");
    expect(testSlot).to.exist;
    expect(testSlot?.textContent).to.include("ITS Home");
  });

  it("removes potentially dangerous elements from slotted content", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter>
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
      </nys-globalfooter>`,
    );

    await el.updateComplete;

    // Check if slot removes dangerous elements
    const content = el.shadowRoot?.querySelector(".nys-globalfooter__content");
    expect(content?.querySelector("script")).to.be.null;
    expect(content?.querySelector("iframe")).to.be.null;
    expect(content?.querySelector("img")).to.be.null;

    // Check if safe content remains
    const testSlot = content?.querySelector(".safe");
    expect(testSlot).to.exist;
    expect(testSlot?.textContent).to.include("Services");
  });

  // --- Regression: #1795 — paired global + unav footers need distinct
  // contentinfo names so landmark navigation isn't "content information" twice.
  it("names the contentinfo landmark from the visible agency heading", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter
        agencyName="Department of Health"
      ></nys-globalfooter>`,
    );

    const footer = el.shadowRoot?.querySelector("footer");
    expect(footer).to.exist;
    // The inner <footer> is the contentinfo landmark. It points at the visible
    // heading rather than repeating the name, so the two cannot drift apart.
    const heading = el.shadowRoot?.querySelector(".nys-globalfooter__name");
    expect(heading?.id).to.equal(`${el.id}-name`);
    expect(footer?.getAttribute("aria-labelledby")).to.equal(heading?.id);
    expect(footer?.hasAttribute("aria-label")).to.be.false;
    expect(heading?.textContent?.trim()).to.equal("Department of Health");
  });

  it("keeps the heading reference when the agency name is a link", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter
        agencyName="Department of Health"
        homepageLink="https://health.ny.gov"
      ></nys-globalfooter>`,
    );

    const footer = el.shadowRoot?.querySelector("footer");
    const heading = el.shadowRoot?.querySelector("a .nys-globalfooter__name");
    expect(heading, "the heading should render inside the link").to.exist;
    expect(footer?.getAttribute("aria-labelledby")).to.equal(`${el.id}-name`);
    expect(heading?.id).to.equal(`${el.id}-name`);
  });

  it("falls back to a default contentinfo name when no agency name is given", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter></nys-globalfooter>`,
    );

    const footer = el.shadowRoot?.querySelector("footer");
    expect(footer).to.exist;
    // Nothing visible to point at, so the landmark still needs a name of its own
    // to stay distinguishable from the statewide footer.
    expect(footer?.hasAttribute("aria-labelledby")).to.be.false;
    expect(footer?.getAttribute("aria-label")).to.equal("Site");
  });

  it("auto-generates a valid id when none is provided", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter></nys-globalfooter>`,
    );

    expect(el.id).to.match(/^nys-globalfooter-\d+-\d+$/);
  });

  it("preserves a consumer-provided id", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter id="my-footer"></nys-globalfooter>`,
    );

    expect(el.id).to.equal("my-footer");
  });
});
