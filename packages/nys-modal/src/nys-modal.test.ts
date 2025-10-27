import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-modal.js";
import { NysModal } from "./nys-modal.js";

describe("nys-modal", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-modal></nys-modal>`);
    expect(el).to.exist;
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

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-modal heading="Update Available"></nys-modal>`,
    );
    await expect(el).shadowDom.to.be.accessible();
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
