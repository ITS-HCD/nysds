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

  it("exposes a contentinfo landmark named by the agency name", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter
        agencyName="Department of Health"
      ></nys-globalfooter>`,
    );

    const footer = el.shadowRoot?.querySelector("footer");
    expect(footer).to.exist;
    // The inner <footer> is the contentinfo landmark; it must carry an
    // accessible name so multiple footers on a page are distinguishable.
    expect(footer?.getAttribute("aria-label")).to.equal("Department of Health");
  });

  it("omits the footer aria-label when no agency name is provided", async () => {
    const el = await fixture<NysGlobalFooter>(
      html`<nys-globalfooter></nys-globalfooter>`,
    );

    const footer = el.shadowRoot?.querySelector("footer");
    expect(footer).to.exist;
    expect(footer?.hasAttribute("aria-label")).to.be.false;
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
