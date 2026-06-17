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

  it("defaults header to 'Page navigation'", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    expect(el.header).to.equal("Page navigation");
  });

  it("reflects header attribute to property", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Freshwater Fishing"></nys-verticalnav>
    `);
    expect(el.header).to.equal("Freshwater Fishing");
  });

  it("defaults headerLevel to h2", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    expect(el.headerLevel).to.equal("h2");
  });

  it("reflects headerLevel attribute to property", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav headerLevel="h3"></nys-verticalnav>
    `);
    expect(el.headerLevel).to.equal("h3");
  });

  it("defaults hideHeader to false", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    expect(el.hideHeader).to.be.false;
  });

  it("reflects hideHeader attribute to property", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav hideHeader></nys-verticalnav>
    `);
    expect(el.hideHeader).to.be.true;
  });

  // ── Header Rendering ──────────────────────────────────
  it("renders the header text in the shadow DOM", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Freshwater Fishing"></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const header = el.shadowRoot?.querySelector(".nys-verticalnav__header");
    expect(header?.textContent?.trim()).to.equal("Freshwater Fishing");
  });

  it("renders the correct heading tag based on headerLevel", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav
        header="Freshwater Fishing"
        headerLevel="h3"
      ></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const heading = el.shadowRoot?.querySelector("h3.nys-verticalnav__header");
    expect(heading).to.exist;
  });

  it("does not render header when hideHeader is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Freshwater Fishing" hideHeader></nys-verticalnav>
    `);
    await el.updateComplete;
    const header = el.shadowRoot?.querySelector(".nys-verticalnav__header");
    expect(header).to.not.exist;
  });

  it("uses aria-label when hideHeader is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Freshwater Fishing" hideHeader></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).to.equal("Page navigation");
  });

  it("uses aria-labelledby when hideHeader is false", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav id="nav1" header="Freshwater Fishing"></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-labelledby")).to.equal("nav1-heading");
  });

  // ── Slot Content ──────────────────────────────────────
  it("renders slotted ul content", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Fishing">
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

  it("renders slotted header slot content", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Fishing">
        <div slot="header"><h2>Custom Header</h2></div>
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    const slotHeader = el.querySelector('[slot="header"] h2');
    expect(slotHeader?.textContent).to.equal("Custom Header");
  });

  it("renders slotted footer slot content", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Fishing">
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

  // ── Divider Injection ─────────────────────────────────
  it("injects dividers between top-level li items on mobile", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Fishing">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/licenses">Licenses</a></li>
          <li><a href="/regulations">Regulations</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;

    (el as any)._isMobile = true;
    (el as any)._removeDividers();
    (el as any)._injectDividers();

    const dividers = el.querySelectorAll(
      "li.nys-verticalnav__divider--injected",
    );
    expect(dividers.length).to.be.greaterThan(0);
  });

  it("removes injected dividers on resize without removing user dividers", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Fishing">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/licenses">Licenses</a></li>
        </ul>
        <div slot="footer">
          <nys-divider></nys-divider>
          <p>Last updated: January 2024</p>
        </div>
      </nys-verticalnav>
    `);
    await el.updateComplete;

    (el as any)._injectDividers();
    (el as any)._removeDividers();

    const injected = el.querySelectorAll(
      "li.nys-verticalnav__divider--injected",
    );
    const userDividers = el.querySelectorAll('[slot="footer"] nys-divider');
    expect(injected.length).to.equal(0);
    expect(userDividers.length).to.equal(1);
  });

  it("injects subheader dividers on desktop", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Fishing">
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <h3>Regulations</h3>
            <ul>
              <li><a href="">Places to Fish</a></li>
            </ul>
          </li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    (el as any)._injectSubheaderDividers();

    const dividers = el.querySelectorAll(
      "li.nys-verticalnav__divider--injected",
    );
    expect(dividers.length).to.be.greaterThan(0);
  });

  // ── Active State ──────────────────────────────────────
  it("applies active class to aria-current page links", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav header="Fishing">
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

  // ── Accessibility ─────────────────────────────────────
  it("passes the a11y audit", async () => {
    const el = await fixture(html`
      <nys-verticalnav header="Freshwater Fishing">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/licenses">Licenses</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await expect(el).shadowDom.to.be.accessible();
  });
});
