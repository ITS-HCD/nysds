import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-breadcrumbs.js";
import "../dist/nys-breadcrumbitem.js";
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
    expect(el.id).to.match(/^nys-breadcrumbs-\d+-\d+$/);
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

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-breadcrumbs label="My Label"></nys-breadcrumbs>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
