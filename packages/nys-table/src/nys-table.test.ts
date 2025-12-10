import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-table.js";
import { NysTable } from "./nys-table.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-table", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-table></nys-table>`);
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table
        id="table1"
        name="My Table"
        striped
        sortable
        bordered
        download="data.csv"
      ></nys-table>
    `);
    expect(el.id).to.equal("table1");
    expect(el.name).to.equal("My Table");
    expect(el.striped).to.be.true;
    expect(el.sortable).to.be.true;
    expect(el.bordered).to.be.true;
    expect(el.download).to.equal("data.csv");
  });

  it("generates a unique ID if none is provided", async () => {
    const el = await fixture<NysTable>(html`<nys-table></nys-table>`);
    expect(el.id).to.match(/^nys-table-\d+-\d+$/);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-table label="My Label"></nys-table>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  // Other test to consider:
  // - Test for default values
  // - Test for different attributes
  // - Test for events
  // - Test for methods
  // - Test for accessibility
  // - Test for slot content
  // - Test for lifecycle methods
});
