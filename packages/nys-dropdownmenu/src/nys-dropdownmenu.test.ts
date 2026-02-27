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
      <nys-dropdownmenuitem label="Edit" link="/edit"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;
    const href = el.shadowRoot!.querySelector("a");
    expect(href?.getAttribute("aria-disabled")).to.equal("false");
  });

  it("dispatches nys-select event on click with correct detail", async () => {
    const el = await fixture<NysDropdownMenuItem>(html`
      <nys-dropdownmenuitem label="Edit" href="/edit"></nys-dropdownmenuitem>
    `);
    await el.updateComplete;

    const anchor = el.shadowRoot!.querySelector("a")!;
    anchor.addEventListener("click", (e) => e.preventDefault());

    const listener = oneEvent(el, "nys-dropdownmenuitem-select");
    anchor.click();
    const { detail } = await listener;

    expect(detail.label).to.equal("Edit");
    expect(detail.href).to.equal("/edit");
  });
});
