import { expect, html, fixture, nextFrame } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
import "../dist/nys-modal.js";
import { NysModal } from "./nys-modal.js";

/**
 * Resolve an element's accessible name the way the ARIA name computation does
 * for the cases this component uses: aria-labelledby (the concatenated text of
 * the referenced elements, resolved inside the same shadow root) takes
 * precedence over aria-label. Returns "" when nothing resolves — which is
 * exactly what a dangling IDREF produces in the accessibility tree, so this
 * catches the regression where the heading is referenced but never rendered.
 */
function accessibleName(root: ShadowRoot, el: Element): string {
  const ids = el.getAttribute("aria-labelledby");
  if (ids) {
    return ids
      .trim()
      .split(/\s+/)
      .map((id) => root.getElementById(id)?.textContent?.trim() ?? "")
      .filter(Boolean)
      .join(" ");
  }
  return el.getAttribute("aria-label")?.trim() ?? "";
}

const getDialog = (el: NysModal) =>
  el.shadowRoot!.querySelector('[role="dialog"]')!;

describe("nys-modal", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-modal></nys-modal>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysModal>(html`<nys-modal></nys-modal>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-modal-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysModal>(html`
      <nys-modal
        heading="Update Available"
        subheading="Please confirm"
        mandatory
      ></nys-modal>
    `);

    expect(el.heading).to.equal("Update Available");
    expect(el.subheading).to.equal("Please confirm");
    expect(el.mandatory).to.be.true;
  });

  it("opens and closes via 'open' prop", async () => {
    const el = await fixture<NysModal>(html`<nys-modal></nys-modal>`);
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".nys-modal-overlay")).to.exist;

    el.open = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".nys-modal-overlay")).to.not.exist;
  });

  it("dispatches nys-open and nys-close events", async () => {
    const el = await fixture<NysModal>(html`<nys-modal></nys-modal>`);
    let openEventFired = false;
    let closeEventFired = false;

    el.addEventListener("nys-open", () => (openEventFired = true));
    el.addEventListener("nys-close", () => (closeEventFired = true));

    el.open = true;
    await el.updateComplete;
    expect(openEventFired).to.be.true;

    el.open = false;
    await el.updateComplete;
    expect(closeEventFired).to.be.true;
  });

  // Slotted body == whatever the user puts into <nys-modal>
  // Slotted footer == action buttons slot
  it("renders slotted content in body and footer", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Update Available" open>
        <p>
          An update is now available for download. Would you like to install?
        </p>
        <div slot="actions">
          <nys-button label="Not now" variant="text"></nys-button>
          <nys-button label="Update"></nys-button>
        </div>
      </nys-modal>`,
    );

    await el.updateComplete;
    const bodySlot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;
    const actionSlot = el.shadowRoot?.querySelector(
      'slot[name="actions"]',
    ) as HTMLSlotElement;

    expect(bodySlot?.assignedNodes().length).to.be.greaterThan(0);
    expect(actionSlot?.assignedNodes().length).to.be.greaterThan(0);
  });

  // handles mandatory modals
  it("omits the dismiss button when mandatory is set", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Update Available" open mandatory></nys-modal>`,
    );
    const dismissBtn = el.shadowRoot?.querySelector("nys-button"); // the first nys-button found is the dismiss button
    expect(dismissBtn).to.not.exist;
  });

  it("_closeModal sets open to false and fires nys-close", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test" open></nys-modal>`,
    );
    await el.updateComplete;

    let closeFired = false;
    el.addEventListener("nys-close", () => (closeFired = true));

    (el as any)._closeModal();
    await el.updateComplete;

    expect(el.open).to.be.false;
    expect(closeFired).to.be.true;
  });

  it("Escape does nothing when modal is closed", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test"></nys-modal>`,
    );
    await el.updateComplete;

    let closeFired = false;
    el.addEventListener("nys-close", () => (closeFired = true));

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      cancelable: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    await el.updateComplete;

    expect(el.open).to.be.false;
    expect(closeFired).to.be.false;
    expect(event.defaultPrevented).to.be.false;
  });

  it("Escape closes modal and calls preventDefault when open and not mandatory", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test" open></nys-modal>`,
    );
    await el.updateComplete;

    let closeFired = false;
    el.addEventListener("nys-close", () => (closeFired = true));

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      cancelable: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    await el.updateComplete;

    expect(el.open).to.be.false;
    expect(closeFired).to.be.true;
    expect(event.defaultPrevented).to.be.true;
  });

  it("Escape does not close modal when mandatory is set", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test" open mandatory></nys-modal>`,
    );
    await el.updateComplete;

    let closeFired = false;
    el.addEventListener("nys-close", () => (closeFired = true));

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      cancelable: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    await el.updateComplete;

    expect(el.open).to.be.true;
    expect(closeFired).to.be.false;
  });

  it("Tab does nothing special when there are no focusable elements", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test" open mandatory></nys-modal>`,
    );
    await el.updateComplete;

    // mandatory = no dismiss button, no slotted content → 0 focusable elements
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      cancelable: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    await el.updateComplete;

    expect(event.defaultPrevented).to.be.false;
  });

  it("Tab at non-last element does not prevent default", async () => {
    const el = await fixture<NysModal>(html`
      <nys-modal heading="Test" open>
        <div slot="actions">
          <button id="btn-one">One</button>
          <button id="btn-two">Two</button>
        </div>
      </nys-modal>
    `);
    await el.updateComplete;

    // Focus the first action button (not the last in the list)
    const btnOne = el.querySelector<HTMLButtonElement>("#btn-one")!;
    btnOne.focus();

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      cancelable: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    await el.updateComplete;

    expect(event.defaultPrevented).to.be.false;
  });

  it("Shift+Tab at first focusable element wraps focus to last", async () => {
    const el = await fixture<NysModal>(html`
      <nys-modal heading="Test" open>
        <div slot="actions">
          <button id="btn-last">Last</button>
        </div>
      </nys-modal>
    `);
    await el.updateComplete;

    // Simulate activeElement being the dismiss button
    // We can't truly set document.activeElement, so we test preventDefault fires
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      cancelable: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    await el.updateComplete;

    expect(event.defaultPrevented).to.be.true;
  });

  /*** More Event Test ***/
  it("nys-open and nys-close events include correct id in detail", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal id="my-modal" heading="Test"></nys-modal>`,
    );

    let openDetail: any = null;
    let closeDetail: any = null;
    el.addEventListener("nys-open", (e: any) => (openDetail = e.detail));
    el.addEventListener("nys-close", (e: any) => (closeDetail = e.detail));

    el.open = true;
    await el.updateComplete;

    expect(openDetail).to.exist;
    expect(openDetail.id).to.equal("my-modal");

    el.open = false;
    await el.updateComplete;

    expect(closeDetail).to.exist;
    expect(closeDetail.id).to.equal("my-modal");
  });

  /*** Accessibility ***/
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-modal heading="Update Available"></nys-modal>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  /*** Regression: id auto-generation format (mixin uses localName prefix) ***/
  it("auto-generates an id matching /^nys-modal-\\d+-\\d+$/", async () => {
    const el = await fixture<NysModal>(html`<nys-modal></nys-modal>`);
    await el.updateComplete;
    expect(el.id).to.match(/^nys-modal-\d+-\d+$/);
  });

  it("does not overwrite a consumer-provided id", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal id="custom-modal"></nys-modal>`,
    );
    await el.updateComplete;
    expect(el.id).to.equal("custom-modal");
  });

  /*** Regression (WCAG 4.1.2): dialog accessible name wiring ***/
  it("puts role=dialog and aria-modal on the element that receives focus", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Update Available" open></nys-modal>`,
    );
    await el.updateComplete;

    const dialog = getDialog(el);
    // The dialog semantics belong on the modal box, not the backdrop.
    expect(dialog.classList.contains("nys-modal")).to.be.true;
    expect(dialog.getAttribute("aria-modal")).to.equal("true");
    expect(dialog.getAttribute("tabindex")).to.equal("-1");

    // The backdrop is presentational.
    const overlay = el.shadowRoot!.querySelector(".nys-modal-overlay")!;
    expect(overlay.hasAttribute("role")).to.be.false;
    expect(overlay.hasAttribute("aria-modal")).to.be.false;

    // ...and it is the element focus is moved to when the modal opens.
    await nextFrame();
    expect(el.shadowRoot!.activeElement).to.equal(dialog);
  });

  it("names the dialog from the visible heading via aria-labelledby", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Update Available" open></nys-modal>`,
    );
    await el.updateComplete;

    const dialog = getDialog(el);
    expect(dialog.getAttribute("aria-labelledby")).to.equal(`${el.id}-heading`);
    // aria-label must not compete with the labelledby reference.
    expect(dialog.hasAttribute("aria-label")).to.be.false;
    // The referenced element must actually exist for the name to resolve.
    const heading = el.shadowRoot!.getElementById(`${el.id}-heading`);
    expect(heading).to.exist;
    expect(heading!.tagName.toLowerCase()).to.equal("h2");
    expect(accessibleName(el.shadowRoot!, dialog)).to.equal("Update Available");
  });

  it("names the dialog immediately on open (no deferred attribute writes)", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test"></nys-modal>`,
    );
    await el.updateComplete;

    el.open = true;
    await el.updateComplete;

    // Name must be complete on the first rendered frame — the old
    // implementation patched ARIA in a 100ms setTimeout.
    expect(accessibleName(el.shadowRoot!, getDialog(el))).to.equal("Test");
  });

  it("falls back to aria-label only when no heading is provided", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal ariaLabel="Session expiring" open></nys-modal>`,
    );
    await el.updateComplete;

    const dialog = getDialog(el);
    expect(dialog.getAttribute("aria-label")).to.equal("Session expiring");
    expect(dialog.hasAttribute("aria-labelledby")).to.be.false;
    expect(accessibleName(el.shadowRoot!, dialog)).to.equal("Session expiring");
  });

  it("prefers the heading over ariaLabel when both are set", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal
        heading="Update Available"
        ariaLabel="Ignored"
        open
      ></nys-modal>`,
    );
    await el.updateComplete;

    const dialog = getDialog(el);
    expect(dialog.hasAttribute("aria-label")).to.be.false;
    expect(accessibleName(el.shadowRoot!, dialog)).to.equal("Update Available");
  });

  it("exposes no name (and renders no empty heading) when neither heading nor ariaLabel is set", async () => {
    const el = await fixture<NysModal>(html`<nys-modal open></nys-modal>`);
    await el.updateComplete;

    const dialog = getDialog(el);
    // Must not point at — or render — an empty heading element.
    expect(dialog.hasAttribute("aria-labelledby")).to.be.false;
    expect(dialog.hasAttribute("aria-label")).to.be.false;
    expect(el.shadowRoot!.querySelector("h2")).to.not.exist;
    expect(accessibleName(el.shadowRoot!, dialog)).to.equal("");
  });

  it("gives the dismiss button a stable accessible name with no timing window", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test" open></nys-modal>`,
    );
    await el.updateComplete;

    const dismissBtn = el.shadowRoot!.querySelector("nys-button")!;
    // nys-button renders `label` as visually-hidden text inside the button when
    // `circle` is set, so this is the button's real accessible name.
    expect(dismissBtn.getAttribute("label")).to.equal("Close this window");
    // The removed workaround blanked the label and restored it 100ms later.
    expect(dismissBtn.hasAttribute("arialabel")).to.be.false;

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(dismissBtn.getAttribute("label")).to.equal("Close this window");
  });

  it("omits aria-describedby when there is nothing to describe", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test" open></nys-modal>`,
    );
    await el.updateComplete;
    expect(getDialog(el).hasAttribute("aria-describedby")).to.be.false;
  });

  it("describes the dialog from the subheading when one is provided", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal
        heading="Before you continue"
        subheading="Your progress has been saved."
        open
      ></nys-modal>`,
    );
    await el.updateComplete;

    const dialog = getDialog(el);
    expect(dialog.getAttribute("aria-describedby")).to.equal(
      `${el.id}-subheading`,
    );
    expect(el.shadowRoot!.getElementById(`${el.id}-subheading`)).to.exist;
  });

  it("passes the a11y audit while open", async () => {
    const el = await fixture(
      html`<nys-modal heading="Update Available" open>
        <p>An update is available.</p>
      </nys-modal>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  /*** Regression (WCAG 2.1.2): global keydown listener is removed on disconnect ***/
  it("removes the global keydown listener when disconnected", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test" open></nys-modal>`,
    );
    await el.updateComplete;

    let closeFired = false;
    el.addEventListener("nys-close", () => (closeFired = true));

    // Disconnect the element; its keydown handler should no longer be active.
    el.remove();
    await el.updateComplete;

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      cancelable: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    // Stale handler would have closed the (still-open) modal and fired nys-close.
    expect(closeFired).to.be.false;
    expect(event.defaultPrevented).to.be.false;
  });

  it("registers every nys-* element it renders", async () => {
    const el = await fixture<NysModal>(
      html`<nys-modal heading="Test" open></nys-modal>`,
    );
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });
});
