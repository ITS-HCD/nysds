import { expect, html, fixture } from "@open-wc/testing";
import { NysAlert } from "./nys-alert";
import "../dist/nys-alert.js";

describe("nys-alert", () => {
  it("should have default type as base", async () => {
    const el = await fixture<NysAlert>(html`<nys-alert></nys-alert>`);
    expect(el?.type).to.equal("base");
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
