import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
import "../dist/nys-dropdownmenu.js";
import { NysDropdownMenu } from "./nys-dropdownmenu";
import { NysDropdownMenuItem } from "./nys-dropdownmenuitem";

// ----------- nys-dropdownmenu -----------

describe("nys-dropdownmenu", () => {
  async function fixtureWithTrigger() {
    const el = await fixture(html`
      <div>
        <nys-button id="my-trigger-id" label="trigger"> Open Menu </nys-button>

        <nys-dropdownmenu id="my-dropdownmenu" for="my-trigger-id">
          <nys-dropdownmenuitem
            label="Profile"
            href="/profile"
          ></nys-dropdownmenuitem>
          <nys-dropdownmenuitem
            label="Repositories"
            href="/repos"
          ></nys-dropdownmenuitem>
          <nys-dropdownmenuitem
            label="Organizations"
            href="/organizations"
          ></nys-dropdownmenuitem>
          <nys-dropdownmenuitem
            label="Sign out"
            href="/logout"
            disabled
          ></nys-dropdownmenuitem>
        </nys-dropdownmenu>
      </div>
    `);

    const menu = el.querySelector<NysDropdownMenu>("nys-dropdownmenu")!;
    const trigger = el.querySelector("nys-button") as HTMLElement;
    await menu.updateComplete;

    return { el, menu, trigger };
  }

  it("renders the component", async () => {
    const el = await fixture(html`<nys-dropdownmenu></nys-dropdownmenu>`);
    expect(el).to.exist;
  });

  it("applies default position bottom-end when no position specified", async () => {
    const { menu, trigger } = await fixtureWithTrigger();

    trigger.click();
    await menu.updateComplete;

    const menuDiv = menu.shadowRoot!.querySelector(
      ".nys-dropdownmenu",
    ) as HTMLElement;
    expect(menuDiv).to.exist;
    expect(menuDiv.style.top).to.not.equal("");
    expect(menuDiv.style.left).to.not.equal("");
  });

  it("position property reflects to attribute", async () => {
    const el = await fixture<NysDropdownMenu>(html`
      <nys-dropdownmenu
        for="my-trigger"
        position="top-start"
      ></nys-dropdownmenu>
    `);
    await el.updateComplete;
    expect(el.position).to.equal("top-start");
    expect(el.getAttribute("position")).to.equal("top-start");
  });

  it("is hidden by default", async () => {
    const { menu } = await fixtureWithTrigger();
    expect(menu.showDropdown).to.be.false;

    const menuDiv = menu.shadowRoot!.querySelector(".nys-dropdownmenu");
    expect(menuDiv?.classList.contains("active")).to.be.false;
  });

  it("open on trigger click", async () => {
    const { menu, trigger } = await fixtureWithTrigger();
    expect(menu.showDropdown).to.be.false;

    trigger.click();
    await menu.updateComplete;
    expect(menu.showDropdown).to.be.true;
  });

  it("closes on second trigger click", async () => {
    const { menu, trigger } = await fixtureWithTrigger();
    expect(menu.showDropdown).to.be.false;

    trigger.click();
    await menu.updateComplete;
    trigger.click();
    await menu.updateComplete;
    expect(menu.showDropdown).to.be.false;
  });

  /****** Regression: keyboard activation should only call toggle dropdown once (Dropdown is not "hidden") ******/
  it("opens only once when trigger is activated via Enter", async () => {
    const { menu, trigger } = await fixtureWithTrigger();

    expect(menu.showDropdown).to.be.false;

    // Due to how the button when "Enter|Space" calls the "click" listener, we can't listen to an actual dispatch "Enter|Space" event
    trigger.click();
    await menu.updateComplete;

    expect(menu.showDropdown).to.be.true;
  });

  /****** A11y ******/
  it("sets aria-expanded=true on trigger when opened", async () => {
    const { menu, trigger } = await fixtureWithTrigger();

    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    trigger.click();
    await menu.updateComplete;
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
  });

  it("sets aria-haspopup on the trigger host", async () => {
    const { trigger } = await fixtureWithTrigger();
    expect(trigger.getAttribute("aria-haspopup")).to.equal("menu");
  });

  it("closes and restores focus on Escape keydown", async () => {
    const { menu, trigger } = await fixtureWithTrigger();
    trigger.click();
    await menu.updateComplete;
    expect(menu.showDropdown).to.be.true;

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await menu.updateComplete;
    expect(menu.showDropdown).to.be.false;
  });

  /****** Close behavior and cleanup ******/
  // These tests use a native <button> trigger. The nys-button in
  // fixtureWithTrigger() is never registered here, so it can't take focus.
  async function fixtureWithNativeTrigger() {
    const el = await fixture(html`
      <div>
        <button id="native-trigger">Open</button>
        <nys-dropdownmenu for="native-trigger">
          <nys-dropdownmenuitem
            label="Profile"
            href="/profile"
          ></nys-dropdownmenuitem>
        </nys-dropdownmenu>
        <input id="elsewhere" />
      </div>
    `);
    const menu = el.querySelector<NysDropdownMenu>("nys-dropdownmenu")!;
    await menu.updateComplete;
    // The trigger is wired after the menu's first update completes.
    await menu.updateComplete;
    const trigger = el.querySelector<HTMLButtonElement>("#native-trigger")!;
    const elsewhere = el.querySelector<HTMLInputElement>("#elsewhere")!;
    return { el, menu, trigger, elsewhere };
  }

  it("leaves focus where an outside click put it", async () => {
    const { menu, trigger, elsewhere } = await fixtureWithNativeTrigger();

    trigger.click();
    await menu.updateComplete;
    await new Promise((r) => requestAnimationFrame(r)); // let _focusOnItem run
    expect(menu.showDropdown).to.be.true;

    elsewhere.focus(); // a real click focuses on mousedown, before click fires
    elsewhere.click();
    await menu.updateComplete;

    expect(menu.showDropdown).to.be.false;
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(document.activeElement).to.equal(elsewhere);
  });

  it("restores focus to the trigger on Escape", async () => {
    const { menu, trigger } = await fixtureWithNativeTrigger();

    trigger.click();
    await menu.updateComplete;
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await menu.updateComplete;

    expect(menu.showDropdown).to.be.false;
    expect(document.activeElement).to.equal(trigger);
  });

  it("keeps one live observer and no document listener after close and reopen", async () => {
    const { menu, trigger, elsewhere } = await fixtureWithNativeTrigger();

    const RealResizeObserver = window.ResizeObserver;
    let created = 0;
    let live = 0;
    window.ResizeObserver = class extends RealResizeObserver {
      constructor(cb: ResizeObserverCallback) {
        super(cb);
        created++;
        live++;
      }
      disconnect() {
        live--;
        super.disconnect();
      }
    };

    const realAdd = document.addEventListener;
    const realRemove = document.removeEventListener;
    let clickListeners = 0;
    document.addEventListener = function (type: string, ...rest: any[]) {
      if (type === "click") clickListeners++;
      return (realAdd as any).call(this, type, ...rest);
    } as typeof document.addEventListener;
    document.removeEventListener = function (type: string, ...rest: any[]) {
      if (type === "click") clickListeners--;
      return (realRemove as any).call(this, type, ...rest);
    } as typeof document.removeEventListener;

    try {
      trigger.click();
      await menu.updateComplete;
      elsewhere.click(); // outside click closes the menu
      await menu.updateComplete;

      expect(live).to.equal(0);
      expect(clickListeners).to.equal(0);
      expect((menu as any)._resizeObserver).to.be.null;

      trigger.click(); // reopen
      await menu.updateComplete;

      expect(created).to.equal(2);
      expect(live).to.equal(1);
      expect(clickListeners).to.equal(1);

      elsewhere.click();
      await menu.updateComplete;
      expect(live).to.equal(0);
      expect(clickListeners).to.equal(0);
    } finally {
      window.ResizeObserver = RealResizeObserver;
      document.addEventListener = realAdd;
      document.removeEventListener = realRemove;
    }
  });

  it("releases the open-state listeners when the menu is removed while open", async () => {
    const { menu, trigger } = await fixtureWithNativeTrigger();

    trigger.click();
    await menu.updateComplete;
    expect((menu as any)._resizeObserver).to.exist;

    menu.remove();

    expect((menu as any)._resizeObserver).to.be.null;
    expect(menu.showDropdown).to.be.false;
  });

  it("unwires the trigger when the menu is removed from the page", async () => {
    const { menu, trigger } = await fixtureWithNativeTrigger();
    menu.remove();

    trigger.click();

    expect(trigger.hasAttribute("aria-expanded")).to.be.false;
    expect(trigger.hasAttribute("aria-haspopup")).to.be.false;
  });

  it("wires the trigger again after the menu is moved", async () => {
    const { el, menu, trigger } = await fixtureWithNativeTrigger();
    el.appendChild(menu); // a move: disconnectedCallback, then connectedCallback
    await menu.updateComplete;
    await menu.updateComplete;

    trigger.click();
    await menu.updateComplete;
    expect(menu.showDropdown).to.be.true;
  });

  it("_findMostAvailableSpace returns bottom-start when bottom > top and start >= end", async () => {
    const { menu } = await fixtureWithTrigger();
    const result = (menu as any)._findMostAvailableSpace({
      top: 100,
      bottom: 300,
      start: 400,
      end: 200,
    });
    expect(result).to.equal("bottom-start");
  });

  it("_findMostAvailableSpace returns bottom-end when bottom > top and end > start", async () => {
    const { menu } = await fixtureWithTrigger();
    const result = (menu as any)._findMostAvailableSpace({
      top: 100,
      bottom: 300,
      start: 200,
      end: 400,
    });
    expect(result).to.equal("bottom-end");
  });

  it("_findMostAvailableSpace returns top-start when top > bottom and start >= end", async () => {
    const { menu } = await fixtureWithTrigger();
    const result = (menu as any)._findMostAvailableSpace({
      top: 300,
      bottom: 100,
      start: 400,
      end: 200,
    });
    expect(result).to.equal("top-start");
  });

  it("_findMostAvailableSpace returns top-end when top > bottom and end > start", async () => {
    const { menu } = await fixtureWithTrigger();
    const result = (menu as any)._findMostAvailableSpace({
      top: 300,
      bottom: 100,
      start: 200,
      end: 400,
    });
    expect(result).to.equal("top-end");
  });

  it("has aria-label on the menu element by default", async () => {
    const { menu } = await fixtureWithTrigger();

    const ul = menu.shadowRoot!.querySelector("ul[role='menu']")!;
    expect(ul.getAttribute("aria-label")).to.not.be.empty;
  });

  it("sets aria-label to the provided label value", async () => {
    const el = await fixture<NysDropdownMenu>(
      html`<nys-dropdownmenu label="User actions"></nys-dropdownmenu>`,
    );
    await el.updateComplete;

    const ul = el.shadowRoot!.querySelector("ul[role='menu']")!;
    expect(ul.getAttribute("aria-label")).to.equal("User actions");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-dropdownmenu label="My Label"></nys-dropdownmenu>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("menu (role=menu) has a default accessible name", async () => {
    const el = await fixture<NysDropdownMenu>(
      html`<nys-dropdownmenu></nys-dropdownmenu>`,
    );
    await el.updateComplete;
    const menu = el.shadowRoot!.querySelector('[role="menu"]')!;
    expect(menu.getAttribute("aria-label")).to.equal("Menu");
  });

  it("menu (role=menu) reflects a custom label as its accessible name", async () => {
    const el = await fixture<NysDropdownMenu>(
      html`<nys-dropdownmenu label="Account actions"></nys-dropdownmenu>`,
    );
    await el.updateComplete;
    const menu = el.shadowRoot!.querySelector('[role="menu"]')!;
    expect(menu.getAttribute("aria-label")).to.equal("Account actions");
  });

  it("auto-generates an id when none is provided", async () => {
    const el = await fixture<NysDropdownMenu>(
      html`<nys-dropdownmenu></nys-dropdownmenu>`,
    );
    await el.updateComplete;
    expect(el.id).to.match(/^nys-dropdownmenu-\d+-\d+$/);
  });

  it("preserves a consumer-provided id", async () => {
    const el = await fixture<NysDropdownMenu>(
      html`<nys-dropdownmenu id="custom-menu-id"></nys-dropdownmenu>`,
    );
    await el.updateComplete;
    expect(el.id).to.equal("custom-menu-id");
  });
});

// ----------- nys-dropdownmenuitem -----------

describe("nys-dropdownmenuitem", () => {
  it("sets href from link property", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Edit" href="/edit"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    const link = el.shadowRoot!.querySelector("a");
    expect(link?.getAttribute("href")).to.equal("/edit");
  });

  it("sets aria-disabled=true when disabled", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem
        label="Delete"
        href="/delete"
        disabled
      ></nys-dropdownmenuitem>
    `);
    await el.updateComplete;
    const href = el.shadowRoot!.querySelector("a");
    expect(href?.getAttribute("aria-disabled")).to.equal("true");
  });

  it("sets aria-disabled=false when not disabled", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Edit" href="/edit"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;
    const href = el.shadowRoot!.querySelector("a");
    expect(href?.getAttribute("aria-disabled")).to.equal("false");
  });

  it("dispatches nys-click event on click with correct detail", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Edit" href="/edit"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    const anchor = el.shadowRoot!.querySelector("a")!;
    anchor.addEventListener("click", (e) => e.preventDefault());

    const listener = oneEvent(el, "nys-click");
    anchor.click();
    const { detail } = await listener;

    expect(detail.label).to.equal("Edit");
    expect(detail.href).to.equal("/edit");
  });

  it("renders a <button> instead of <a> when no href is provided", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Action"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector("button")).to.exist;
    expect(el.shadowRoot!.querySelector("a")).to.not.exist;
  });

  it("button renders label text", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Submit"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    const btn = el.shadowRoot!.querySelector("button")!;
    expect(btn.textContent?.trim()).to.include("Submit");
  });

  it("button has aria-disabled=true and tabindex=-1 when disabled", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Action" disabled></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    const btn = el.shadowRoot!.querySelector("button")!;
    expect(btn.getAttribute("aria-disabled")).to.equal("true");
    expect(btn.getAttribute("tabindex")).to.equal("-1");
    expect(btn.disabled).to.be.true;
  });

  it("button has aria-disabled=false and tabindex=0 when not disabled", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Action"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    const btn = el.shadowRoot!.querySelector("button")!;
    expect(btn.getAttribute("aria-disabled")).to.equal("false");
    expect(btn.getAttribute("tabindex")).to.equal("0");
  });

  it("button renders prefixIcon when set", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem
        label="Edit"
        prefixIcon="edit"
      ></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    const icon = el.shadowRoot!.querySelector("button nys-icon");
    expect(icon).to.exist;
    expect(icon!.getAttribute("name")).to.equal("edit");
  });

  it("button does not render nys-icon when prefixIcon is not set", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Action"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector("button nys-icon")).to.not.exist;
  });

  it("disabled button does not fire nys-click", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Action" disabled></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    let fired = false;
    el.addEventListener("nys-click", () => (fired = true));

    const btn = el.shadowRoot!.querySelector("button")!;
    btn.click();
    await el.updateComplete;

    expect(fired).to.be.false;
  });

  it("button fires nys-click with label in detail and no href property", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Action"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    const listener = oneEvent(el, "nys-click");
    el.shadowRoot!.querySelector("button")!.click();
    const { detail } = await listener;

    expect(detail.label).to.equal("Action");
    expect(detail.href).to.be.undefined;
  });

  it("auto-generates an id when none is provided", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Action"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;
    expect(el.id).to.match(/^nys-dropdownmenuitem-\d+-\d+$/);
  });

  it("preserves a consumer-provided id", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem
        id="custom-item-id"
        label="Action"
      ></nys-dropdownmenuitem>
    `);
    await el.updateComplete;
    expect(el.id).to.equal("custom-item-id");
  });

  it("registers every nys-* element it renders", async () => {
    const el = await fixture<NysDropdownMenuItem>(
      html`<nys-dropdownmenuitem
        label="Action"
        prefixIcon="check"
      ></nys-dropdownmenuitem>`,
    );
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });

  it("renders prefixIcon and suffixIcon on a button", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem
        label="Docs"
        prefixIcon="description"
        suffixIcon="open_in_new"
      ></nys-dropdownmenuitem>
    `);
    const icons = el.shadowRoot!.querySelectorAll("button nys-icon");
    expect(icons[0].getAttribute("name")).to.equal("description");
    expect(icons[1].getAttribute("name")).to.equal("open_in_new");
  });

  it("renders prefixIcon and suffixIcon on a link", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem
        label="Docs"
        href="/docs"
        prefixIcon="description"
        suffixIcon="open_in_new"
      ></nys-dropdownmenuitem>
    `);
    const icons = el.shadowRoot!.querySelectorAll("a nys-icon");
    expect(icons[0].getAttribute("name")).to.equal("description");
    expect(icons[1].getAttribute("name")).to.equal("open_in_new");
  });
});
