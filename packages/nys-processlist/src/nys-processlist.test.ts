import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-processlist.js";
import { NysProcesslist } from "./nys-processlist.js";
import { NysProcesslistitem } from "./nys-processlistitem.js";

// Step numbers are internal to the item — assert on what actually renders.
async function stepsOf(el: NysProcesslist) {
  const items = Array.from(
    el.querySelectorAll<NysProcesslistitem>("nys-processlistitem"),
  );
  await Promise.all(items.map((item) => item.updateComplete));
  return items.map((item) =>
    item.shadowRoot
      ?.querySelector(".nys-processlistitem__step")
      ?.textContent?.trim(),
  );
}

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

  it("passes the a11y audit", async () => {
    const el = await fixture(html`
      <nys-processlist>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
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
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
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

  it("numbers items sequentially from 1", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Submit and await review"
        ></nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    expect(await stepsOf(el)).to.deep.equal(["1", "2", "3"]);
  });

  it("renumbers when an item is appended after initial render", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    const added = document.createElement(
      "nys-processlistitem",
    ) as NysProcesslistitem;
    added.label = "Submit and await review";
    el.appendChild(added);
    // MutationObserver callbacks run as microtasks
    await Promise.resolve();

    expect(await stepsOf(el)).to.deep.equal(["1", "2", "3"]);
  });

  it("renumbers when an item is removed after initial render", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Submit and await review"
        ></nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    el.querySelector("nys-processlistitem")?.remove();
    await Promise.resolve();

    expect(await stepsOf(el)).to.deep.equal(["1", "2"]);
  });
});

describe("nys-processlistitem", () => {
  it("renders the component", async () => {
    const el = await fixture(
      html`<nys-processlistitem
        label="Gather your documents"
      ></nys-processlistitem>`,
    );
    expect(el).to.exist;
  });

  it("renders label and description as plain text", async () => {
    const el = await fixture<NysProcesslistitem>(html`
      <nys-processlistitem
        label="Gather your documents"
        description="Recent pay stubs and a tax bill."
      ></nys-processlistitem>
    `);
    await el.updateComplete;

    // nys-label is reserved for form components, so the item owns its own markup.
    expect(el.shadowRoot?.querySelector("nys-label")).to.be.null;
    expect(
      el.shadowRoot
        ?.querySelector(".nys-processlistitem__label")
        ?.textContent?.trim(),
    ).to.equal("Gather your documents");
    // The description property lands as the slot's fallback content.
    const slot = el.shadowRoot?.querySelector(
      'slot[name="description"]',
    ) as HTMLSlotElement | null;
    expect(slot?.textContent).to.equal("Recent pay stubs and a tax bill.");
  });

  it("renders no description when neither the property nor the slot is set", async () => {
    const el = await fixture<NysProcesslistitem>(
      html`<nys-processlistitem
        label="Gather your documents"
      ></nys-processlistitem>`,
    );
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".nys-processlistitem__description")).to
      .be.null;
  });

  it("renders slotted rich-text description", async () => {
    const el = await fixture<NysProcesslistitem>(html`
      <nys-processlistitem label="Gather your documents">
        <div slot="description">Recent pay stubs and a <b>tax bill</b>.</div>
      </nys-processlistitem>
    `);
    await el.updateComplete;

    const slot = el.shadowRoot?.querySelector(
      'slot[name="description"]',
    ) as HTMLSlotElement | null;
    const assigned = slot?.assignedElements() ?? [];
    expect(assigned.length).to.equal(1);
    expect(assigned[0].querySelector("b")?.textContent).to.equal("tax bill");
  });

  it("does not expose a step property", async () => {
    // Numbering is owned by the list, so an item must not be numberable on its own.
    const el = await fixture<NysProcesslistitem>(
      html`<nys-processlistitem
        label="Gather your documents"
      ></nys-processlistitem>`,
    );
    await el.updateComplete;
    expect("step" in el).to.be.false;
  });

  it("renders the step number assigned by the list", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    expect(await stepsOf(el)).to.deep.equal(["1", "2"]);
  });

  it("sets role=listitem when inside a nys-processlist", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;
    const item = el.querySelector("nys-processlistitem");
    expect(item?.getAttribute("role")).to.equal("listitem");
  });

  it("does not set role=listitem when standalone", async () => {
    const el = await fixture<NysProcesslistitem>(
      html`<nys-processlistitem
        label="Gather your documents"
      ></nys-processlistitem>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("role")).to.be.null;
  });
});
