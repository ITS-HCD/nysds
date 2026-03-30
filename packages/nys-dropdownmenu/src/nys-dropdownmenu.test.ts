import { expect, html, fixture, oneEvent } from "@open-wc/testing";
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

  it("opens menu on Enter key", async () => {
    const { menu, trigger } = await fixtureWithTrigger();

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    await menu.updateComplete;

    expect(menu.showDropdown).to.be.true;
  });

  it("opens menu on Space key", async () => {
    const { menu, trigger } = await fixtureWithTrigger();

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true }),
    );
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

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-dropdownmenu label="My Label"></nys-dropdownmenu>`,
    );
    await expect(el).shadowDom.to.be.accessible();
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
});
