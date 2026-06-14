import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-tab.js";
import { NysTab } from "./nys-tab.js";
import { NysTabgroup } from "./nys-tabgroup.js";
import { NysTabpanel } from "./nys-tabpanel.js";

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

  it("nys-tabgroup auto-generates an id in the <tag>-<ts>-<n> format", async () => {
    const el = await fixture<NysTabgroup>(html`<nys-tabgroup></nys-tabgroup>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-tabgroup-\d+-\d+$/);
  });

  it("nys-tabpanel auto-generates an id in the <tag>-<ts>-<n> format", async () => {
    const el = await fixture<NysTabpanel>(html`<nys-tabpanel></nys-tabpanel>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-tabpanel-\d+-\d+$/);
  });

  it("respects a consumer-supplied id (does not overwrite it)", async () => {
    const el = await fixture<NysTab>(
      html`<nys-tab id="my-custom-tab"></nys-tab>`,
    );
    await el.updateComplete;

    expect(el.id).to.equal("my-custom-tab");
  });

  it("a standalone nys-tab exposes aria-selected (WAI-ARIA Tabs Pattern)", async () => {
    const el = await fixture<NysTab>(html`<nys-tab label="Solo"></nys-tab>`);
    await el.updateComplete;

    // Even outside a tabgroup, role=tab must carry a selected state.
    expect(el.getAttribute("role")).to.equal("tab");
    expect(el.hasAttribute("aria-selected")).to.be.true;
    expect(el.getAttribute("aria-selected")).to.equal("false");
  });

  it("a standalone selected nys-tab reflects aria-selected=true", async () => {
    const el = await fixture<NysTab>(
      html`<nys-tab label="Solo" selected></nys-tab>`,
    );
    await el.updateComplete;

    expect(el.getAttribute("aria-selected")).to.equal("true");
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

  it("focus() on nys-tab dispatches nys-tab-focus", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="Tab One"></nys-tab>
        <nys-tabpanel>Content for Tab One.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tab = el.shadowRoot!.querySelector("nys-tab")! as NysTab;
    await (tab as any).updateComplete;

    let focusFired = false;
    tab.addEventListener("nys-tab-focus", () => {
      focusFired = true;
    });

    tab.focus();

    expect(focusFired).to.be.true;
  });
});

describe("nys-tab event handling", () => {
  it("should dispatch nys-tab-focus, nys-tab-select, and nys-tab-blur events", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="Tab One"></nys-tab>
        <nys-tabpanel>Content for Tab One.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tab = el.shadowRoot!.querySelector("nys-tab")!;
    await (tab as any).updateComplete;

    let focusFired = false;
    let selectFired = false;
    let blurFired = false;

    tab.addEventListener("nys-tab-focus", () => {
      focusFired = true;
    });
    tab.addEventListener("nys-tab-select", () => {
      selectFired = true;
    });
    tab.addEventListener("nys-tab-blur", () => {
      blurFired = true;
    });

    tab.dispatchEvent(new Event("focus", { bubbles: true, composed: true }));
    expect(focusFired).to.be.true;

    (tab as any)._handleClick();
    expect(selectFired).to.be.true;

    tab.dispatchEvent(new Event("blur", { bubbles: true, composed: true }));
    expect(blurFired).to.be.true;
  });
});

describe("nys-tab keyboard navigation", () => {
  it("ArrowRight moves focus to the next tab, ArrowLeft moves to previous, both wrap around", async () => {
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
    const focused: string[] = [];
    tabs.forEach((tab: HTMLElement) => {
      tab.focus = () => focused.push(tab.id);
    });

    const fireKey = (key: string, tab: HTMLElement) =>
      (el as any)._handleKeydown({
        key,
        composedPath: () => [tab],
        preventDefault: () => {},
      });

    // ArrowRight: 0 → 1
    fireKey("ArrowRight", tabs[0]);
    expect(focused[focused.length - 1]).to.equal(tabs[1].id);

    // ArrowRight: 1 → 2
    fireKey("ArrowRight", tabs[1]);
    expect(focused[focused.length - 1]).to.equal(tabs[2].id);

    // ArrowRight wraps: 2 → 0
    fireKey("ArrowRight", tabs[2]);
    expect(focused[focused.length - 1]).to.equal(tabs[0].id);

    // ArrowLeft wraps: 0 → 2
    fireKey("ArrowLeft", tabs[0]);
    expect(focused[focused.length - 1]).to.equal(tabs[2].id);

    // ArrowLeft: 2 → 1
    fireKey("ArrowLeft", tabs[2]);
    expect(focused[focused.length - 1]).to.equal(tabs[1].id);
  });

  it("ArrowRight skips disabled tabs", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="Tab One"></nys-tab>
        <nys-tab label="Tab Two" disabled></nys-tab>
        <nys-tab label="Tab Three"></nys-tab>
        <nys-tabpanel>Content for Tab One.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Two.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Three.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tabs = (el as any)._getTabs();
    const focused: string[] = [];
    tabs.forEach((tab: HTMLElement) => {
      tab.focus = () => focused.push(tab.id);
    });

    // Tab Two is disabled so _getTabs filters it out — ArrowRight from Tab One lands on Tab Three
    (el as any)._handleKeydown({
      key: "ArrowRight",
      composedPath: () => [tabs[0]],
      preventDefault: () => {},
    });

    expect(focused[0]).to.equal(tabs[2].id);
    expect(focused).to.not.include(tabs[1].id);
  });

  it("Home moves focus to the first enabled tab, End to the last", async () => {
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
    const focused: string[] = [];
    tabs.forEach((tab: HTMLElement) => {
      tab.focus = () => focused.push(tab.id);
    });

    // End from the first tab → last tab
    (el as any)._handleKeydown({
      key: "End",
      composedPath: () => [tabs[0]],
      preventDefault: () => {},
    });
    expect(focused[focused.length - 1]).to.equal(tabs[2].id);

    // Home from the last tab → first tab
    (el as any)._handleKeydown({
      key: "Home",
      composedPath: () => [tabs[2]],
      preventDefault: () => {},
    });
    expect(focused[focused.length - 1]).to.equal(tabs[0].id);
  });

  it("Home/End skip disabled tabs", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="Tab One" disabled></nys-tab>
        <nys-tab label="Tab Two"></nys-tab>
        <nys-tab label="Tab Three" disabled></nys-tab>
        <nys-tabpanel>Content for Tab One.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Two.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Three.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const enabled = (el as any)
      ._getTabs()
      .filter((t: HTMLElement) => !t.hasAttribute("disabled"));
    const allTabs = (el as any)._getTabs();
    const focused: string[] = [];
    allTabs.forEach((tab: HTMLElement) => {
      tab.focus = () => focused.push(tab.id);
    });

    // Only Tab Two is enabled; Home and End both resolve to it.
    (el as any)._handleKeydown({
      key: "End",
      composedPath: () => [enabled[0]],
      preventDefault: () => {},
    });
    (el as any)._handleKeydown({
      key: "Home",
      composedPath: () => [enabled[0]],
      preventDefault: () => {},
    });
    // No navigation away from the single enabled tab; no disabled id focused.
    expect(focused).to.not.include(allTabs[0].id);
    expect(focused).to.not.include(allTabs[2].id);
  });

  it("calls preventDefault for handled navigation keys", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="Tab One"></nys-tab>
        <nys-tab label="Tab Two"></nys-tab>
        <nys-tabpanel>Content for Tab One.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Two.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tabs = (el as any)._getTabs();
    tabs.forEach((tab: HTMLElement) => {
      tab.focus = () => {};
    });

    for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"]) {
      let prevented = false;
      (el as any)._handleKeydown({
        key,
        composedPath: () => [tabs[0]],
        preventDefault: () => {
          prevented = true;
        },
      });
      expect(prevented, `preventDefault for ${key}`).to.be.true;
    }
  });

  it("does not call preventDefault for unhandled keys", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="Tab One"></nys-tab>
        <nys-tab label="Tab Two"></nys-tab>
        <nys-tabpanel>Content for Tab One.</nys-tabpanel>
        <nys-tabpanel>Content for Tab Two.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tabs = (el as any)._getTabs();
    let prevented = false;
    (el as any)._handleKeydown({
      key: "ArrowUp",
      composedPath: () => [tabs[0]],
      preventDefault: () => {
        prevented = true;
      },
    });
    expect(prevented).to.be.false;
  });

  it("does not listen to up and down arrows", async () => {
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
    const focused: string[] = [];
    tabs.forEach((tab: HTMLElement) => {
      tab.focus = () => focused.push(tab.id);
    });

    // ArrowUp does nothing
    (el as any)._handleKeydown({
      key: "ArrowUp",
      composedPath: () => [tabs[0]],
      preventDefault: () => {},
    });
    expect(focused).to.be.empty;
  });

  it("can be clicked via enter or space", async () => {
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
    const focused: string[] = [];
    tabs.forEach((tab: HTMLElement) => {
      tab.focus = () => focused.push(tab.id);
    });

    // Pressing Enter on Tab should select it
    let selectFired = false;
    tabs[0].addEventListener("nys-tab-select", () => {
      selectFired = true;
    });
    (tabs[0] as any)._onKeydown(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(selectFired).to.be.true;

    // Pressing Space on Tab should select it
    selectFired = false;
    (tabs[0] as any)._onKeydown(new KeyboardEvent("keydown", { key: " " }));
    expect(selectFired).to.be.true;
  });
});

describe("nys-tab a11y", () => {
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

  it("has role=tab on nys-tab and role=tabpanel on nys-tabpanel", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="My Label"></nys-tab>
        <nys-tabpanel>Content for My Label.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tab = el.shadowRoot!.querySelector("nys-tab")!;
    const tabPanel = el.shadowRoot!.querySelector("nys-tabpanel")!;
    expect(tab.getAttribute("role")).to.equal("tab");
    expect(tabPanel.getAttribute("role")).to.equal("tabpanel");
  });

  it("has role=tablist on the tab container", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="My Label"></nys-tab>
        <nys-tabpanel>Content for My Label.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tabContainer = el.shadowRoot!.querySelector(".nys-tabgroup__tabs")!;
    expect(tabContainer.getAttribute("role")).to.equal("tablist");
  });

  it("sets aria-orientation=horizontal on the tablist", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup>
        <nys-tab label="My Label"></nys-tab>
        <nys-tabpanel>Content for My Label.</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tabContainer = el.shadowRoot!.querySelector(".nys-tabgroup__tabs")!;
    expect(tabContainer.getAttribute("aria-orientation")).to.equal(
      "horizontal",
    );
  });

  it("sets aria-labelledby on each panel pointing to its paired tab's id", async () => {
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

    panels.forEach((panel: HTMLElement, i: number) => {
      expect(panel.getAttribute("aria-labelledby")).to.equal(tabs[i].id);
    });
  });

  it("pairs panels with tabs via explicit aria-labelledby references, ignoring DOM order", async () => {
    const el = await fixture<NysTabgroup>(html`
      <nys-tabgroup id="explicit-ordering">
        <nys-tab label="1st Tab" id="tab-1"></nys-tab>
        <nys-tab label="2nd Tab" id="tab-2"></nys-tab>
        <nys-tab label="3rd Tab" id="tab-3"></nys-tab>
        <nys-tabpanel aria-labelledby="tab-2">Content for tab 2</nys-tabpanel>
        <nys-tabpanel aria-labelledby="tab-3">Content for tab 3</nys-tabpanel>
        <nys-tabpanel aria-labelledby="tab-1">Content for tab 1</nys-tabpanel>
      </nys-tabgroup>
    `);
    await el.updateComplete;

    const tabs = (el as any)._getTabs();
    const panels = (el as any)._getPanels();

    expect(tabs[0].id).to.equal("tab-1");
    expect(tabs[1].id).to.equal("tab-2");
    expect(tabs[2].id).to.equal("tab-3");

    expect(panels[0].textContent?.trim()).to.equal("Content for tab 1");
    expect(panels[1].textContent?.trim()).to.equal("Content for tab 2");
    expect(panels[2].textContent?.trim()).to.equal("Content for tab 3");

    expect(panels[0].getAttribute("aria-labelledby")).to.equal("tab-1");
    expect(panels[1].getAttribute("aria-labelledby")).to.equal("tab-2");
    expect(panels[2].getAttribute("aria-labelledby")).to.equal("tab-3");
  });
});
