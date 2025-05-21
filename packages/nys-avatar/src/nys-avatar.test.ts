import { expect, html, fixture } from "@open-wc/testing";
import { NysAvatar } from "./nys-avatar";
import "../dist/nys-avatar.js";

describe("nys-avatar", () => {
  it("should have default shape as circle", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);
    expect(el?.shape).to.equal("circle");
  });

  it("should have default color as #555", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);

    const avatarContainer = el?.shadowRoot?.querySelector(
      ".nys-avatar__component",
    );
    expect(avatarContainer?.getAttribute("style")).to.include(
      "background-color: #555",
    );
  });

  it("should have icon as default", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);

    const icon = el?.shadowRoot?.querySelector("nys-icon");

    expect(icon).to.exist;
    expect(icon?.getAttribute("name")).to.equal("account_circle");
  });

  it("should have aria-label if label prop is provided", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar label="user avatar"></nys-avatar>`,
    );
    const avatarContainer = el?.shadowRoot?.querySelector(
      ".nys-avatar__component",
    );

    expect(avatarContainer?.getAttribute("aria-label")).to.equal("user avatar");
  });

  it("allows image prop to take priority and override initials and icons.", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar
        image="https://images.cats.com"
        initials="NYS"
        icon="account_circle"
        label="Test Avatar"
      ></nys-avatar>`,
    );

    const image = el?.shadowRoot?.querySelector("img");
    const initials = el?.shadowRoot?.querySelector(".nys-avatar__initials");
    const icon = el?.shadowRoot?.querySelector("nys-icon");

    expect(image).to.exist;
    expect(initials).to.not.exist;
    expect(icon).to.not.exist;
    expect(image?.getAttribute("src")).to.equal("https://images.cats.com");
  });

  it("should take in initials and override icon", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar initials="NYS"></nys-avatar>`,
    );

    const initials = el?.shadowRoot?.querySelector(".nys-avatar__initials");
    const icon = el?.shadowRoot?.querySelector("nys-icon");

    expect(initials).to.exist;
    expect(initials?.textContent).to.equal("NYS");
    expect(icon).to.not.exist;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-avatar></nys-avatar>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});

/*** Accessibility tests ***/
/*
 * ENSURE ALT TEXT:
 * - For initial avatars, include the person's full name as descriptive alt text if the person's full name is not shown next to the avatar
 * - For photo avatars, include the person's full name as descriptive alt text if the person's full name is not shown next to the avatar
 * A label property to provide accessible text for screen readers (or default fallback text "avatar")
 */

/* ACCESSIBILITY INSIGHT TOOL (Feedback) */
// "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds"
