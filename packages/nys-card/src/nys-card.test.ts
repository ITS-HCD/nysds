import { expect, html, fixture, nextFrame } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
import "../dist/nys-card.js";
import { NysCard } from "./nys-card.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-card", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-card></nys-card>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysCard>(html`<nys-card></nys-card>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-card-\d+-\d+$/);
  });

  // The id comes from NysElement (@nysds/internals), which prefixes it with the
  // element's localName — the same `<tag>-<ts>-<n>` shape the component used to
  // build by hand.
  it("auto-generated id matches the <tag>-<ts>-<n> format", async () => {
    const el = await fixture<NysCard>(html`<nys-card></nys-card>`);
    await el.updateComplete;

    expect(el.id).to.match(/^nys-card-\d+-\d+$/);
  });

  it("gives two cards distinct auto-generated ids", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-card></nys-card>
        <nys-card></nys-card>
      </div>
    `);
    const [first, second] = Array.from(
      wrapper.querySelectorAll<NysCard>("nys-card"),
    );
    await first.updateComplete;
    await second.updateComplete;

    expect(first.id).to.not.equal(second.id);
  });

  it("preserves an author-provided id", async () => {
    const el = await fixture<NysCard>(html`<nys-card id="my-card"></nys-card>`);
    await el.updateComplete;

    expect(el.id).to.equal("my-card");
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label"></nys-card>
    `);
    expect(el.heading).to.equal("My Label");
  });

  it("defaults headingLevel to h2", async () => {
    const el = await fixture<NysCard>(html`<nys-card></nys-card>`);
    expect(el.headingLevel).to.equal("h2");
  });

  it("reflects headingLevel attribute to property", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card headingLevel="h3"></nys-card>
    `);
    expect(el.headingLevel).to.equal("h3");
  });

  it("renders the correct heading tag based on headingLevel", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label" headingLevel="h3"></nys-card>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("h3.nys-card__heading")).to.exist;
    expect(el.shadowRoot?.querySelector("h2.nys-card__heading")).to.not.exist;
  });

  // ── Media & Media Accent ──────────────────────────────────
  const MEDIA =
    "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070";

  // Slot assignment happens outside the update cycle, so let it settle first.
  const settle = async (el: NysCard) => {
    await el.updateComplete;
    await nextFrame();
    await el.updateComplete;
  };

  const mediaContainer = (el: NysCard) =>
    el.shadowRoot?.querySelector(".nys-card__media-container") ?? null;

  // Returns [month, day] from the rendered accent, or null when it is hidden.
  const readAccent = (el: NysCard) => {
    const accent = el.shadowRoot?.querySelector(".nys-card--media-accent");
    if (!accent || accent.hasAttribute("hidden")) return null;
    return [
      accent
        .querySelector(".nys-card--media-accent-month")
        ?.textContent?.trim(),
      accent.querySelector(".nys-card--media-accent-day")?.textContent?.trim(),
    ];
  };

  it("shows the media container when the media slot has content", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card>
        <img slot="media" src=${MEDIA} role="presentation" />
      </nys-card>
    `);
    await settle(el);

    expect(mediaContainer(el)?.hasAttribute("hidden")).to.be.false;
    const slot = el.shadowRoot?.querySelector(
      'slot[name="media"]',
    ) as HTMLSlotElement;
    expect(slot.assignedElements()).to.have.lengthOf(1);
  });

  it("hides the media container when the media slot is empty", async () => {
    const el = await fixture<NysCard>(html`<nys-card></nys-card>`);
    await settle(el);

    expect(mediaContainer(el)?.hasAttribute("hidden")).to.be.true;
  });

  it("renders the media accent's two lines as the month and day", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card>
        <img slot="media" src=${MEDIA} role="presentation" />
        <div slot="media-accent">
          <span>Oct</span>
          <span>16</span>
        </div>
      </nys-card>
    `);
    await settle(el);

    expect(readAccent(el)).to.deep.equal(["Oct", "16"]);
  });

  it("accepts two sibling elements in the media accent slot", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card>
        <img slot="media" src=${MEDIA} role="presentation" />
        <span slot="media-accent">Jan</span>
        <span slot="media-accent">1</span>
      </nys-card>
    `);
    await settle(el);

    expect(readAccent(el)).to.deep.equal(["Jan", "1"]);
  });

  it("does not render the media accent when its slot is empty", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card>
        <img slot="media" src=${MEDIA} role="presentation" />
      </nys-card>
    `);
    await settle(el);

    expect(readAccent(el)).to.be.null;
  });

  it("updates the media accent when the slotted content changes", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card>
        <img slot="media" src=${MEDIA} role="presentation" />
        <div slot="media-accent">
          <span>Oct</span>
          <span>16</span>
        </div>
      </nys-card>
    `);
    await settle(el);

    el.querySelector('[slot="media-accent"]')?.remove();
    const accent = document.createElement("div");
    accent.slot = "media-accent";
    accent.innerHTML = "<span>Dec</span><span>31</span>";
    el.appendChild(accent);
    await settle(el);

    expect(readAccent(el)).to.deep.equal(["Dec", "31"]);
  });

  // ── Clickable ─────────────────────────────────────────────
  const control = (el: NysCard) =>
    el.shadowRoot?.querySelector(".nys-card") as HTMLElement;

  it("renders a plain container when there is nothing to click", async () => {
    const el = await fixture<NysCard>(html`<nys-card></nys-card>`);
    await el.updateComplete;

    expect(control(el).tagName).to.equal("DIV");
  });

  it("renders a button when an onClick handler is set", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card .onClick=${() => {}}></nys-card>
    `);
    await el.updateComplete;

    const btn = control(el) as HTMLButtonElement;
    expect(btn.tagName).to.equal("BUTTON");
    expect(btn.type).to.equal("button");
  });

  it("renders a button when an inline onclick attribute is set", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card onclick="void 0"></nys-card>
    `);
    await el.updateComplete;

    expect(control(el).tagName).to.equal("BUTTON");
  });

  it("renders an anchor when an href is set", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card href="https://www.ny.gov/" target="_blank"></nys-card>
    `);
    await el.updateComplete;

    const link = control(el) as HTMLAnchorElement;
    expect(link.tagName).to.equal("A");
    expect(link.getAttribute("href")).to.equal("https://www.ny.gov/");
    expect(link.getAttribute("target")).to.equal("_blank");
  });

  it("fires nys-click and calls onClick when activated", async () => {
    let handled = 0;
    const el = await fixture<NysCard>(html`
      <nys-card .onClick=${() => handled++}></nys-card>
    `);
    await el.updateComplete;

    let fired = 0;
    el.addEventListener("nys-click", () => fired++);

    control(el).click();

    expect(handled).to.equal(1);
    expect(fired).to.equal(1);
  });

  // ── Focus & Blur ──────────────────────────────────────────
  // The card's control is a native <a>/<button>, so tabbing to it is exercised
  // by focusing that element: it is the element the browser's tab order lands on.
  const focusEvents = (el: NysCard) => {
    const events: string[] = [];
    el.addEventListener("nys-focus", () => events.push("focus"));
    el.addEventListener("nys-blur", () => events.push("blur"));
    return events;
  };

  it("fires nys-focus and nys-blur when the button card is focused and left", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label" .onClick=${() => {}}></nys-card>
    `);
    await el.updateComplete;

    const events = focusEvents(el);
    const btn = control(el);

    btn.focus();
    expect(el.shadowRoot?.activeElement).to.equal(btn);
    expect(events).to.deep.equal(["focus"]);

    btn.blur();
    expect(el.shadowRoot?.activeElement).to.be.null;
    expect(events).to.deep.equal(["focus", "blur"]);
  });

  it("fires nys-focus and nys-blur when the link card is focused and left", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label" href="https://www.ny.gov/"></nys-card>
    `);
    await el.updateComplete;

    const events = focusEvents(el);
    const link = control(el);

    link.focus();
    expect(el.shadowRoot?.activeElement).to.equal(link);
    expect(events).to.deep.equal(["focus"]);

    link.blur();
    expect(events).to.deep.equal(["focus", "blur"]);
  });

  it("fires nys-focus and nys-blur exactly once per focus change", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label" .onClick=${() => {}}></nys-card>
    `);
    await el.updateComplete;

    const events = focusEvents(el);
    const btn = control(el);

    btn.focus();
    btn.focus(); // already focused — no second event
    btn.blur();
    btn.blur(); // already blurred — no second event

    expect(events).to.deep.equal(["focus", "blur"]);
  });

  it("moves focus off the card when focus goes to the next control", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-card heading="My Label" .onClick=${() => {}}></nys-card>
        <button id="after">After</button>
      </div>
    `);
    const el = wrapper.querySelector("nys-card") as NysCard;
    await el.updateComplete;

    const events = focusEvents(el);
    const card = control(el);

    card.focus();
    (wrapper.querySelector("#after") as HTMLButtonElement).focus();

    expect(el.shadowRoot?.activeElement).to.be.null;
    expect(document.activeElement?.id).to.not.equal(el.id);
    expect(events).to.deep.equal(["focus", "blur"]);
  });

  it("bubbles nys-focus and nys-blur out of the card", async () => {
    const wrapper = await fixture(html`
      <div><nys-card heading="My Label" .onClick=${() => {}}></nys-card></div>
    `);
    const el = wrapper.querySelector("nys-card") as NysCard;
    await el.updateComplete;

    const events: string[] = [];
    wrapper.addEventListener("nys-focus", () => events.push("focus"));
    wrapper.addEventListener("nys-blur", () => events.push("blur"));

    control(el).focus();
    control(el).blur();

    expect(events).to.deep.equal(["focus", "blur"]);
  });

  it("keeps a non-interactive card out of the tab order", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label"></nys-card>
    `);
    await el.updateComplete;

    const events = focusEvents(el);
    const container = control(el);

    expect(container.tagName).to.equal("DIV");
    expect(container.hasAttribute("tabindex")).to.be.false;

    container.focus();
    expect(el.shadowRoot?.activeElement).to.be.null;
    expect(events).to.be.empty;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-card heading="My Label"></nys-card>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit when clickable", async () => {
    const el = await fixture(html`
      <nys-card heading="My Label" .onClick=${() => {}}></nys-card>
    `);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("registers every nys-* element it renders", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label" description="Body"></nys-card>
    `);
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });

  // ── Slotted content stays in the light DOM ────────────────
  // The card projects slotted content through <slot>; it never moves it into the
  // shadow tree. Light-DOM components (nys-iconlist and friends) style
  // themselves from a stylesheet adopted on the document, which only reaches
  // them while they remain in the document tree — so this is the invariant that
  // keeps a slotted list styled inside a card.
  const slottedRoot = (el: NysCard) => {
    const slotted = el.querySelector("[data-slotted]") as HTMLElement;
    return { slotted, root: slotted.getRootNode() };
  };

  it("keeps default-slotted content in the light DOM", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label">
        <div data-slotted>Slotted body</div>
      </nys-card>
    `);
    await el.updateComplete;

    const { slotted, root } = slottedRoot(el);
    expect(slotted.parentElement).to.equal(el);
    expect(root).to.not.equal(el.shadowRoot);
    expect(root).to.equal(el.getRootNode());

    // It is still assigned to the card's default slot — projected, not orphaned.
    const slot = el.shadowRoot?.querySelector(
      "slot:not([name])",
    ) as HTMLSlotElement;
    expect(slot.assignedElements()).to.include(slotted);
  });

  it("keeps default-slotted content in the light DOM on a clickable card", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label" href="https://www.ny.gov/">
        <div data-slotted>Slotted body</div>
      </nys-card>
    `);
    await el.updateComplete;

    const { slotted, root } = slottedRoot(el);
    expect(slotted.parentElement).to.equal(el);
    expect(root).to.not.equal(el.shadowRoot);
  });

  // Other test to consider:
  // - Test for default values
  // - Test for different attributes
  // - Test for events
  // - Test for methods
  // - Test for accessibility
  // - Test for slot content
  // - Test for lifecycle methods
});
