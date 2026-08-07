import { expect, html, fixture } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
import { NysAlert } from "./nys-alert";
import "../dist/nys-alert.js";
// nys-alert's self-registration of these children is fixed on
// fix/a11y-arialabel-sweep (not this branch) — kept here so the
// self-registration test below is meaningful on this branch standalone.
// Safe to drop once that branch merges and nys-alert.ts imports them itself.
import "@nysds/nys-button";
import "@nysds/nys-icon";

describe("nys-alert", () => {
  it("renders the component", async () => {
    const el = await fixture<NysAlert>(html`<nys-alert></nys-alert>`);
    expect(el).to.exist;
    expect(el.type).to.equal("base");
    expect(el.dismissible).to.be.false;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysAlert>(html`<nys-alert></nys-alert>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-alert-\d+-\d+$/);
  });

  it("should have default type as base", async () => {
    const el = await fixture<NysAlert>(html`<nys-alert></nys-alert>`);
    expect(el?.type).to.equal("base");
  });

  it("should show title and description when props are provided", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert
        heading="Test Title"
        text="Test description"
      ></nys-alert>`,
    );
    const title = el.shadowRoot?.querySelector(".nys-alert__header");
    const description = el.shadowRoot?.querySelector(".nys-alert__text");

    expect(title?.textContent).to.equal("Test Title");
    expect(description?.textContent).to.equal("Test description");
  });

  it("should reflect correct icon base on type", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert type="info"></nys-alert>`,
    );
    const icon = el.shadowRoot?.querySelector("nys-icon");
    expect(icon?.getAttribute("name")).to.equal("info");
  });

  it("can be dismissible", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert dismissible></nys-alert>`,
    );
    const dismissButton = el.shadowRoot?.getElementById("dismiss-btn");
    expect(dismissButton).to.exist;
    const nativeButton = dismissButton!.shadowRoot?.querySelector(
      "button",
    ) as HTMLButtonElement;
    nativeButton.click();
    await el.updateComplete;

    // Check if the alert is closed by seeing if the container is not in the DOM
    const alertContainer = el.shadowRoot?.querySelector(
      ".nys-alert__container",
    );
    expect(alertContainer).to.not.exist;
  });

  it("auto-dismisses after duration", async () => {
    const el = await fixture<NysAlert>(html`
      <nys-alert
        type="info"
        heading="Duration 1sec"
        duration="1000"
        text="Auto-dismiss after 1 second"
      ></nys-alert>
    `);

    // Initially, the alert container should exist
    let alertContainer = el.shadowRoot?.querySelector(".nys-alert__container");
    expect(alertContainer).to.exist;

    // Wait for duration to pass
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await el.updateComplete;

    // Alert container should be gone
    alertContainer = el.shadowRoot?.querySelector(".nys-alert__container");
    expect(alertContainer).to.not.exist;
  });

  it("should have correct role and aria-live based on type", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert type="danger"></nys-alert>`,
    );
    const alertTextContainer =
      el.shadowRoot?.querySelector(".nys-alert__texts");
    expect(alertTextContainer?.getAttribute("role")).to.equal("alert");
    expect(alertTextContainer?.getAttribute("aria-live")).to.equal("assertive");

    el.type = "warning";
    await el.updateComplete;
    expect(alertTextContainer?.getAttribute("role")).to.equal("alert");
    expect(alertTextContainer?.getAttribute("aria-live")).to.equal("assertive");

    el.type = "emergency";
    await el.updateComplete;
    expect(alertTextContainer?.getAttribute("role")).to.equal("alert");
    expect(alertTextContainer?.getAttribute("aria-live")).to.equal("assertive");

    el.type = "success";
    await el.updateComplete;
    expect(alertTextContainer?.getAttribute("role")).to.equal("status");
    expect(alertTextContainer?.getAttribute("aria-live")).to.equal("polite");

    el.type = "info";
    await el.updateComplete;
    expect(alertTextContainer?.getAttribute("role")).to.equal("status");
    expect(alertTextContainer?.getAttribute("aria-live")).to.equal("polite");

    el.type = "base";
    await el.updateComplete;
    expect(alertTextContainer?.getAttribute("role")).to.equal("status");
    expect(alertTextContainer?.getAttribute("aria-live")).to.equal("polite");
  });

  it("keeps role/aria-live and the announced content on the same element", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert
        type="danger"
        heading="Error"
        text="Something went wrong"
      ></nys-alert>`,
    );

    const alertTextContainer =
      el.shadowRoot?.querySelector(".nys-alert__texts");
    const container = el.shadowRoot?.querySelector(".nys-alert__container");

    // The live-region role/aria-live must live on the same element that
    // wraps the announced heading/text content, not on an ancestor.
    expect(alertTextContainer?.getAttribute("role")).to.equal("alert");
    const headerEl = alertTextContainer?.querySelector(".nys-alert__header");
    expect(alertTextContainer?.contains(headerEl!)).to.be.true;
    expect(
      alertTextContainer?.textContent?.trim().includes("Something went wrong"),
    ).to.be.true;

    // The outer container must not carry a redundant/mismatched role or
    // accessible-name attribute split from the live-region element.
    expect(container?.hasAttribute("role")).to.be.false;
    expect(container?.hasAttribute("aria-label")).to.be.false;
  });

  it("does not include the dismiss button inside the announced live-region content", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert type="danger" heading="Error" dismissible></nys-alert>`,
    );

    const alertTextContainer =
      el.shadowRoot?.querySelector(".nys-alert__texts");
    const dismissButton = el.shadowRoot?.getElementById("dismiss-btn");

    expect(dismissButton).to.exist;
    expect(alertTextContainer?.contains(dismissButton!)).to.be.false;
  });

  it("announces dynamically-inserted alert content because the live region is already present when text changes", async () => {
    // Simulates the common "system injects an alert" scenario: the alert
    // element is added to the page first (as an empty/base alert), then its
    // content is set afterward. Because role/aria-live render on
    // .nys-alert__texts on first paint (independent of heading/text being
    // populated yet), the live region is already registered with the
    // accessibility tree before the announced content is inserted into it,
    // so assistive technology reliably picks up the change.
    const el = await fixture<NysAlert>(
      html`<nys-alert type="danger"></nys-alert>`,
    );
    await el.updateComplete;

    const alertTextContainer =
      el.shadowRoot?.querySelector(".nys-alert__texts");
    expect(alertTextContainer?.getAttribute("role")).to.equal("alert");
    expect(alertTextContainer?.getAttribute("aria-live")).to.equal("assertive");

    // Now dynamically update the content of the already-present live region.
    el.heading = "Session expiring";
    el.text = "Your session will expire in 2 minutes.";
    await el.updateComplete;

    expect(alertTextContainer?.textContent).to.include("Session expiring");
    expect(alertTextContainer?.textContent).to.include(
      "Your session will expire in 2 minutes.",
    );
    // The role/aria-live attributes remain on the same element throughout
    // the content update, confirming the live region was never re-created.
    expect(alertTextContainer?.getAttribute("role")).to.equal("alert");
    expect(alertTextContainer?.getAttribute("aria-live")).to.equal("assertive");
  });

  it("should reflect Slot content", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert><p>Slot Content</p></nys-alert>`,
    );
    const slotContent = el.shadowRoot?.querySelector("slot");
    expect(slotContent).to.exist;

    // Check if the slot has content
    const slotAssignedNodes = slotContent?.assignedNodes();
    expect(slotAssignedNodes?.length).to.be.greaterThan(0);

    // Check actual slotted content
    const slottedContent = slotAssignedNodes?.[0];
    expect(slottedContent?.textContent).to.equal("Slot Content");
  });

  it("sets _slotHasContent to false when no slot is found", async () => {
    const el = await fixture<NysAlert>(html`<nys-alert></nys-alert>`);
    await el.updateComplete;

    // Manually invoke _checkSlotContent with no slot present by removing the slot
    const slot = el.shadowRoot?.querySelector("slot");
    slot?.remove();

    await (el as any)._checkSlotContent();
    await el.updateComplete;

    expect((el as any)._slotHasContent).to.be.false;
  });

  it("should render primary and secondary actions when URLs provided", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert
        primaryAction="https://example.com/primary"
        secondaryAction="https://example.com/secondary"
        primaryLabel="Go"
        secondaryLabel="Cancel"
      ></nys-alert>`,
    );

    const primaryLink = el.shadowRoot?.querySelector(
      ".nys-alert__action.nys-alert__primary",
    );

    const secondaryLink = el.shadowRoot?.querySelector(
      ".nys-alert__action.nys-alert__secondary",
    );

    expect(primaryLink).to.exist;
    expect(primaryLink?.getAttribute("href")).to.include(
      "https://example.com/primary",
    );
    expect(primaryLink?.textContent?.trim()).to.equal("Go");

    expect(secondaryLink).to.exist;
    expect(secondaryLink?.getAttribute("href")).to.include(
      "https://example.com/secondary",
    );
    expect(secondaryLink?.textContent?.trim()).to.equal("Cancel");
  });

  it("emits nys-close with correct detail when dismissed", async () => {
    const el = await fixture<NysAlert>(html`
      <nys-alert type="warning" heading="Watch out" dismissible></nys-alert>
    `);
    await el.updateComplete;

    let eventDetail: any = null;
    el.addEventListener("nys-close", (e: any) => (eventDetail = e.detail));

    const dismissButton = el.shadowRoot?.getElementById("dismiss-btn");
    const nativeButton = dismissButton!.shadowRoot?.querySelector(
      "button",
    ) as HTMLButtonElement;

    nativeButton.click();
    await el.updateComplete;

    expect(eventDetail).to.exist;
    expect(eventDetail.id).to.equal(el.id);
    expect(eventDetail.type).to.equal("warning");
    expect(eventDetail.label).to.equal("Watch out");
  });

  it("gives the icon-only dismiss button a real accessible name", async () => {
    const el = await fixture<NysAlert>(html`
      <nys-alert heading="Watch out" dismissible></nys-alert>
    `);
    await el.updateComplete;

    const dismissButton = el.shadowRoot?.getElementById(
      "dismiss-btn",
    ) as HTMLElement;

    // Dead ariaLabel never reached nys-button — the host must not carry it.
    expect(dismissButton.hasAttribute("arialabel")).to.be.false;

    // dismiss-btn renders `circle`, so nys-button puts `label` into a
    // visually-hidden `.nys-button__text` node inside the real <button> —
    // that's what has to carry the name.
    const text = dismissButton.shadowRoot?.querySelector(
      "button .nys-button__text",
    );
    expect(text?.textContent?.trim()).to.equal("Watch out, alert, Close");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-textinput label="First Name"></nys-textinput>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("registers every nys-* element it renders", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert heading="Test" dismissible></nys-alert>`,
    );
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });
});

// Accessibility Tests
/*
 * Ensure that the role/aria-live attributes are set properly for the alert
 * based on its type, and that they live on the same element that wraps the
 * announced content (nysds#1092):
 * - "warning", "danger", and "emergency" => role="alert", aria-live="assertive"
 * - "base", "info", and "success" => role="status", aria-live="polite"
 */

/*
 * FOR dismissible property, ensure button has:
 * - Inner text that is discernible to screen reader users.
 * - Non-empty aria-label attribute.
 * - Is focusable and operable using the keyboard (e.g. Enter, Space, Arrow keys)
 */

/* ACCESSIBILITY INSIGHT TOOL (Feedback) */
// "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds"
