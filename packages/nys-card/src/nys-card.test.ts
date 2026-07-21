import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-card.js";
import { NysCard } from "./nys-card.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-card", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-card></nys-card>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysCard>(html`<nys-card></nys-card>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-card-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label"></nys-card>
    `);
    expect(el.heading).to.equal("My Label");
  });

  it("defaults headingLevel to h2", async () => {
    const el = await fixture<NysCard>(html`<nys-card></nys-card>`);
    expect(el.headingLevel).to.equal("h2");
  });

  it("reflects headingLevel attribute to property", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card headingLevel="h3"></nys-card>
    `);
    expect(el.headingLevel).to.equal("h3");
  });

  it("renders the correct heading tag based on headingLevel", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label" headingLevel="h3"></nys-card>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("h3.nys-card__heading")).to.exist;
    expect(el.shadowRoot?.querySelector("h2.nys-card__heading")).to.not.exist;
  });

  // ── Media Accent ──────────────────────────────────
  const MEDIA =
    "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070";

  // Returns [month, day] from the rendered accent, or null when not rendered.
  const readAccent = (el: NysCard) => {
    const accent = el.shadowRoot?.querySelector(".nys-card--media-accent");
    if (!accent) return null;
    return [
      accent
        .querySelector(".nys-card--media-accent-month")
        ?.textContent?.trim(),
      accent.querySelector(".nys-card--media-accent-day")?.textContent?.trim(),
    ];
  };

  it("renders the media accent as a month abbreviation and day", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card media=${MEDIA} mediaAccent="10/16"></nys-card>
    `);
    await el.updateComplete;
    expect(readAccent(el)).to.deep.equal(["Oct", "16"]);
  });

  it("renders the first and last months of the year", async () => {
    const jan = await fixture<NysCard>(html`
      <nys-card media=${MEDIA} mediaAccent="1/1"></nys-card>
    `);
    await jan.updateComplete;
    expect(readAccent(jan)).to.deep.equal(["Jan", "1"]);

    const dec = await fixture<NysCard>(html`
      <nys-card media=${MEDIA} mediaAccent="12/31"></nys-card>
    `);
    await dec.updateComplete;
    expect(readAccent(dec)).to.deep.equal(["Dec", "31"]);
  });

  it("does not render the media accent for invalid values", async () => {
    const invalid = [
      "", // empty
      "10", // missing day
      "10/16/2026", // too many parts
      "0/16", // month below range
      "13/16", // month above range
      "10/0", // day below range
      "10/32", // day above range
      "Oct/16", // non-numeric
      "10.5/16", // non-integer
    ];

    for (const mediaAccent of invalid) {
      const el = await fixture<NysCard>(html`
        <nys-card media=${MEDIA} mediaAccent=${mediaAccent}></nys-card>
      `);
      await el.updateComplete;
      expect(readAccent(el), `expected "${mediaAccent}" to render no accent`).to
        .be.null;
    }
  });

  it("does not render the media accent when media is not set", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card mediaAccent="10/16"></nys-card>
    `);
    await el.updateComplete;
    expect(readAccent(el)).to.be.null;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-card heading="My Label"></nys-card>`);
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
