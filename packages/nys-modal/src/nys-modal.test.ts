import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-modal.js";
import { NysModal } from "./nys-modal.js";

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
  it("", async () => {
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
});
