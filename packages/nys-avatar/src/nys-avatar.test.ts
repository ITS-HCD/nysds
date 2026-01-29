import { expect, html, fixture } from "@open-wc/testing";
import { NysAvatar } from "./nys-avatar";
import "../dist/nys-avatar.js";

describe("nys-avatar", () => {
  it("renders the component", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-avatar-\d+-\d+$/);
  });

  it("should have default color as #eff6fb", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);

    const avatarContainer = el?.shadowRoot?.querySelector(
      ".nys-avatar__component",
    );
    const bgColor =
      avatarContainer && getComputedStyle(avatarContainer).backgroundColor;

    // Check against the expected RGB value of #EFF6FB
    expect(bgColor).to.equal("rgb(239, 246, 251)");
  });

  it("should have icon as default", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);

    const icon = el?.shadowRoot?.querySelector("nys-icon");

    expect(icon).to.exist;
    expect(icon?.getAttribute("name")).to.equal("account_circle");
  });

  it("should have aria-label if ariaLabel prop is provided", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar ariaLabel="user avatar"></nys-avatar>`,
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
        ariaLabel="Test Avatar"
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

  it("computes a light foreground color when color prop is dark", async () => {
    const el = await fixture<NysAvatar>(html`
      <nys-avatar initials="NY" color="#154973"></nys-avatar>
    `);

    const initials = el.shadowRoot?.querySelector(
      ".nys-avatar__initials",
    ) as HTMLElement;

    const computedColor = getComputedStyle(initials).color;

    expect(computedColor).to.equal("rgb(255, 255, 255)");
  });

  it("computes a dark foreground color when color prop is light", async () => {
    const el = await fixture<NysAvatar>(html`
      <nys-avatar initials="NY" color="#cddde9"></nys-avatar>
    `);

    const initials = el.shadowRoot?.querySelector(
      ".nys-avatar__initials",
    ) as HTMLElement;

    const computedColor = getComputedStyle(initials).color;

    expect(computedColor).to.equal("rgb(0, 0, 0)");
  });

  it("updates internal slot state when slot content is added or removed", async () => {
    const el = await fixture<NysAvatar>(html` <nys-avatar></nys-avatar> `);

    // Initially, default icon should be rendered
    let icon = el.shadowRoot?.querySelector("nys-icon");
    expect(icon).to.exist;

    // Add slotted content
    const slottedEl = document.createElement("span");
    slottedEl.textContent = "X";
    el.appendChild(slottedEl);

    // Wait for slotchange handling
    await el.updateComplete;
    await new Promise((r) => setTimeout(r));

    // Default icon should be removed when slot has content
    icon = el.shadowRoot?.querySelector("nys-icon");
    expect(icon).to.not.exist;

    // Remove slotted content
    el.removeChild(slottedEl);

    await el.updateComplete;
    await new Promise((r) => setTimeout(r));

    // Default icon should return
    icon = el.shadowRoot?.querySelector("nys-icon");
    expect(icon).to.exist;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-avatar></nys-avatar>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
