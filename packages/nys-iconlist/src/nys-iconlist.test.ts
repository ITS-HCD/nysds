import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-iconlist.js";
import { NysIconlist } from "./nys-iconlist.js";
import { NysIconlistitem } from "./nys-iconlistitem.js";

describe("nys-iconlist", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-iconlist></nys-iconlist>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysIconlist>(html`<nys-iconlist></nys-iconlist>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-iconlist-\d+-\d+$/);
  });

  it("reflects divider attribute", async () => {
    const el = await fixture<NysIconlist>(
      html`<nys-iconlist divider></nys-iconlist>`,
    );
    expect(el.divider).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`
      <nys-iconlist>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
      </nys-iconlist>
    `);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("inserts a divider between items when divider is set", async () => {
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist divider>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
        <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
      </nys-iconlist>
    `);
    await el.updateComplete;

    const dividers = el.querySelectorAll("nys-divider");
    expect(dividers.length).to.equal(2);

    const items = el.querySelectorAll("nys-iconlistitem");
    expect(items[0].nextElementSibling?.tagName.toLowerCase()).to.equal("li");
    expect(items[2].nextElementSibling).to.be.null;
  });

  it("does not insert dividers when divider is unset", async () => {
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      </nys-iconlist>
    `);
    await el.updateComplete;

    expect(el.querySelectorAll("nys-divider").length).to.equal(0);
  });

  it("removes dividers when divider is toggled off", async () => {
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist divider>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      </nys-iconlist>
    `);
    await el.updateComplete;
    expect(el.querySelectorAll("nys-divider").length).to.equal(1);

    el.divider = false;
    await el.updateComplete;
    expect(el.querySelectorAll("nys-divider").length).to.equal(0);
  });
});

describe("nys-iconlistitem", () => {
  it("renders the component", async () => {
    const el = await fixture(
      html`<nys-iconlistitem icon="calendar_month"
        >July 4, 2026</nys-iconlistitem
      >`,
    );
    expect(el).to.exist;
  });

  it("reflects icon property", async () => {
    const el = await fixture<NysIconlistitem>(
      html`<nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>`,
    );
    expect(el.icon).to.equal("schedule");
  });

  it("sets role=listitem", async () => {
    const el = await fixture<NysIconlistitem>(
      html`<nys-iconlistitem icon="check_circle">Done</nys-iconlistitem>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("role")).to.equal("listitem");
  });

  it("sets data-has-secondary when secondary slot is populated", async () => {
    const el = await fixture<NysIconlistitem>(html`
      <nys-iconlistitem icon="location_on">
        Central Park West
        <span slot="secondary">New York, NY</span>
      </nys-iconlistitem>
    `);
    await el.updateComplete;
    expect(el.hasAttribute("data-has-secondary")).to.be.true;
  });
});
