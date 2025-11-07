import { expect, html, fixture } from "@open-wc/testing";
import { NysUnavHeader } from "./nys-unavheader";
import "../dist/nys-unavheader.js";

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
});

it("toggles trustbar visibility when clicking the top trustbar", async () => {
  const el = await fixture<NysUnavHeader>(
    html`<nys-unavheader></nys-unavheader>`,
  );
  const trustbarToggle = el.shadowRoot?.querySelector(
    ".nys-unavheader__trustbar.wrapper",
  )!;
  expect(el.trustbarVisible).to.be.false;

  trustbarToggle.dispatchEvent(new MouseEvent("click"));
  expect(el.trustbarVisible).to.be.true;

  trustbarToggle.dispatchEvent(new MouseEvent("click"));
  expect(el.trustbarVisible).to.be.false;
});

it("toggles language list when 'nys-click' event dispatched on translate button", async () => {
  const el = await fixture<NysUnavHeader>(
    html`<nys-unavheader></nys-unavheader>`,
  );
  el.languageVisible = true;
  await el.updateComplete;
  const langList = el.shadowRoot?.querySelector(
    ".nys-unavheader__languagelist",
  );
  expect(langList).to.exist;
  expect(langList?.classList.contains("show")).to.be.true;
  expect(langList?.classList.contains("hide")).to.be.false;

  el.languageVisible = false;
  await el.updateComplete;
  expect(langList?.classList.contains("hide")).to.be.true;
  expect(langList?.classList.contains("show")).to.be.false;
});

it("passes the a11y audit", async () => {
  const el = await fixture(html`<nys-unavheader></nys-unavheader>`);
  await expect(el).shadowDom.to.be.accessible();
});
