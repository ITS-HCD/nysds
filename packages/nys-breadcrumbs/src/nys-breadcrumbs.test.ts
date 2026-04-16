import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-breadcrumbs.js";
import { NysBreadcrumbs } from "./nys-breadcrumbs.js";

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

  it("collapses trail and shows ellipsis when items exceed maxItems (desktop)", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs maxItems="3">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/Mission">Mission</a></li>
          <li><a href="/About">About</a></li>
          <li>Current</li>
        </ol>
      </nys-breadcrumbs>`,
    );
    await el.updateComplete;

    const ol = el.shadowRoot!.getElementById("crumb-list")!;
    const ellipsis = ol.querySelector(".nys-breadcrumbs__ellipsis");
    expect(ellipsis).to.exist;
  });

  it("hides intermediate items when collapsed", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs maxItems="3">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/Mission">Mission</a></li>
          <li><a href="/About">About</a></li>
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
    Object.defineProperty(window, "innerWidth", { writable: true, value: 375 });
    window.dispatchEvent(new Event("resize"));

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
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

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
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs .collapsed=${true} maxItems="10">
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

  it("expands trail when ellipsis is clicked and fires nys-breadcrumbs-expand", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const el = await fixture<NysBreadcrumbs>(
      html`<nys-breadcrumbs maxItems="3">
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
    expect(ol.querySelector(".nys-breadcrumbs__ellipsis")).to.not.exist;
    expect(ol.querySelectorAll("li.hide").length).to.equal(0);
  });

  /** Accessibility **/
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
