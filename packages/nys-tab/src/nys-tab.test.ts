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
  it("should return the correct tabs and panels from _getTabs and _getPanels", async () => {
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

    const tabs = (el as any)._getTabs();
    const panels = (el as any)._getPanels();

    expect(tabs.length).to.equal(3);
    expect(panels.length).to.equal(3);

    expect(tabs[0].getAttribute("label")).to.equal("Tab One");
    expect(tabs[1].getAttribute("label")).to.equal("Tab Two");
    expect(tabs[2].getAttribute("label")).to.equal("Tab Three");

    expect(panels[0].textContent?.trim()).to.equal("Content for Tab One.");
    expect(panels[1].textContent?.trim()).to.equal("Content for Tab Two.");
    expect(panels[2].textContent?.trim()).to.equal("Content for Tab Three.");
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

  it("should dispatch nys-tab-focus and nys-tab-blur events", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="Tab One"></nys-tab>
        <nys-tabpanel>Content for Tab One.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tab = el.shadowRoot!.querySelector("nys-tab")!;
    await (tab as any).updateComplete;

    const nysButton = tab.shadowRoot!.querySelector("nys-button")!;

    let focusFired = false;
    let blurFired = false;

    tab.addEventListener("nys-tab-focus", () => {
      focusFired = true;
    });
    tab.addEventListener("nys-tab-blur", () => {
      blurFired = true;
    });

    nysButton.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true }),
    );
    expect(focusFired).to.be.true;

    nysButton.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true }),
    );
    expect(blurFired).to.be.true;
  });
});
