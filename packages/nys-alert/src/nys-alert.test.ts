import { expect, html, fixture } from "@open-wc/testing";
import { NysAlert } from "./nys-alert";
import "../dist/nys-alert.js";

describe("nys-alert", () => {
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

    // Click the dismiss button
    dismissButton!.click();
    await el.updateComplete;

    // Check if the alert is closed by seeing if the container is not in the DOM
    const alertContainer = el.shadowRoot?.querySelector(
      ".nys-alert__container",
    );
    expect(alertContainer).to.not.exist;
  });

  it("should have correct role attribute based on type", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert type="danger"></nys-alert>`,
    );
    const alertContainer = el.shadowRoot?.querySelector(
      ".nys-alert__container",
    );
    expect(alertContainer?.getAttribute("role")).to.equal("alert");

    el.type = "success";
    await el.updateComplete;
    expect(alertContainer?.getAttribute("role")).to.equal("status");

    el.type = "info";
    await el.updateComplete;
    expect(alertContainer?.getAttribute("role")).to.equal("region");
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

  it("should allow dismissing the alert with keyboard", async () => {
    const el = await fixture<NysAlert>(
      html`<nys-alert dismissible></nys-alert>`,
    );

    const dismissBtn = el.shadowRoot?.getElementById("dismiss-btn");
    expect(dismissBtn).to.exist;

    // Simulate keyboard press (space key)
    const spaceEvent = new KeyboardEvent("keydown", {
      key: " ",
      code: "Space",
      bubbles: true,
    });
    dismissBtn?.dispatchEvent(spaceEvent);
    await el.updateComplete;

    const containerAfter = el.shadowRoot?.querySelector(
      ".nys-alert__container",
    );
    expect(containerAfter).to.not.exist;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-textinput label="First Name"></nys-textinput>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});

/*** Accessibility tests ***/
/*
 * Ensure that the role attribute is set properly for the alert based on its type:
 * - "danger" and "emergency" should have role="alert"
 * - "success" should have role="status"
 * - All other types should have role="region"
 */

/*
 * FOR dismissible property, ensure button has:
 * - Inner text that is discernible to screen reader users.
 * - Non-empty aria-label attribute.
 * - Is focusable and operable using the keyboard (e.g. Enter, Space, Arrow keys)
 */

/* ACCESSIBILITY INSIGHT TOOL (Feedback) */
// "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds"
