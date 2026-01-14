import { expect, html, fixture } from "@open-wc/testing";
import { NysUnavHeader } from "./nys-unavheader";
import "../dist/nys-unavheader.js";
import sinon from "sinon";

describe("nys-unavheader", () => {
  it("should render with NYS logo link", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );
    const logoLink = el.shadowRoot?.getElementById(
      "nys-unavheader__logolink",
    ) as HTMLAnchorElement;
    expect(logoLink).to.exist;
    expect(logoLink?.getAttribute("href")).to.equal("https://www.ny.gov");
    expect(logoLink?.getAttribute("aria-label")).to.equal(
      "Visit the NY.gov homepage",
    );
  });

  it("toggles trustbar visibility when clicking the top trustbar", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const trustbarToggle = el.shadowRoot?.querySelector(
      ".nys-unavheader__trustbar.wrapper",
    ) as HTMLElement;

    expect(trustbarToggle).to.exist;
    expect(el.trustbarVisible).to.be.false;

    trustbarToggle.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el.trustbarVisible).to.be.true;

    trustbarToggle.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el.trustbarVisible).to.be.false;
  });

  it("toggles language list when 'nys-click' event dispatched on translate button", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const translateButton = el.shadowRoot?.querySelector(
      "#nys-unavheader__translate--desktop",
    ) as HTMLElement;

    const langList = el.shadowRoot?.querySelector(
      ".nys-unavheader__languagelist",
    ) as HTMLElement;

    expect(translateButton).to.exist;
    expect(langList).to.exist;

    translateButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(langList.classList.contains("show")).to.be.true;
    expect(langList.classList.contains("hide")).to.be.false;

    translateButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(langList.classList.contains("hide")).to.be.true;
    expect(langList.classList.contains("show")).to.be.false;
  });

  it("toggles search dropdown when 'nys-click' event dispatched on search button", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const searchButton = el.shadowRoot?.querySelector(
      "#nys-unavheader__searchbutton",
    ) as HTMLElement;

    const searchDropdown = el.shadowRoot?.querySelector(
      ".nys-unavheader__searchdropdown",
    ) as HTMLElement;

    expect(searchButton).to.exist;
    expect(searchDropdown).to.exist;

    searchButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(searchDropdown.classList.contains("show")).to.be.true;
    expect(searchDropdown.classList.contains("hide")).to.be.false;

    searchButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(searchDropdown.classList.contains("hide")).to.be.true;
    expect(searchDropdown.classList.contains("show")).to.be.false;
  });

  it("handles search focus and blur correctly", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    el.trustbarVisible = true;
    el.languageVisible = true;
    await el.updateComplete;

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    expect(searchBar).to.exist;

    // Focus
    searchBar.dispatchEvent(
      new FocusEvent("focus", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(el.isSearchFocused).to.be.true;
    expect(el.trustbarVisible).to.be.false;
    expect(el.languageVisible).to.be.false;

    // Blur
    searchBar.dispatchEvent(
      new FocusEvent("blur", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(el.isSearchFocused).to.be.false;
  });

  it("blurs search input and clears focus on Escape key", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    el.isSearchFocused = true;
    await el.updateComplete;

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement & { blur: () => void };

    expect(searchBar).to.exist;

    const blurSpy = sinon.spy(searchBar, "blur");

    searchBar.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Escape",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;

    expect(blurSpy.calledOnce).to.be.true;
    expect(el.isSearchFocused).to.be.false;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-unavheader></nys-unavheader>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
