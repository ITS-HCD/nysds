import { expect, html, fixture } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
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
    await expect(el).to.be.accessible();
  });

  it("exposes role=list on the host", async () => {
    const el = await fixture<NysIconlist>(html`<nys-iconlist></nys-iconlist>`);
    await el.updateComplete;
    expect(el.getAttribute("role")).to.equal("list");
  });

  it("does not override an author-supplied role", async () => {
    const el = await fixture<NysIconlist>(
      html`<nys-iconlist role="presentation"></nys-iconlist>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("role")).to.equal("presentation");
  });

  it("keeps an author-supplied aria-label and exposes it as the accessible name", async () => {
    // The host renders in the light DOM, so aria-label needs no component
    // code to work — it should simply pass through untouched.
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist aria-label="Event details">
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
      </nys-iconlist>
    `);
    await el.updateComplete;

    expect(el.getAttribute("aria-label")).to.equal("Event details");
    await expect(el).to.be.accessible();
  });

  it("renders items as direct children of the list role", async () => {
    // The list must not be a shadow host: Chrome >=150 demotes role=listitem
    // on elements slotted into a shadow-host list, so items have to be direct
    // DOM children of the element carrying role=list.
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      </nys-iconlist>
    `);
    await el.updateComplete;

    expect(el.shadowRoot).to.be.null;

    const items = el.querySelectorAll("nys-iconlistitem");
    expect(items.length).to.equal(2);
    items.forEach((item) => {
      expect(item.parentElement).to.equal(el);
      expect(item.getAttribute("role")).to.equal("listitem");
    });
  });

  it("sets divider on every item but the last when divider is set", async () => {
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist divider>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
        <nys-iconlistitem icon="location_on"
          >Central Park West</nys-iconlistitem
        >
      </nys-iconlist>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll("nys-iconlistitem");
    expect(items[0].hasAttribute("divider")).to.be.true;
    expect(items[1].hasAttribute("divider")).to.be.true;
    expect(items[2].hasAttribute("divider")).to.be.false;
  });

  it("does not set divider on items when divider is unset", async () => {
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      </nys-iconlist>
    `);
    await el.updateComplete;

    el.querySelectorAll("nys-iconlistitem").forEach((item) => {
      expect(item.hasAttribute("divider")).to.be.false;
    });
  });

  it("removes divider from items when toggled off", async () => {
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist divider>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      </nys-iconlist>
    `);
    await el.updateComplete;
    expect(el.querySelector("nys-iconlistitem")?.hasAttribute("divider")).to.be
      .true;

    el.divider = false;
    await el.updateComplete;
    expect(el.querySelector("nys-iconlistitem")?.hasAttribute("divider")).to.be
      .false;
  });

  it("re-syncs dividers when an item is appended after initial render", async () => {
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist divider>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      </nys-iconlist>
    `);
    await el.updateComplete;

    const added = document.createElement("nys-iconlistitem");
    added.textContent = "Central Park West";
    el.appendChild(added);
    // MutationObserver callbacks run as microtasks
    await Promise.resolve();

    const items = el.querySelectorAll("nys-iconlistitem");
    expect(items[0].hasAttribute("divider")).to.be.true;
    expect(items[1].hasAttribute("divider")).to.be.true;
    expect(items[2].hasAttribute("divider")).to.be.false;
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

  it("sets role=listitem when inside a nys-iconlist", async () => {
    const el = await fixture<NysIconlist>(html`
      <nys-iconlist>
        <nys-iconlistitem icon="check_circle">Done</nys-iconlistitem>
      </nys-iconlist>
    `);
    await el.updateComplete;
    const item = el.querySelector("nys-iconlistitem");
    expect(item?.getAttribute("role")).to.equal("listitem");
  });

  it("does not set role=listitem when standalone", async () => {
    const el = await fixture<NysIconlistitem>(
      html`<nys-iconlistitem icon="check_circle">Done</nys-iconlistitem>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("role")).to.be.null;
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

  it("assigns unique ids to two items created and connected in the same tick", async () => {
    // Regression guard for the @nysds/internals migration: the id generator
    // is keyed on Date.now() + a counter, so two elements connected within
    // the same millisecond must still get distinct ids.
    const container = await fixture<HTMLDivElement>(html`<div></div>`);
    const a = document.createElement("nys-iconlistitem") as NysIconlistitem;
    const b = document.createElement("nys-iconlistitem") as NysIconlistitem;
    container.append(a, b);
    await Promise.all([a.updateComplete, b.updateComplete]);

    expect(a.id).to.not.be.empty;
    expect(b.id).to.not.be.empty;
    expect(a.id).to.not.equal(b.id);
  });

  it("registers every nys-* element it renders", async () => {
    const el = await fixture<NysIconlistitem>(
      html`<nys-iconlistitem icon="check">Test</nys-iconlistitem>`,
    );
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });
});
