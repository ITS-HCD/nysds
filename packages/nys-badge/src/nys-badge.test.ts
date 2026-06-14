import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-badge.js";
import { NysBadge } from "./nys-badge.js";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-badge", () => {
  it("renders the component", async () => {
    const el = await fixture<NysBadge>(html`<nys-badge></nys-badge>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysBadge>(html`<nys-badge></nys-badge>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-badge-\d+-\d+$/);
  });

  it("auto-generated id matches the <tag>-<ts>-<n> format", async () => {
    const el = await fixture<NysBadge>(html`<nys-badge></nys-badge>`);
    await el.updateComplete;
    expect(el.id).to.match(/^nys-badge-\d+-\d+$/);
  });

  it("preserves an author-provided id", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge id="my-badge"></nys-badge>`,
    );
    await el.updateComplete;
    expect(el.id).to.equal("my-badge");
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysBadge>(html`
      <nys-badge label="My Label" prefixIcon suffixIcon></nys-badge>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.prefixIcon).to.be.true;
    expect(el.suffixIcon).to.be.true;
  });

  it("default intent is neutral", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="My Label"></nys-badge>`,
    );
    await el.updateComplete;

    expect(el.intent).to.equal("neutral");

    const computed = getComputedStyle(el);
    const backgroundColor = computed.getPropertyValue(
      "--_nys-badge-background-color",
    );
    const borderColor = computed.getPropertyValue("--_nys-badge-border-color");
    expect(backgroundColor).to.equal("#f6f6f6");
    expect(borderColor).to.equal("#62666a");
  });

  it("strong is applied properly", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge
        label="My Label"
        intent="success"
        variant="strong"
        prefixIcon
      ></nys-badge>`,
    );
    await el.updateComplete;

    expect(el.intent).to.equal("success");

    const computed = getComputedStyle(el);
    const backgroundColor = computed.getPropertyValue(
      "--_nys-badge-background-color",
    );
    const borderColor = computed.getPropertyValue("--_nys-badge-border-color");
    const color = computed.getPropertyValue("--_nys-badge-color");

    expect(backgroundColor).to.equal("#1e752e");
    expect(borderColor).to.equal("#1e752e");
    expect(color).to.equal("#ffffff");
  });

  it("can have custom icons", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="My Label" prefixIcon="check"></nys-badge>`,
    );
    expect(el.prefixIcon).to.equal("check");
  });

  it("renders the prefixLabel", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge prefixLabel="prefix" label="label"></nys-badge>`,
    );
    expect(el.prefixLabel).to.equal("prefix");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="My Label"></nys-badge>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("renders a mark element as the badge container", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="My Label"></nys-badge>`,
    );
    await el.updateComplete;
    const mark = el.shadowRoot!.querySelector("mark.nys-badge");
    expect(mark).to.exist;
  });

  it("renders sr-only span when srText is provided", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="Warning" srText="concern"></nys-badge>`,
    );
    await el.updateComplete;
    const srOnly = el.shadowRoot!.querySelector(".nys-badge__sr-only");
    expect(srOnly).to.exist;
    expect(srOnly!.textContent).to.equal(": concern"); // added colon so the words don't get smushed together by screenreaders
  });

  it("does not render sr-only span when srText is empty", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="Warning"></nys-badge>`,
    );
    await el.updateComplete;
    const srOnly = el.shadowRoot!.querySelector(".nys-badge__sr-only");
    expect(srOnly).to.be.null;
  });

  // WCAG 1.4.1 Use of Color: semantic intent must not be conveyed by color
  // (and a decorative aria-hidden icon) alone. A screen-reader-only text
  // alternative is rendered for non-neutral intents.
  it("renders a screen-reader-only intent label for error intent", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="Payment failed" intent="error"></nys-badge>`,
    );
    await el.updateComplete;
    const srOnly = el.shadowRoot!.querySelector(".nys-badge__sr-only");
    expect(srOnly).to.exist;
    expect(srOnly!.textContent).to.equal("Error: ");
  });

  it("renders a screen-reader-only intent label for success intent", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="Approved" intent="success"></nys-badge>`,
    );
    await el.updateComplete;
    const srOnly = el.shadowRoot!.querySelector(".nys-badge__sr-only");
    expect(srOnly).to.exist;
    expect(srOnly!.textContent).to.equal("Success: ");
  });

  it("renders a screen-reader-only intent label for warning intent", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="Expiring soon" intent="warning"></nys-badge>`,
    );
    await el.updateComplete;
    const srOnly = el.shadowRoot!.querySelector(".nys-badge__sr-only");
    expect(srOnly).to.exist;
    expect(srOnly!.textContent).to.equal("Warning: ");
  });

  it("does not render an intent label for neutral intent", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="Draft" intent="neutral"></nys-badge>`,
    );
    await el.updateComplete;
    const srOnly = el.shadowRoot!.querySelector(".nys-badge__sr-only");
    expect(srOnly).to.be.null;
  });

  it("author srText overrides the default intent label", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge
        label="Payment failed"
        intent="error"
        srText="action required"
      ></nys-badge>`,
    );
    await el.updateComplete;
    const srOnly = el.shadowRoot!.querySelectorAll(".nys-badge__sr-only");
    // Only the author-provided srText span is rendered (no duplicate intent label).
    expect(srOnly.length).to.equal(1);
    expect(srOnly[0].textContent).to.equal(": action required");
  });

  it("passes the a11y audit with a non-neutral intent", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge
        label="Approved"
        intent="success"
        prefixIcon
      ></nys-badge>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
