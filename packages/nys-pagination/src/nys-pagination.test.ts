import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-pagination.js";
import { NysPagination } from "./nys-pagination.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-pagination", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-pagination></nys-pagination>`);
    expect(el).to.exist;
  });

  it("has correct default values", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination></nys-pagination>`,
    );
    expect(el.currentPage).to.equal(1);
    expect(el.totalPages).to.equal(1);
  });

  it("has correct passed in values", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="4" totalPages="10"></nys-pagination>`,
    );
    expect(el.currentPage).to.equal(4);
    expect(el.totalPages).to.equal(10);
  });

  it("clamps currentPage between 1 and totalPages", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination totalPages="5"></nys-pagination>`,
    );
    el.currentPage = -10;
    await el.updateComplete;
    expect(el.currentPage).to.equal(1);

    el.currentPage = 999;
    await el.updateComplete;
    expect(el.currentPage).to.equal(5);
  });

  it("ensures totalPages is at least 1", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination totalPages="0" currentPage="1"></nys-pagination>`,
    );
    expect(el.totalPages).to.equal(1);
  });

  it("disables Previous button on first page", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="1" totalPages="5"></nys-pagination>`,
    );
    const prev = el.shadowRoot!.querySelector("#previous");
    expect(prev).to.have.attribute("disabled");
  });

  it("disables Next button on last page", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="5" totalPages="5"></nys-pagination>`,
    );
    const next = el.shadowRoot!.querySelector("#next");
    expect(next).to.have.attribute("disabled");
  });

  it("renders page buttons with current page filled", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="2" totalPages="3"></nys-pagination>`,
    );
    const btns = el.shadowRoot!.querySelectorAll("nys-button");
    expect(Array.from(btns).some((b) => b.getAttribute("variant") === "filled"))
      .to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-pagination></nys-pagination>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
