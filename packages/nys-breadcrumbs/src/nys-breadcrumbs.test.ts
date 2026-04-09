import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-breadcrumbs.js";
import { NysBreadcrumbs } from "./nys-breadcrumbs.js";
import { NysBreadcrumbItem } from "./nys-breadcrumbitem.js";

describe("nys-breadcrumbitem", () => {
  it("renders the component", async () => {
    const el = await fixture(
      html`<nys-breadcrumbitem label="Home" link="/"></nys-breadcrumbitem>`,
    );
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbitem label="Home" link="/"></nys-breadcrumbitem>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-breadcrumbitem-\d+-\d+$/);
  });

  it("renders a link when link is provided", async () => {
    const el = await fixture<NysBreadcrumbItem>(
      html`<nys-breadcrumbitem label="Home" link="/"></nys-breadcrumbitem>`,
    );
    await el.updateComplete;
    const anchor = el.shadowRoot!.querySelector("a");
    expect(anchor).to.exist;
    expect(anchor!.getAttribute("href")).to.equal("/");
    expect(anchor!.textContent?.trim()).to.equal("Home");
  });

  it("renders as current page (no link) when link is empty", async () => {
    const el = await fixture<NysBreadcrumbItem>(
      html`<nys-breadcrumbitem label="Current Page"></nys-breadcrumbitem>`,
    );

    await el.updateComplete;
    const anchor = el.shadowRoot!.querySelector("a");
    const li = el.shadowRoot!.querySelector("li");
    expect(anchor).to.not.exist;
    expect(li!.textContent?.trim()).to.equal("Current Page");
  });

  it("renders chevron when not last item", async () => {
    const el = await fixture<NysBreadcrumbItem>(
      html`<nys-breadcrumbitem label="Home" link="/"></nys-breadcrumbitem>`,
    );
    await el.updateComplete;
    el.isLast = false;
    await el.updateComplete;
    const icon = el.shadowRoot!.querySelector("nys-icon[name='chevron_right']");
    expect(icon).to.exist;
  });

  it("renders as back-to-parent when isBackToParent is true", async () => {
    const el = await fixture<NysBreadcrumbItem>(
      html`<nys-breadcrumbitem
        label="Services"
        link="/services"
        .isBackToParent=${true}
      ></nys-breadcrumbitem>`,
    );
    await el.updateComplete;
    const icon = el.shadowRoot!.querySelector("nys-icon[name='arrow_back']");
    const anchor = el.shadowRoot!.querySelector("a");
    expect(icon).to.exist;
    expect(anchor).to.exist;
    expect(anchor!.getAttribute("href")).to.equal("/services");
  });

  /** Event Testing **/
  it("dispatches nys-breadcrumbitem-click when link is clicked", async () => {
    const el = await fixture<NysBreadcrumbItem>(
      html`<nys-breadcrumbitem label="Home" link="/"></nys-breadcrumbitem>`,
    );
    await el.updateComplete;

    let eventFired = false;
    let eventDetail: { id: string; link: string } | null = null;

    el.addEventListener("nys-breadcrumbitem-click", (e: Event) => {
      eventFired = true;
      eventDetail = (e as CustomEvent).detail;
    });

    el.shadowRoot!.querySelector<HTMLAnchorElement>("a")?.click();

    expect(eventFired).to.be.true;
    expect(eventDetail!.link).to.equal("/");
  });

  /** Accessibility **/
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-breadcrumbs label="My Label"></nys-breadcrumbs>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("nys-breadcrumbitem", () => {
  it("renders the component", async () => {
    const el = await fixture(
      html`<nys-breadcrumbs>
        <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;
    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-breadcrumbs-\d+-\d+$/);
  });

  it("renders single item as back-to-parent", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <nys-breadcrumbitem
          link="/services"
          label="Services"
        ></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const clone = ol.querySelector<NysBreadcrumbItem>(
      "nys-breadcrumbitem[data-cloned]",
    );
    expect(clone).to.exist;
    expect(clone!.isBackToParent).to.be.true;
  });

  it("renders multiple items as a trail", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
        <nys-breadcrumbitem
          link="/services"
          label="Services"
        ></nys-breadcrumbitem>
        <nys-breadcrumbitem label="Current Page"></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const clones = ol.querySelectorAll("nys-breadcrumbitem[data-cloned]");
    expect(clones.length).to.equal(3);
  });

  it("marks the last cloned item with isLast", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
        <nys-breadcrumbitem
          link="/services"
          label="Services"
        ></nys-breadcrumbitem>
        <nys-breadcrumbitem label="Current Page"></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const clones = Array.from(
      ol.querySelectorAll<NysBreadcrumbItem>("nys-breadcrumbitem[data-cloned]"),
    );
    const lastClone = clones[clones.length - 1];
    expect(lastClone.isLast).to.be.true;
  });

  it("collapses trail and shows ellipsis when items exceed maxItems (desktop)", async () => {
    // Force desktop width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs maxItems="3">
        <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
        <nys-breadcrumbitem link="/a" label="A"></nys-breadcrumbitem>
        <nys-breadcrumbitem link="/b" label="B"></nys-breadcrumbitem>
        <nys-breadcrumbitem link="/c" label="C"></nys-breadcrumbitem>
        <nys-breadcrumbitem label="Current"></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const ellipsis = ol.querySelector(".ellipsis-item");
    expect(ellipsis).to.exist;
  });

  it("renders back-to-parent on mobile when backToParentMobile is true", async () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 375 });
    window.dispatchEvent(new Event("resize"));

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .backToParentMobile=${true}>
        <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
        <nys-breadcrumbitem
          link="/services"
          label="Services"
        ></nys-breadcrumbitem>
        <nys-breadcrumbitem label="Current Page"></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const clones = ol.querySelectorAll<NysBreadcrumbItem>(
      "nys-breadcrumbitem[data-cloned]",
    );

    expect(clones.length).to.equal(1);
    expect(clones[0].isBackToParent).to.be.true;
    expect(clones[0].label).to.equal("Services");
  });

  it("does not render back-to-parent on desktop when backToParentMobile is true", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .backToParentMobile=${true}>
        <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
        <nys-breadcrumbitem
          link="/services"
          label="Services"
        ></nys-breadcrumbitem>
        <nys-breadcrumbitem label="Current Page"></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const clones = ol.querySelectorAll<NysBreadcrumbItem>(
      "nys-breadcrumbitem[data-cloned]",
    );
    // Full trail should render, not a single back-to-parent
    expect(clones.length).to.equal(3);
    clones.forEach((crumb) => expect(crumb.isBackToParent).to.not.be.true);
  });

  it("respects collapsed prop even at desktop view", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .collapsed=${true} maxItems="10">
        <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
        <nys-breadcrumbitem link="/a" label="A"></nys-breadcrumbitem>
        <nys-breadcrumbitem link="/b" label="B"></nys-breadcrumbitem>
        <nys-breadcrumbitem label="Current"></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const ellipsis = ol.querySelector(".ellipsis-item");
    expect(ellipsis).to.exist;
  });

  /** Event Testing **/
  it("expands trail when ellipsis is clicked and fires nys-breadcrumbs-expand", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs maxItems="3">
        <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
        <nys-breadcrumbitem link="/a" label="A"></nys-breadcrumbitem>
        <nys-breadcrumbitem link="/b" label="B"></nys-breadcrumbitem>
        <nys-breadcrumbitem link="/c" label="C"></nys-breadcrumbitem>
        <nys-breadcrumbitem label="Current"></nys-breadcrumbitem>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    let expandFired = false;
    el.addEventListener("nys-breadcrumbs-expand", () => {
      expandFired = true;
    });

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const btn = ol.querySelector<HTMLButtonElement>(".ellipsis-btn");
    expect(btn).to.exist;
    btn!.click();

    await el.updateComplete;

    expect(expandFired).to.be.true;
    expect(ol.querySelector(".ellipsis-item")).to.not.exist;
    const hidden = ol.querySelectorAll(".hide");
    expect(hidden.length).to.equal(0);
  });

  /** Accessibility **/
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-breadcrumbs label="My Label"></nys-breadcrumbs>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
