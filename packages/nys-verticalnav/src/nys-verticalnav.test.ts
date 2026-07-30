import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-verticalnav.js";
import { NysVerticalnav } from "./nys-verticalnav.js";

describe("nys-verticalnav", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-verticalnav></nys-verticalnav>`);
    expect(el).to.exist;
  });

  it("renders desktop nav by default", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    (el as any)._isMobile = false;
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector(".nys-verticalnav--desktop");
    expect(nav).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    await el.updateComplete;
    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-verticalnav-\d+-\d+$/);
  });

  it("preserves a provided id", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav id="my-nav"></nys-verticalnav>`,
    );
    await el.updateComplete;
    expect(el.id).to.equal("my-nav");
  });

  it("defaults heading to 'Page navigation'", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    expect(el.heading).to.equal("Page navigation");
  });

  it("reflects heading attribute to property", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Freshwater Fishing"></nys-verticalnav>
    `);
    expect(el.heading).to.equal("Freshwater Fishing");
  });

  it("defaults headingLevel to h2", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    expect(el.headingLevel).to.equal("h2");
  });

  it("reflects headingLevel attribute to property", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav headingLevel="h3"></nys-verticalnav>
    `);
    expect(el.headingLevel).to.equal("h3");
  });

  it("defaults hideHeading to false", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    expect(el.hideHeading).to.be.false;
  });

  it("reflects hideHeading attribute to property", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav hideHeading></nys-verticalnav>
    `);
    expect(el.hideHeading).to.be.true;
  });

  // ── Heading Rendering ──────────────────────────────────
  it("renders the heading text in the shadow DOM", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Freshwater Fishing"></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const heading = el.shadowRoot?.querySelector(".nys-verticalnav__heading");
    expect(heading?.textContent?.trim()).to.equal("Freshwater Fishing");
  });

  it("renders the correct heading tag based on headingLevel", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav
        heading="Freshwater Fishing"
        headingLevel="h3"
      ></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const heading = el.shadowRoot?.querySelector("h3.nys-verticalnav__heading");
    expect(heading).to.exist;
  });

  it("does not render heading when hideHeading is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav
        heading="Freshwater Fishing"
        hideHeading
      ></nys-verticalnav>
    `);
    await el.updateComplete;
    const heading = el.shadowRoot?.querySelector(".nys-verticalnav__heading");
    expect(heading).to.not.exist;
  });

  it("uses aria-label when hideHeading is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav
        heading="Freshwater Fishing"
        hideHeading
      ></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).to.equal("Freshwater Fishing");
  });

  it("uses aria-labelledby when hideHeading is false", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav id="nav1" heading="Freshwater Fishing"></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-labelledby")).to.equal("nav1-heading");
  });

  // ── Slot Content ──────────────────────────────────────
  it("renders slotted ul content", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/licenses">Licenses</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    const links = el.querySelectorAll("a");
    expect(links.length).to.equal(2);
  });

  it("renders slotted heading slot content", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <div slot="header"><h2>Custom Heading</h2></div>
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    const slotHeading = el.querySelector('[slot="header"] h2');
    expect(slotHeading?.textContent).to.equal("Custom Heading");
  });

  it("renders slotted footer slot content", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
        <div slot="footer"><p>Last updated: January 2024</p></div>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    const footer = el.querySelector('[slot="footer"] p');
    expect(footer?.textContent).to.equal("Last updated: January 2024");
  });

  // ── Active State ──────────────────────────────────────
  it("applies active class to aria-current page links", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li><a href="/" aria-current="page">Home</a></li>
          <li><a href="/licenses">Licenses</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    (el as any)._applyActiveState();

    const activeLink = el.querySelector('a[aria-current="page"]');
    expect(activeLink?.classList.contains("nys-verticalnav__link--active")).to
      .be.true;
  });

  it("auto-expands and marks active a containing nys-verticalnavgroup", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li>
            <nys-verticalnavgroup label="Accessibility">
              <ul>
                <li><a href="/" aria-current="page">WCAG</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    (el as any)._applyActiveState();

    const group = el.querySelector("nys-verticalnavgroup")!;
    expect(group.hasAttribute("expanded")).to.be.true;
    expect(group.hasAttribute("active")).to.be.true;
  });

  it("applies active state automatically via slotchange, without manual invocation", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li><a href="/" aria-current="page">Home</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;

    const activeLink = el.querySelector('a[aria-current="page"]');
    expect(activeLink?.classList.contains("nys-verticalnav__link--active")).to
      .be.true;
  });

  // ── Mobile State ──────────────────────────────────────
  it("renders mobile accordion when _isMobile is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Freshwater Fishing"></nys-verticalnav>
    `);
    (el as any)._isMobile = true;
    await el.updateComplete;

    const nav = el.shadowRoot?.querySelector(".nys-verticalnav--mobile");
    const accordionItem = el.shadowRoot?.querySelector("nys-accordionitem");
    expect(nav).to.exist;
    expect(accordionItem?.getAttribute("heading")).to.equal(
      "Freshwater Fishing",
    );
  });

  it("open() sets expanded to true", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    el.open();
    expect(el.expanded).to.be.true;
  });

  it("close() sets expanded to false", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav expanded></nys-verticalnav>`,
    );
    el.close();
    expect(el.expanded).to.be.false;
  });

  it("toggle() flips expanded", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    el.toggle();
    expect(el.expanded).to.be.true;
    el.toggle();
    expect(el.expanded).to.be.false;
  });

  it("dispatches nys-verticalnav-toggle with id and expanded on accordion toggle", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav id="nav1"></nys-verticalnav>`,
    );
    (el as any)._isMobile = true;
    await el.updateComplete;

    let detail: any;
    el.addEventListener("nys-verticalnav-toggle", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });

    const accordionItem = el.shadowRoot?.querySelector("nys-accordionitem")!;
    accordionItem.dispatchEvent(
      new CustomEvent("nys-accordionitem-toggle", {
        detail: { expanded: true },
        bubbles: true,
        composed: true,
      }),
    );

    expect(detail).to.deep.equal({ id: "nav1", expanded: true });
    expect(el.expanded).to.be.true;
  });

  it("updates _isMobile when the media query changes", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    const mq = (el as any)._mediaQuery as MediaQueryList;

    mq.dispatchEvent(Object.assign(new Event("change"), { matches: true }));
    await el.updateComplete;

    expect((el as any)._isMobile).to.be.true;
  });

  it("mobile accordion always shows heading text, even when hideHeading is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav
        heading="Freshwater Fishing"
        hideHeading
      ></nys-verticalnav>
    `);
    (el as any)._isMobile = true;
    await el.updateComplete;

    const accordionItem = el.shadowRoot?.querySelector("nys-accordionitem");
    expect(accordionItem?.getAttribute("heading")).to.equal(
      "Freshwater Fishing",
    );
  });

  // ── Accessibility ─────────────────────────────────────
  it("passes the a11y audit", async () => {
    const el = await fixture(html`
      <nys-verticalnav heading="Freshwater Fishing">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/licenses">Licenses</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await expect(el).shadowDom.to.be.accessible();
  });
});
