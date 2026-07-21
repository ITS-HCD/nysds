import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-processlist.js";
import { NysProcesslist } from "./nys-processlist.js";
import { NysProcesslistitem } from "./nys-processlistitem.js";

describe("nys-processlist", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-processlist></nys-processlist>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysProcesslist>(
      html`<nys-processlist></nys-processlist>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-processlist-\d+-\d+$/);
  });

  it("reflects start attribute", async () => {
    const el = await fixture<NysProcesslist>(
      html`<nys-processlist start="3"></nys-processlist>`,
    );
    expect(el.start).to.equal(3);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`
      <nys-processlist>
        <nys-processlistitem>Gather your documents</nys-processlistitem>
      </nys-processlist>
    `);
    await expect(el).to.be.accessible();
  });

  it("exposes role=list on the host", async () => {
    const el = await fixture<NysProcesslist>(
      html`<nys-processlist></nys-processlist>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("role")).to.equal("list");
  });

  it("does not override an author-supplied role", async () => {
    const el = await fixture<NysProcesslist>(
      html`<nys-processlist role="presentation"></nys-processlist>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("role")).to.equal("presentation");
  });

  it("renders items as direct children of the list role", async () => {
    // The list must not be a shadow host: Chrome >=150 demotes role=listitem
    // on elements slotted into a shadow-host list, so items have to be direct
    // DOM children of the element carrying role=list.
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem>Gather your documents</nys-processlistitem>
        <nys-processlistitem>Complete the application</nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    expect(el.shadowRoot).to.be.null;

    const items = el.querySelectorAll("nys-processlistitem");
    expect(items.length).to.equal(2);
    items.forEach((item) => {
      expect(item.parentElement).to.equal(el);
      expect(item.getAttribute("role")).to.equal("listitem");
    });
  });

  it("numbers items sequentially from 1 by default", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem>Gather your documents</nys-processlistitem>
        <nys-processlistitem>Complete the application</nys-processlistitem>
        <nys-processlistitem>Submit and await review</nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll("nys-processlistitem");
    expect(items[0].getAttribute("step")).to.equal("1");
    expect(items[1].getAttribute("step")).to.equal("2");
    expect(items[2].getAttribute("step")).to.equal("3");
  });

  it("numbers items from the start value", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist start="3">
        <nys-processlistitem>Submit and await review</nys-processlistitem>
        <nys-processlistitem>Receive your determination</nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll("nys-processlistitem");
    expect(items[0].getAttribute("step")).to.equal("3");
    expect(items[1].getAttribute("step")).to.equal("4");
  });

  it("renumbers items when start changes", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem>Gather your documents</nys-processlistitem>
        <nys-processlistitem>Complete the application</nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;
    expect(
      el.querySelector("nys-processlistitem")?.getAttribute("step"),
    ).to.equal("1");

    el.start = 5;
    await el.updateComplete;

    const items = el.querySelectorAll("nys-processlistitem");
    expect(items[0].getAttribute("step")).to.equal("5");
    expect(items[1].getAttribute("step")).to.equal("6");
  });

  it("renumbers when an item is appended after initial render", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem>Gather your documents</nys-processlistitem>
        <nys-processlistitem>Complete the application</nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    const added = document.createElement("nys-processlistitem");
    added.textContent = "Submit and await review";
    el.appendChild(added);
    // MutationObserver callbacks run as microtasks
    await Promise.resolve();

    const items = el.querySelectorAll("nys-processlistitem");
    expect(items[2].getAttribute("step")).to.equal("3");
  });

  it("renumbers when an item is removed after initial render", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem>Gather your documents</nys-processlistitem>
        <nys-processlistitem>Complete the application</nys-processlistitem>
        <nys-processlistitem>Submit and await review</nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    el.querySelector("nys-processlistitem")?.remove();
    await Promise.resolve();

    const items = el.querySelectorAll("nys-processlistitem");
    expect(items[0].getAttribute("step")).to.equal("1");
    expect(items[1].getAttribute("step")).to.equal("2");
  });
});

describe("nys-processlistitem", () => {
  it("renders the component", async () => {
    const el = await fixture(
      html`<nys-processlistitem>Gather your documents</nys-processlistitem>`,
    );
    expect(el).to.exist;
  });

  it("reflects step property", async () => {
    const el = await fixture<NysProcesslistitem>(
      html`<nys-processlistitem step="4"
        >Gather your documents</nys-processlistitem
      >`,
    );
    expect(el.step).to.equal(4);
  });

  it("renders the step number", async () => {
    const el = await fixture<NysProcesslistitem>(
      html`<nys-processlistitem step="2"
        >Complete the application</nys-processlistitem
      >`,
    );
    await el.updateComplete;

    const marker = el.shadowRoot?.querySelector(".nys-processlistitem__step");
    expect(marker?.textContent?.trim()).to.equal("2");
  });

  it("sets role=listitem when inside a nys-processlist", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem>Gather your documents</nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;
    const item = el.querySelector("nys-processlistitem");
    expect(item?.getAttribute("role")).to.equal("listitem");
  });

  it("does not set role=listitem when standalone", async () => {
    const el = await fixture<NysProcesslistitem>(
      html`<nys-processlistitem>Gather your documents</nys-processlistitem>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("role")).to.be.null;
  });

  it("sets data-has-description when description slot is populated", async () => {
    const el = await fixture<NysProcesslistitem>(html`
      <nys-processlistitem>
        Gather your documents
        <span slot="description">Recent pay stubs and a tax bill.</span>
      </nys-processlistitem>
    `);
    await el.updateComplete;
    expect(el.hasAttribute("data-has-description")).to.be.true;
  });
});
