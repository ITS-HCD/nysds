import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-tab.js";
import { NysTab } from "./nys-tab.js";
import { NysTabgroup } from "./nys-tabgroup.js";

describe("nys-tab", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-tab></nys-tab>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysTab>(html`<nys-tab></nys-tab>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-tab-\d+-\d+$/);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="My Label"></nys-tab>
        <nys-tabpanel>Content for My Label.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tab = el.shadowRoot!.querySelector("nys-tab")!;
    const tabPanel = el.shadowRoot!.querySelector("nys-tabpanel")!;
    await expect(tab).shadowDom.to.be.accessible();
    await expect(tabPanel).shadowDom.to.be.accessible();
  });

  it("sets selected on the first tab if none have selected assigned", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="Tab One"></nys-tab>
        <nys-tab label="Tab Two"></nys-tab>
        <nys-tab label="Tab Three"></nys-tab>
        <nys-tabpanel>Content for Tab One.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Two.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Three.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tabs = el.shadowRoot!.querySelectorAll("nys-tab");
    expect(tabs[0].hasAttribute("selected")).to.be.true;
    expect(tabs[1].hasAttribute("selected")).to.be.false;
    expect(tabs[2].hasAttribute("selected")).to.be.false;
  });

  it("removes selected from extra tabs if more than one has it assigned", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="Tab One" selected></nys-tab>
        <nys-tab label="Tab Two" selected></nys-tab>
        <nys-tab label="Tab Three" selected></nys-tab>
        <nys-tabpanel>Content for Tab One.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Two.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Three.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tabs = el.shadowRoot!.querySelectorAll("nys-tab");
    expect(tabs[0].hasAttribute("selected")).to.be.true;
    expect(tabs[1].hasAttribute("selected")).to.be.false;
    expect(tabs[2].hasAttribute("selected")).to.be.false;
  });
});
