import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-divider.js";
import { NysDivider } from "./nys-divider.js";

describe("nys-divider", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-divider></nys-divider>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysDivider>(html`<nys-divider></nys-divider>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-divider-\d+-\d+$/);
  });

  it("does not override a provided id", async () => {
    const el = await fixture<NysDivider>(
      html`<nys-divider id="custom-divider"></nys-divider>`,
    );
    await el.updateComplete;

    expect(el.id).to.equal("custom-divider");
  });

  it("reflects role='separator' on the host via internals", async () => {
    const el = await fixture<NysDivider>(html`<nys-divider></nys-divider>`);
    await el.updateComplete;

    // ElementInternals reflects role; some engines expose it via the host
    // attribute fallback. Accept either source.
    const internalsRole = (el as unknown as { internals?: ElementInternals })
      .internals?.role;
    const role = internalsRole ?? el.getAttribute("role");
    expect(role).to.equal("separator");
  });

  it("marks the inner <hr> as presentational so the separator is not announced twice", async () => {
    const el = await fixture<NysDivider>(html`<nys-divider></nys-divider>`);
    await el.updateComplete;

    const hr = el.shadowRoot?.querySelector("hr");
    expect(hr).to.exist;
    expect(hr?.getAttribute("role")).to.equal("presentation");
    expect(hr?.getAttribute("aria-hidden")).to.equal("true");
  });

  it("reflects inverted property correctly", async () => {
    const el = await fixture<NysDivider>(html`
      <nys-divider inverted></nys-divider>
    `);
    expect(el.inverted).to.be.true;
  });

  it("reflects subtle property correctly", async () => {
    const el = await fixture<NysDivider>(html`
      <nys-divider subtle></nys-divider>
    `);
    expect(el.subtle).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-divider></nys-divider>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
