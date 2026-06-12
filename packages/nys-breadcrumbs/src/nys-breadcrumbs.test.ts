import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-breadcrumbs.js";
import { NysBreadcrumbs } from "./nys-breadcrumbs.js";

const mockMobile = () => {
  window.matchMedia = (query: string) =>
    ({
      matches: query === "(max-width: 767px)",
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      addListener: () => {},
      removeListener: () => {},
    }) as MediaQueryList;
};

const mockDesktop = () => {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      addListener: () => {},
      removeListener: () => {},
    }) as MediaQueryList;
};

describe("nys-breadcrumbs", () => {
  it("renders the component", async () => {
    const el = await fixture(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
        </ol>
      </nys-breadcrumbs>`,
    );
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;
    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-breadcrumbs-\d+-\d+$/);
  });

  it("renders single item as back-to-parent", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/services">Services</a></li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const li = ol.querySelector("li.nys-breadcrumbitem");
    const icon = li?.querySelector("nys-icon[name='arrow_back']");
    const anchor = li?.querySelector("a");

    expect(li).to.exist;
    expect(icon).to.exist;
    expect(anchor).to.exist;
    expect(anchor!.getAttribute("href")).to.equal("/services");
    expect(anchor!.textContent?.trim()).to.equal("Services");
  });

  it("renders multiple items as a trail", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const items = ol.querySelectorAll("li.nys-breadcrumbitem");
    expect(items.length).to.equal(3);
  });

  it("renders current page item as plain text", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const items = ol.querySelectorAll("li.nys-breadcrumbitem");
    const lastItem = items[items.length - 1];

    expect(lastItem.querySelector("a")).to.not.exist;
    expect(lastItem.textContent?.trim()).to.equal("Current Page");
  });

  it("renders chevron_right icon on linked items", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const items = ol.querySelectorAll("li.nys-breadcrumbitem");

    expect(items[0].querySelector("nys-icon[name='chevron_right']")).to.exist;
    expect(items[1].querySelector("nys-icon[name='chevron_right']")).to.exist;
    expect(items[2].querySelector("nys-icon[name='chevron_right']")).to.not
      .exist;
  });

  it("hides intermediate items when collapsed", async () => {
    mockDesktop();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/mission">Mission</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const hidden = ol.querySelectorAll("li.hide");
    expect(hidden.length).to.be.greaterThan(0);
  });

  it("renders back-to-parent on mobile when backToParent is true", async () => {
    mockMobile();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .backToParent=${true}>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const items = ol.querySelectorAll("li.nys-breadcrumbitem");

    expect(items.length).to.equal(1);
    expect(items[0].querySelector("nys-icon[name='arrow_back']")).to.exist;
    expect(items[0].querySelector("a")?.textContent?.trim()).to.equal(
      "Services",
    );
  });

  it("does not render back-to-parent on desktop when backToParent is true", async () => {
    mockDesktop();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .backToParent=${true}>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const items = ol.querySelectorAll("li.nys-breadcrumbitem");

    expect(items.length).to.equal(3);
    items.forEach((item) => {
      expect(item.querySelector("nys-icon[name='arrow_back']")).to.not.exist;
    });
  });

  it("respects collapsed prop even at desktop view", async () => {
    mockDesktop();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .collapsed=${true}>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/Mission">Mission</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const ellipsis = ol.querySelector(".nys-breadcrumbs__ellipsis");
    expect(ellipsis).to.exist;
  });

  it("expands trail when ellipsis is clicked and fires nys-expand", async () => {
    mockDesktop();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/mission">Mission</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    let expandFired = false;
    el.addEventListener("nys-expand", () => {
      expandFired = true;
    });

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const btn = ol.querySelector<HTMLButtonElement>(".ellipsis-btn");
    expect(btn).to.exist;
    btn!.click();

    await el.updateComplete;

    expect(expandFired).to.be.true;
    expect(ol.querySelector(".nys-breadcrumbs__ellipsis")).to.not.exist;
    expect(ol.querySelectorAll("li.hide").length).to.equal(0);
  });

  /** ariaLabel **/
  it("uses 'path to this page' as default aria-label on <nav>", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const nav = el.shadowRoot!.querySelector("nav")!;
    expect(nav.getAttribute("aria-label")).to.equal("path to this page");
  });

  it("uses a custom ariaLabel on <nav> when provided", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs ariaLabel="site navigation">
        <ol>
          <li><a href="/">Home</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const nav = el.shadowRoot!.querySelector("nav")!;
    expect(nav.getAttribute("aria-label")).to.equal("site navigation");
  });

  /** size property **/
  it("reflects size attribute to element", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs size="sm">
        <ol>
          <li><a href="/">Home</a></li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    expect(el.size).to.equal("sm");
    expect(el.getAttribute("size")).to.equal("sm");
  });

  it("defaults size to 'md'", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    expect(el.size).to.equal("md");
  });

  /** backgroundBar property **/
  it("adds background-bar class to <nav> when backgroundBar is true", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .backgroundBar=${true}>
        <ol>
          <li><a href="/">Home</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const nav = el.shadowRoot!.querySelector("nav")!;
    expect(nav.classList.contains("nys-breadcrumbs--background-bar")).to.be
      .true;
  });

  it("does not add background-bar class when backgroundBar is false", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const nav = el.shadowRoot!.querySelector("nav")!;
    expect(nav.classList.contains("nys-breadcrumbs--background-bar")).to.be
      .false;
  });

  /** disabled property **/
  it("omits href and adds aria-disabled on crumb anchors when disabled", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .disabled=${true}>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const anchors = ol.querySelectorAll<HTMLAnchorElement>("a");
    anchors.forEach((a) => {
      expect(a.hasAttribute("href")).to.be.false;
      expect(a.getAttribute("aria-disabled")).to.equal("true");
    });
  });

  it("omits href and adds aria-disabled on back-to-parent anchor when disabled", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .disabled=${true}>
        <ol>
          <li><a href="/services">Services</a></li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const anchor = ol.querySelector<HTMLAnchorElement>("a")!;
    expect(anchor.hasAttribute("href")).to.be.false;
    expect(anchor.getAttribute("aria-disabled")).to.equal("true");
  });

  it("re-renders crumbs when disabled changes dynamically", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    // Anchors should have href initially
    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const anchorsBefore = ol.querySelectorAll<HTMLAnchorElement>(
      "li.nys-breadcrumbitem a",
    );
    anchorsBefore.forEach((a) => {
      expect(a.hasAttribute("href")).to.be.true;
    });

    el.disabled = true;
    await el.updateComplete;

    const anchorsAfter = ol.querySelectorAll<HTMLAnchorElement>(
      "li.nys-breadcrumbitem a",
    );
    anchorsAfter.forEach((a) => {
      expect(a.hasAttribute("href")).to.be.false;
      expect(a.getAttribute("aria-disabled")).to.equal("true");
    });
  });

  /** backToParent on mobile — last item is NOT a current page (has anchor) **/
  it("renders back-to-parent pointing to last item when no current page on mobile", async () => {
    mockMobile();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .backToParent=${true}>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const items = ol.querySelectorAll("li.nys-breadcrumbitem");
    expect(items.length).to.equal(1);
    expect(items[0].querySelector("nys-icon[name='arrow_back']")).to.exist;
    expect(items[0].querySelector("a")?.getAttribute("href")).to.equal(
      "/services",
    );
  });

  /** Ellipsis collapsed with exactly 2 items (no ellipsis expected) **/
  it("does not render ellipsis when collapsed with exactly 2 items", async () => {
    mockDesktop();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .collapsed=${true}>
        <ol>
          <li><a href="/">Home</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    expect(ol.querySelector(".nys-breadcrumbs__ellipsis")).to.not.exist;
  });

  /** nys-expand event detail **/
  it("includes component id in nys-expand event detail", async () => {
    mockDesktop();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs id="my-crumbs">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
          <li><a href="/c">C</a></li>
          <li><a href="/d">D</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    let expandDetail: { id?: string } = {};
    el.addEventListener("nys-expand", (e: Event) => {
      expandDetail = (e as CustomEvent).detail;
    });

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const btn = ol.querySelector<HTMLElement>(".ellipsis-btn")!;
    btn.click();
    await el.updateComplete;

    expect(expandDetail.id).to.equal("my-crumbs");
  });

  /** Ellipsis Space keydown expands trail **/
  it("expands trail and fires nys-expand when Space is pressed on ellipsis", async () => {
    mockDesktop();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
          <li><a href="/c">C</a></li>
          <li><a href="/d">D</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    let expandFired = false;
    el.addEventListener("nys-expand", () => {
      expandFired = true;
    });

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const btn = ol.querySelector<HTMLElement>(".ellipsis-btn")!;
    btn.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(expandFired).to.be.true;
    expect(ol.querySelector(".nys-breadcrumbs__ellipsis")).to.not.exist;
  });

  /** Empty slot — no items rendered **/
  it("renders nothing in crumb-list when slot has no li items", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol></ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    expect(ol.children.length).to.equal(0);
  });

  /** Auto-collapse boundary — exactly at threshold **/
  it("does not auto-collapse when item count equals the desktop threshold (5)", async () => {
    mockDesktop();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
          <li><a href="/c">C</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    expect(ol.querySelector(".nys-breadcrumbs__ellipsis")).to.not.exist;
    expect(ol.querySelectorAll("li.hide").length).to.equal(0);
  });

  it("auto-collapses when item count exceeds the desktop threshold (6 > 5)", async () => {
    mockDesktop();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
          <li><a href="/c">C</a></li>
          <li><a href="/d">D</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    expect(ol.querySelector(".nys-breadcrumbs__ellipsis")).to.exist;
  });

  /** Re-renders when backToParent changes dynamically **/
  it("re-renders to back-to-parent when backToParent changes to true on mobile", async () => {
    mockMobile();

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    expect(ol.querySelectorAll("li.nys-breadcrumbitem").length).to.equal(3);

    el.backToParent = true;
    await el.updateComplete;

    const items = ol.querySelectorAll("li.nys-breadcrumbitem");
    expect(items.length).to.equal(1);
    expect(items[0].querySelector("nys-icon[name='arrow_back']")).to.exist;
  });

  /** Accessibility **/
  it("sets aria-current='page' on the current page item", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const items = ol.querySelectorAll("li.nys-breadcrumbitem");
    const lastItem = items[items.length - 1];

    expect(lastItem.getAttribute("aria-current")).to.equal("page");
  });

  it("does not set aria-current on non-current breadcrumb items", async () => {
    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const items = ol.querySelectorAll("li.nys-breadcrumbitem");

    for (let i = 0; i < items.length - 1; i++) {
      expect(items[i].getAttribute("aria-current")).to.be.null;
    }
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
