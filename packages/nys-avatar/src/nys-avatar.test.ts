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

  it("sets _slotHasContent to false when slot element is not found", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);

    // Force the slot lookup to fail
    const originalQuery = el.shadowRoot?.querySelector.bind(el.shadowRoot);
    (el.shadowRoot as ShadowRoot).querySelector = () => null;

    // Call the internal slot handler
    (el as any)._handleSlotChange();

    expect((el as any)._slotHasContent).to.be.false;

    // Restore querySelector
    (el.shadowRoot as ShadowRoot).querySelector = originalQuery!;
  });

  // -------------------------------------------------------------------------
  // getContrastForeground — untested branches
  // -------------------------------------------------------------------------

  it("getContrastForeground returns light icon foreground for dark color with no initials", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar color="#000000"></nys-avatar>`,
    );
    await el.updateComplete;

    const result = (el as any).getContrastForeground();
    expect(result).to.equal("var(--nys-color-ink-reverse, #fff)");
  });

  it("getContrastForeground returns dark icon foreground for light color with no initials", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar color="#ffffff"></nys-avatar>`,
    );
    await el.updateComplete;

    const result = (el as any).getContrastForeground();
    expect(result).to.equal("var(--nys-color-ink, #000)");
  });

  // -------------------------------------------------------------------------
  // Render — interactive/disabled tabindex and role
  // -------------------------------------------------------------------------

  it("sets role=button and tabindex=0 when interactive and not disabled", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar interactive></nys-avatar>`,
    );
    await el.updateComplete;

    const component = el.shadowRoot!.querySelector(".nys-avatar__component")!;
    expect(component.getAttribute("role")).to.equal("button");
    expect(component.getAttribute("tabindex")).to.equal("0");
  });

  it("omits tabindex when interactive and disabled", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar interactive disabled></nys-avatar>`,
    );
    await el.updateComplete;

    const component = el.shadowRoot!.querySelector(".nys-avatar__component")!;
    expect(component.getAttribute("role")).to.equal("button");
    expect(component.hasAttribute("tabindex")).to.be.false;
  });

  // -------------------------------------------------------------------------
  // Render — image branch role/aria-label/alt behavior
  // -------------------------------------------------------------------------

  it("omits role and aria-label from container when image is present", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar image="/photo.jpg" ariaLabel="Jane"></nys-avatar>`,
    );
    await el.updateComplete;

    const component = el.shadowRoot!.querySelector(".nys-avatar__component")!;
    expect(component.hasAttribute("role")).to.be.false;
    expect(component.hasAttribute("aria-label")).to.be.false;
  });

  it("falls back to alt=avatar on img when ariaLabel is not set", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar image="/photo.jpg"></nys-avatar>`,
    );
    await el.updateComplete;

    const img = el.shadowRoot!.querySelector("img")!;
    expect(img.getAttribute("alt")).to.equal("avatar");
  });

  it("sets loading=lazy on img when lazy is true", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar image="/photo.jpg" lazy></nys-avatar>`,
    );
    await el.updateComplete;

    const img = el.shadowRoot!.querySelector("img")!;
    expect(img.getAttribute("loading")).to.equal("lazy");
  });

  // -------------------------------------------------------------------------
  // Render — custom icon name
  // -------------------------------------------------------------------------

  it("renders the custom icon name instead of account_circle", async () => {
    const el = await fixture<NysAvatar>(
      html`<nys-avatar icon="person"></nys-avatar>`,
    );
    await el.updateComplete;

    const icon = el.shadowRoot!.querySelector("nys-icon")!;
    expect(icon.getAttribute("name")).to.equal("person");
  });

  // -------------------------------------------------------------------------
  // Render — aria-label default when ariaLabel prop absent and no image
  // -------------------------------------------------------------------------

  it("defaults aria-label to 'avatar' on container when ariaLabel is not set", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);
    await el.updateComplete;

    const component = el.shadowRoot!.querySelector(".nys-avatar__component")!;
    expect(component.getAttribute("aria-label")).to.equal("avatar");
  });

  // -------------------------------------------------------------------------
  // _handleSlotChange — whitespace-only text node filtered out
  // -------------------------------------------------------------------------

  it("_handleSlotChange treats whitespace-only text nodes as empty and keeps default icon", async () => {
    const el = await fixture<NysAvatar>(html`<nys-avatar></nys-avatar>`);
    await el.updateComplete;

    // Add a whitespace-only text node
    el.appendChild(document.createTextNode("   "));

    await el.updateComplete;
    await new Promise((r) => setTimeout(r));

    // _slotHasContent should remain false — whitespace filtered out
    expect((el as any)._slotHasContent).to.be.false;
    expect(el.shadowRoot!.querySelector("nys-icon")).to.exist;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-avatar></nys-avatar>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
