import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-verticalnav.js";
import { NysVerticalnav } from "./nys-verticalnav.js";
import type { NysVerticalnavGroup } from "./nys-verticalnavgroup.js";

/**
 * Does this landmark have a name a user agent can actually resolve?
 *
 * Checks every path in precedence order: an aria-labelledby whose IDREFs all
 * resolve in the element's own root, ARIA element references (Chromium today),
 * and finally a non-empty aria-label. A dangling IDREF resolves to nothing and
 * must not count as a name.
 */
function hasResolvableName(el: Element): boolean {
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const root = el.getRootNode() as Document | ShadowRoot;
    const allResolve = labelledby
      .split(/\s+/)
      .filter(Boolean)
      .every((id) => !!root.getElementById(id));
    if (allResolve) return true;
  }

  const refs = (el as unknown as { ariaLabelledByElements?: Element[] | null })
    .ariaLabelledByElements;
  if (refs && refs.length > 0) return true;

  return !!el.getAttribute("aria-label")?.trim();
}

describe("nys-verticalnav", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-verticalnav></nys-verticalnav>`);
    expect(el).to.exist;
  });

  it("renders desktop nav by default", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    (el as any)._isMobile = false;
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector(".nys-verticalnav--desktop");
    expect(nav).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    await el.updateComplete;
    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-verticalnav-\d+-\d+$/);
  });

  it("preserves a provided id", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav id="my-nav"></nys-verticalnav>`,
    );
    await el.updateComplete;
    expect(el.id).to.equal("my-nav");
  });

  it("defaults heading to 'Page navigation'", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    expect(el.heading).to.equal("Page navigation");
  });

  it("reflects heading attribute to property", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Freshwater Fishing"></nys-verticalnav>
    `);
    expect(el.heading).to.equal("Freshwater Fishing");
  });

  it("defaults headingLevel to h2", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    expect(el.headingLevel).to.equal("h2");
  });

  it("reflects headingLevel attribute to property", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav headingLevel="h3"></nys-verticalnav>
    `);
    expect(el.headingLevel).to.equal("h3");
  });

  it("defaults hideHeading to false", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    expect(el.hideHeading).to.be.false;
  });

  it("reflects hideHeading attribute to property", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav hideHeading></nys-verticalnav>
    `);
    expect(el.hideHeading).to.be.true;
  });

  // ── Heading Rendering ──────────────────────────────────
  it("renders the heading text in the shadow DOM", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Freshwater Fishing"></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const heading = el.shadowRoot?.querySelector(".nys-verticalnav__heading");
    expect(heading?.textContent?.trim()).to.equal("Freshwater Fishing");
  });

  it("renders the correct heading tag based on headingLevel", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav
        heading="Freshwater Fishing"
        headingLevel="h3"
      ></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const heading = el.shadowRoot?.querySelector("h3.nys-verticalnav__heading");
    expect(heading).to.exist;
  });

  it("does not render heading when hideHeading is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav
        heading="Freshwater Fishing"
        hideHeading
      ></nys-verticalnav>
    `);
    await el.updateComplete;
    const heading = el.shadowRoot?.querySelector(".nys-verticalnav__heading");
    expect(heading).to.not.exist;
  });

  it("uses aria-label when hideHeading is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav
        heading="Freshwater Fishing"
        hideHeading
      ></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).to.equal("Freshwater Fishing");
  });

  it("uses aria-labelledby when hideHeading is false", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav id="nav1" heading="Freshwater Fishing"></nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-labelledby")).to.equal("nav1-heading");
  });

  it("names the desktop nav when the header slot is FILLED", async () => {
    // Regression guard: the generated heading is the header slot's FALLBACK
    // content, so filling the slot removes it. An aria-labelledby pointing at that
    // heading id then dangles and the landmark has no accessible name at all.
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav id="nav-filled" heading="Freshwater Fishing">
        <div slot="header">
          <h2>Freshwater Fishing</h2>
          <p>2026 Season Open</p>
        </div>
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;

    const nav = el.shadowRoot?.querySelector("nav")!;
    const headerSlot = el.shadowRoot?.querySelector(
      'slot[name="header"]',
    ) as HTMLSlotElement;

    // The generated heading is fallback content: it stays in the shadow tree but
    // is not rendered once the slot has assigned nodes, so its id is not a name.
    expect(headerSlot.assignedElements().length).to.equal(1);
    // Absent, or empty where a browser reflects element references back onto the
    // content attribute (Chromium) — never an IDREF into the unrendered fallback.
    expect(
      nav.getAttribute("aria-labelledby") ?? "",
      "must not point at the unrendered fallback heading",
    ).to.equal("");
    expect(hasResolvableName(nav), "nav landmark must have an accessible name")
      .to.be.true;
  });

  it("names the mobile nav landmark", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Freshwater Fishing">
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nys-verticalnav>
    `);
    (el as any)._isMobile = true;
    await el.updateComplete;

    const nav = el.shadowRoot?.querySelector(".nys-verticalnav--mobile")!;
    expect(hasResolvableName(nav)).to.be.true;
  });

  it("names the mobile nav landmark when the header slot is filled", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Freshwater Fishing">
        <div slot="header"><h2>Freshwater Fishing</h2></div>
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nys-verticalnav>
    `);
    (el as any)._isMobile = true;
    await el.updateComplete;

    const nav = el.shadowRoot?.querySelector(".nys-verticalnav--mobile")!;
    expect(nav.getAttribute("aria-labelledby") ?? "").to.equal("");
    expect(hasResolvableName(nav)).to.be.true;
  });

  it("keeps the header slot in the mobile template", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Freshwater Fishing">
        <div slot="header"><h2>Custom Heading</h2></div>
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nys-verticalnav>
    `);
    (el as any)._isMobile = true;
    await el.updateComplete;

    const headerSlot = el.shadowRoot?.querySelector(
      'slot[name="header"]',
    ) as HTMLSlotElement | null;
    expect(headerSlot, "mobile template must render the header slot").to.exist;
    expect(headerSlot!.assignedElements().length).to.equal(1);
  });

  // ── Slot Content ──────────────────────────────────────
  it("renders slotted ul content", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/licenses">Licenses</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    const links = el.querySelectorAll("a");
    expect(links.length).to.equal(2);
  });

  it("renders slotted heading slot content", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <div slot="header"><h2>Custom Heading</h2></div>
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    const slotHeading = el.querySelector('[slot="header"] h2');
    expect(slotHeading?.textContent).to.equal("Custom Heading");
  });

  it("renders slotted footer slot content", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
        <div slot="footer"><p>Last updated: January 2024</p></div>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    const footer = el.querySelector('[slot="footer"] p');
    expect(footer?.textContent).to.equal("Last updated: January 2024");
  });

  // ── Active State ──────────────────────────────────────
  it("auto-expands and marks active a containing nys-verticalnavgroup", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li>
            <nys-verticalnavgroup label="Accessibility">
              <ul>
                <li><a href="/" aria-current="page">WCAG</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;
    (el as any)._applyActiveState();

    const group = el.querySelector("nys-verticalnavgroup")!;
    expect(group.hasAttribute("expanded")).to.be.true;
    expect(group.hasAttribute("active")).to.be.true;
  });

  it("applies active state automatically via slotchange, without manual invocation", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li>
            <nys-verticalnavgroup label="Accessibility">
              <ul>
                <li><a href="/" aria-current="page">WCAG</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;

    const group = el.querySelector("nys-verticalnavgroup")!;
    expect(group.hasAttribute("expanded")).to.be.true;
  });

  it("still applies active state after crossing the mobile breakpoint", async () => {
    // Both templates bind slotchange, so swapping them at 1024px does not orphan
    // the listener along with the destroyed slot element.
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li>
            <nys-verticalnavgroup label="Accessibility">
              <ul>
                <li><a href="/wcag">WCAG</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;

    // Cross the breakpoint, THEN mark a link current: only a live slotchange
    // listener on the mobile template can pick this up.
    (el as any)._isMobile = true;
    await el.updateComplete;

    const group = el.querySelector("nys-verticalnavgroup")!;
    const link = group.querySelector("a")!;
    link.setAttribute("aria-current", "page");
    // Change the default slot's assigned nodes so slotchange fires on the
    // template that is live AFTER the breakpoint swap.
    el.appendChild(document.createElement("div"));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(group.hasAttribute("expanded")).to.be.true;
    expect(group.hasAttribute("active")).to.be.true;
  });

  // ── Disabled Links ────────────────────────────────────
  it("makes aria-disabled links without href focusable and role=link", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li><a aria-disabled="true">Design Tokens</a></li>
          <li><a href="/utilities">Utilities</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;

    const disabled = el.querySelector('a[aria-disabled="true"]')!;
    expect(disabled.getAttribute("role")).to.equal("link");
    expect(disabled.getAttribute("tabindex")).to.equal("0");

    // Real links are left alone.
    const enabled = el.querySelector('a[href="/utilities"]')!;
    expect(enabled.hasAttribute("role")).to.be.false;
    expect(enabled.hasAttribute("tabindex")).to.be.false;
  });

  it("does not override an author-supplied role or tabindex on a disabled link", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li>
            <a role="button" tabindex="-1" aria-disabled="true"
              >Design Tokens</a
            >
          </li>
        </ul>
      </nys-verticalnav>
    `);
    await el.updateComplete;

    const disabled = el.querySelector('a[aria-disabled="true"]')!;
    expect(disabled.getAttribute("role")).to.equal("button");
    expect(disabled.getAttribute("tabindex")).to.equal("-1");
  });

  // ── Id Generation ─────────────────────────────────────
  it("gives a nav and a group created in the same tick distinct ids", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-verticalnav heading="Fishing">
          <ul>
            <li>
              <nys-verticalnavgroup label="Accessibility">
                <ul>
                  <li><a href="/wcag">WCAG</a></li>
                </ul>
              </nys-verticalnavgroup>
            </li>
          </ul>
        </nys-verticalnav>
      </div>
    `);
    const nav = wrapper.querySelector("nys-verticalnav")!;
    const group = wrapper.querySelector("nys-verticalnavgroup")!;

    expect(nav.id).to.match(/^nys-verticalnav-\d+-\d+$/);
    expect(group.id).to.match(/^nys-verticalnavgroup-\d+-\d+$/);
    expect(nav.id).to.not.equal(group.id);
  });

  // ── Mobile State ──────────────────────────────────────
  it("renders mobile accordion when _isMobile is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Freshwater Fishing"></nys-verticalnav>
    `);
    (el as any)._isMobile = true;
    await el.updateComplete;

    const nav = el.shadowRoot?.querySelector(".nys-verticalnav--mobile");
    const accordionItem = el.shadowRoot?.querySelector("nys-accordionitem");
    expect(nav).to.exist;
    expect(accordionItem?.getAttribute("heading")).to.equal(
      "Freshwater Fishing",
    );
  });

  it("open() sets expanded to true", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    el.open();
    expect(el.expanded).to.be.true;
  });

  it("close() sets expanded to false", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav expanded></nys-verticalnav>`,
    );
    el.close();
    expect(el.expanded).to.be.false;
  });

  it("toggle() flips expanded", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    el.toggle();
    expect(el.expanded).to.be.true;
    el.toggle();
    expect(el.expanded).to.be.false;
  });

  it("dispatches nys-verticalnav-toggle with id and expanded on accordion toggle", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav id="nav1"></nys-verticalnav>`,
    );
    (el as any)._isMobile = true;
    await el.updateComplete;

    let detail: any;
    el.addEventListener("nys-verticalnav-toggle", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });

    const accordionItem = el.shadowRoot?.querySelector("nys-accordionitem")!;
    accordionItem.dispatchEvent(
      new CustomEvent("nys-accordionitem-toggle", {
        detail: { expanded: true },
        bubbles: true,
        composed: true,
      }),
    );

    expect(detail).to.deep.equal({ id: "nav1", expanded: true });
    expect(el.expanded).to.be.true;
  });

  it("updates _isMobile when the media query changes", async () => {
    const el = await fixture<NysVerticalnav>(
      html`<nys-verticalnav></nys-verticalnav>`,
    );
    const mq = (el as any)._mediaQuery as MediaQueryList;

    mq.dispatchEvent(Object.assign(new Event("change"), { matches: true }));
    await el.updateComplete;

    expect((el as any)._isMobile).to.be.true;
  });

  it("mobile accordion always shows heading text, even when hideHeading is true", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav
        heading="Freshwater Fishing"
        hideHeading
      ></nys-verticalnav>
    `);
    (el as any)._isMobile = true;
    await el.updateComplete;

    const accordionItem = el.shadowRoot?.querySelector("nys-accordionitem");
    expect(accordionItem?.getAttribute("heading")).to.equal(
      "Freshwater Fishing",
    );
  });

  // ── Accessibility ─────────────────────────────────────
  it("passes the a11y audit", async () => {
    const el = await fixture(html`
      <nys-verticalnav heading="Freshwater Fishing">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/licenses">Licenses</a></li>
        </ul>
      </nys-verticalnav>
    `);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("keeps focus order nav link → group trigger → group links", async () => {
    const el = await fixture<NysVerticalnav>(html`
      <nys-verticalnav heading="Fishing">
        <ul>
          <li><a href="/home">Home</a></li>
          <li>
            <nys-verticalnavgroup expanded label="Accessibility">
              <ul>
                <li><a href="/wcag">WCAG</a></li>
                <li><a href="/screen-readers">Screen Readers</a></li>
              </ul>
            </nys-verticalnavgroup>
          </li>
        </ul>
      </nys-verticalnav>
    `);
    (el as any)._isMobile = false;
    await el.updateComplete;

    const group = el.querySelector(
      "nys-verticalnavgroup",
    ) as NysVerticalnavGroup;
    await group.updateComplete;

    const topLink = el.querySelector<HTMLAnchorElement>('a[href="/home"]')!;
    const trigger = group.shadowRoot!.querySelector("button")!;
    const items = group.shadowRoot!.querySelector(
      ".nys-verticalnavgroup__items",
    )!;
    const groupLinks = Array.from(
      group.querySelectorAll<HTMLAnchorElement>("a"),
    );

    // Sequential focus order follows the flattened tree: the top-level link comes
    // before the group, and within the group the trigger comes before the panel
    // that slots the group's links.
    expect(
      topLink.compareDocumentPosition(group) & Node.DOCUMENT_POSITION_FOLLOWING,
      "group follows the first nav link",
    ).to.be.greaterThan(0);
    expect(
      trigger.compareDocumentPosition(items) & Node.DOCUMENT_POSITION_FOLLOWING,
      "trigger precedes the group's link panel",
    ).to.be.greaterThan(0);

    // Nothing in the sequence opts out of, or reorders, natural tab order, and
    // every stop is actually focusable.
    [topLink, trigger, ...groupLinks].forEach((node) => {
      const tabindex = node.getAttribute("tabindex");
      expect(
        tabindex === null || Number(tabindex) === 0,
        `${node.localName} must not reorder tab order`,
      ).to.be.true;
      node.focus();
      const root = node.getRootNode() as Document | ShadowRoot;
      expect(
        root.activeElement,
        `${node.localName} must be focusable`,
      ).to.equal(node);
    });
  });
});

describe("nys-verticalnavgroup", () => {
  const groupFixture = (
    attrs: { expanded?: boolean; disabled?: boolean } = {},
  ) =>
    fixture<NysVerticalnavGroup>(html`
      <nys-verticalnavgroup
        label="Accessibility"
        ?expanded=${!!attrs.expanded}
        ?disabled=${!!attrs.disabled}
      >
        <ul>
          <li><a href="/wcag">WCAG Guidelines</a></li>
          <li><a href="/screen-readers">Screen Readers</a></li>
        </ul>
      </nys-verticalnavgroup>
    `);

  it("generates a group-prefixed id", async () => {
    const group = await groupFixture();
    await group.updateComplete;
    expect(group.id).to.match(/^nys-verticalnavgroup-\d+-\d+$/);
  });

  it("preserves a provided id", async () => {
    const group = await fixture<NysVerticalnavGroup>(html`
      <nys-verticalnavgroup id="my-group" label="A11y"></nys-verticalnavgroup>
    `);
    await group.updateComplete;
    expect(group.id).to.equal("my-group");
  });

  // ── ARIA wiring ───────────────────────────────────────
  it("points aria-controls at the panel that holds the group's links", async () => {
    const group = await groupFixture();
    await group.updateComplete;

    const trigger = group.shadowRoot!.querySelector("button")!;
    const controls = trigger.getAttribute("aria-controls")!;
    const panel = group.shadowRoot!.getElementById(controls);

    expect(panel, "aria-controls must resolve within the group's root").to
      .exist;
    expect(panel!.querySelector("slot"), "panel slots the group's links").to
      .exist;
    expect(controls).to.equal(`${group.id}-content`);
  });

  it("reflects collapsed state through aria-expanded", async () => {
    const group = await groupFixture();
    await group.updateComplete;
    const trigger = group.shadowRoot!.querySelector("button")!;
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
  });

  it("updates aria-expanded when the group opens", async () => {
    const group = await groupFixture();
    await group.updateComplete;
    const trigger = group.shadowRoot!.querySelector("button")!;

    trigger.click();
    await group.updateComplete;

    expect(group.expanded).to.be.true;
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
  });

  // ── Keyboard ──────────────────────────────────────────
  it("uses a native <button> trigger, so Enter and Space activate it", async () => {
    const group = await groupFixture();
    await group.updateComplete;
    const trigger = group.shadowRoot!.querySelector("button")!;

    // A native button gets Enter/Space activation from the browser; overriding its
    // role or tabindex, or using a non-button element, would take that away.
    expect(trigger.tagName).to.equal("BUTTON");
    expect(trigger.hasAttribute("role")).to.be.false;
    expect(trigger.hasAttribute("tabindex")).to.be.false;

    trigger.focus();
    expect(group.shadowRoot!.activeElement).to.equal(trigger);
  });

  it("toggles once per keyboard activation", async () => {
    const group = await groupFixture();
    await group.updateComplete;
    const trigger = group.shadowRoot!.querySelector("button")!;

    let toggles = 0;
    group.addEventListener("nys-verticalnavgroup-toggle", () => toggles++);

    // The browser turns Enter/Space keydown into a click on a native button. A
    // component-level key handler would toggle a second time, so a bare keydown
    // must do nothing on its own.
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true }),
    );
    await group.updateComplete;
    expect(group.expanded, "keydown alone must not toggle").to.be.false;
    expect(toggles).to.equal(0);

    trigger.click();
    await group.updateComplete;
    expect(group.expanded).to.be.true;
    expect(toggles).to.equal(1);
  });

  it("emits nys-verticalnavgroup-toggle with id, label and state", async () => {
    const group = await groupFixture();
    await group.updateComplete;

    let detail: any;
    group.addEventListener("nys-verticalnavgroup-toggle", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });

    group.shadowRoot!.querySelector("button")!.click();
    await group.updateComplete;

    expect(detail).to.deep.equal({
      id: group.id,
      label: "Accessibility",
      expanded: true,
    });
  });

  // ── Disabled ──────────────────────────────────────────
  it("disables the trigger and ignores activation when disabled", async () => {
    const group = await groupFixture({ disabled: true });
    await group.updateComplete;
    const trigger = group.shadowRoot!.querySelector("button")!;

    let toggles = 0;
    group.addEventListener("nys-verticalnavgroup-toggle", () => toggles++);

    expect(trigger.disabled).to.be.true;
    trigger.click();
    await group.updateComplete;

    expect(group.expanded).to.be.false;
    expect(toggles).to.equal(0);
  });

  it("stays collapsed when a disabled group is toggled programmatically", async () => {
    const group = await groupFixture({ disabled: true });
    await group.updateComplete;

    (group as any)._toggle();
    await group.updateComplete;

    expect(group.expanded).to.be.false;
  });

  it("passes the a11y audit", async () => {
    const group = await groupFixture({ expanded: true });
    await group.updateComplete;
    await expect(group).shadowDom.to.be.accessible();
  });
});
