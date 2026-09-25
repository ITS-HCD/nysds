import { expect, html, fixture, aTimeout } from "@open-wc/testing";
import type { NysUnavFooter } from "./nys-unavfooter";
import "../dist/nys-unavfooter.js";
import sinon from "sinon";

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

  // --- Regression: #1795 — paired with nys-globalfooter this is one of two
  // contentinfo landmarks, so it needs a name of its own.
  it("names the contentinfo landmark so it is distinguishable from an agency footer", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    const footer = el.shadowRoot?.querySelector("footer");
    expect(footer?.getAttribute("aria-label")).to.equal("New York State");
  });

  it("lets the author override the contentinfo landmark name", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter landmarkLabel="Statewide"></nys-unavfooter>`,
    );
    const footer = el.shadowRoot?.querySelector("footer");
    expect(footer?.getAttribute("aria-label")).to.equal("Statewide");
  });

  it("falls back to the default name when landmarkLabel is blank", async () => {
    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter landmarkLabel="   "></nys-unavfooter>`,
    );
    // An unnamed contentinfo is exactly what #1795 was about, so a blank
    // override must not be able to reintroduce it.
    const footer = el.shadowRoot?.querySelector("footer");
    expect(footer?.getAttribute("aria-label")).to.equal("New York State");
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

describe("nys-unavfooter statewide CTA", () => {
  let fetchStub: sinon.SinonStub;

  afterEach(() => {
    fetchStub?.restore();
  });

  const mockFetch = (body: unknown, ok = true) => {
    fetchStub = sinon.stub(window, "fetch").resolves({
      ok,
      status: ok ? 200 : 500,
      json: async () => body,
    } as Response);
  };

  it("fetches from the statewide CTA endpoint on initialization", async () => {
    mockFetch({ cta: { status: "off" } });

    await fixture<NysUnavFooter>(html`<nys-unavfooter></nys-unavfooter>`);
    await aTimeout(0);

    expect(fetchStub.calledOnce).to.be.true;
    expect(fetchStub.firstCall.args[0]).to.equal(
      "https://alerts-cta.static-assets.ny.gov/cta.json",
    );
  });

  it('renders the CTA when the feed\'s status is "on"', async () => {
    mockFetch({
      cta: {
        status: "on",
        buttonText: "Get started",
        textAria: "Get started with the design system",
        description: "A short description.",
        link: "https://example.com/get-started",
      },
    });

    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    await aTimeout(0);
    await el.updateComplete;

    const cta = el.shadowRoot?.querySelector(".nys-unavfooter__cta");
    expect(cta, "the CTA container should render").to.exist;

    const description = cta?.querySelector(".nys-unavfooter__cta-text");
    expect(description?.tagName, "the description is a <p>").to.equal("P");
    expect(description?.textContent?.trim()).to.equal("A short description.");

    const button = cta?.querySelector("#nys-unavfooter__cta-button") as
      | (HTMLElement & { label?: string; href?: string })
      | null;
    expect(button, "the CTA button should render").to.exist;
    expect(button?.label).to.equal("Get started");
    expect(button?.href).to.equal("https://example.com/get-started");

    // The accessible name (textAria) is written onto the real inner control,
    // distinct from the visible buttonText.
    await button?.updateComplete;
    const control = button?.shadowRoot?.querySelector(".nys-button");
    expect(control?.getAttribute("aria-label")).to.equal(
      "Get started with the design system",
    );
  });

  it('does not render the CTA when the feed\'s status is not "on"', async () => {
    mockFetch({ cta: { status: "off", buttonText: "Get started" } });

    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    await aTimeout(0);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".nys-unavfooter__cta")).to.not.exist;
  });

  it("does not render the CTA, and does not throw, when the feed is unreachable", async () => {
    fetchStub = sinon.stub(window, "fetch").rejects(new Error("network down"));

    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    await aTimeout(0);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".nys-unavfooter__cta")).to.not.exist;
  });

  it("does not render the CTA when the response isn't ok", async () => {
    mockFetch({ cta: { status: "on", buttonText: "Get started" } }, false);

    const el = await fixture<NysUnavFooter>(
      html`<nys-unavfooter></nys-unavfooter>`,
    );
    await aTimeout(0);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".nys-unavfooter__cta")).to.not.exist;
  });
});
