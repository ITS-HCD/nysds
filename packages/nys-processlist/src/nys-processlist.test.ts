import { expect, html, fixture } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
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

  it("sets no aria attributes when none are provided", async () => {
    // An empty aria-labelledby/describedby is worse than none at all, so the
    // unset properties must not reflect.
    const el = await fixture<NysProcesslist>(
      html`<nys-processlist></nys-processlist>`,
    );
    await el.updateComplete;

    expect(el.hasAttribute("aria-label")).to.be.false;
    expect(el.hasAttribute("aria-labelledby")).to.be.false;
    expect(el.hasAttribute("aria-describedby")).to.be.false;
  });

  it("names the list from the ariaLabel property", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
      </nys-processlist>
    `);
    el.ariaLabel = "Application steps";
    await el.updateComplete;

    // The host is the role=list element, so the name has to land on it.
    expect(el.getAttribute("aria-label")).to.equal("Application steps");
    await expect(el).to.be.accessible();
  });

  it("reflects aria-labelledby and aria-describedby onto the list", async () => {
    const el = await fixture<NysProcesslist>(html`
      <div>
        <h2 id="process-heading">Super duper app process</h2>
        <p id="process-intro">You will need 3.5 number 2 pencils.</p>
        <nys-processlist
          aria-labelledby="process-heading"
          aria-describedby="process-intro"
        >
          <nys-processlistitem
            label="Gather your documents"
          ></nys-processlistitem>
        </nys-processlist>
      </div>
    `);
    const list = el.querySelector<NysProcesslist>("nys-processlist");
    await list?.updateComplete;

    // aria-labelledby/aria-describedby are not reflected as component
    // properties (the light-DOM host needs no component code for native
    // attributes to work), so assert on the attributes directly.
    expect(list?.getAttribute("aria-labelledby")).to.equal("process-heading");
    expect(list?.getAttribute("aria-describedby")).to.equal("process-intro");
    await expect(el).to.be.accessible();
  });

  it("defaults initialStep to 1", async () => {
    const el = await fixture<NysProcesslist>(
      html`<nys-processlist></nys-processlist>`,
    );
    await el.updateComplete;
    expect(el.initialStep).to.equal(1);
  });

  it("numbers items from initialStep when a process is split across lists", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist initialstep="4">
        <nys-processlistitem label="Okay let's continue"></nys-processlistitem>
        <nys-processlistitem
          label="Wow, this might be tricky"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Cool cool, I got this thing"
        ></nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    expect(await stepsOf(el)).to.deep.equal(["4", "5", "6"]);
  });

  it("renumbers when initialStep changes after initial render", async () => {
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

    el.initialStep = 7;
    await el.updateComplete;

    expect(await stepsOf(el)).to.deep.equal(["7", "8"]);
  });

  it("falls back to 1 for a non-positive initialStep", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist initialstep="0">
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

  it("keeps initialStep numbering when an item is appended", async () => {
    const el = await fixture<NysProcesslist>(html`
      <nys-processlist initialstep="4">
        <nys-processlistitem label="Okay let's continue"></nys-processlistitem>
        <nys-processlistitem
          label="Wow, this might be tricky"
        ></nys-processlistitem>
      </nys-processlist>
    `);
    await el.updateComplete;

    const added = document.createElement(
      "nys-processlistitem",
    ) as NysProcesslistitem;
    added.label = "Cool cool, I got this thing";
    el.appendChild(added);
    await Promise.resolve();

    expect(await stepsOf(el)).to.deep.equal(["4", "5", "6"]);
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

  it("renders the step number as visible, non-aria-hidden text", async () => {
    // role="list" carries no inherent ordering, so the rendered step number is
    // the only thing conveying sequence to assistive tech — it must not be
    // hidden from the accessibility tree.
    const el = await fixture<NysProcesslistitem>(
      html`<nys-processlistitem
        label="Gather your documents"
      ></nys-processlistitem>`,
    );
    await el.updateComplete;

    const step = el.shadowRoot?.querySelector(".nys-processlistitem__step");
    expect(step?.hasAttribute("aria-hidden")).to.be.false;
    expect(step?.textContent?.trim()).to.equal("1");
  });
});

describe("nys-processlist self-registration", () => {
  // Regression guard: nys-processlist.ts previously imported
  // NysProcesslistitem only in a type position (`el is NysProcesslistitem`),
  // which a bundler can elide entirely, leaving <nys-processlistitem>
  // un-upgraded whenever only "@nysds/nys-processlist" is imported.
  it("registers nys-processlistitem when only nys-processlist is imported", async () => {
    const el = await fixture<NysProcesslist>(
      html`<nys-processlist>
        <nys-processlistitem label="Step 1"></nys-processlistitem>
      </nys-processlist>`,
    );
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });
});
