import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-table.js";
import { NysTable } from "./nys-table.js";

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
    const caption = el.shadowRoot?.querySelector("caption");
    expect(caption).to.be.null;
  });

  it("generates a unique ID if none is provided", async () => {
    const el = await fixture<NysTable>(html`<nys-table></nys-table>`);
    expect(el.id).to.match(/^nys-table-\d+-\d+$/);
  });

  it("normalizes a slotted table", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table>
        <table>
          <caption>
            Sample Table
          </caption>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </table>
      </nys-table>
    `);

    const table = el.shadowRoot?.querySelector("table");
    expect(table).to.exist;
    const thead = table?.querySelector("thead");
    expect(thead).to.exist;
    const tbody = table?.querySelector("tbody");
    expect(tbody).to.exist;
    const caption = table?.querySelector("caption");
    expect(caption?.textContent.trim()).to.equal("Sample Table");
    const headerCells = thead?.querySelectorAll("th");
    expect(headerCells?.length).to.equal(2);
    const bodyRows = tbody?.querySelectorAll("tr");
    expect(bodyRows?.length).to.equal(1);
  });

  it("injects a download button when download attribute is set", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table id="test-table" download="data.csv">
        <table></table>
      </nys-table>
    `);
    const button = el.shadowRoot?.getElementById("test-table-download-button");
    expect(button).to.exist;
    expect(el.download).to.equal("data.csv");
  });

  it("adds sort icons to sortable tables", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table sortable>
        <table>
          <th>col 1</th>
          <th>col 2</th>
          <tr>
            <td>data 1</td>
            <td>data 2</td>
          </tr>
          <tr>
            <td>data 3</td>
            <td>data 4</td>
          </tr>
        </table>
      </nys-table>
    `);
    const table = el.shadowRoot?.querySelector("table");
    const firstTh = table?.querySelector("th");
    const sortIcons = firstTh?.querySelectorAll("nys-icon");
    expect(sortIcons?.length).to.be.greaterThan(0);
  });

  it("sorts the table when a sortable header is clicked", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table sortable>
        <table>
          <th>col 1</th>
          <th>col 2</th>
          <tr>
            <td>B</td>
            <td>2</td>
          </tr>
          <tr>
            <td>C</td>
            <td>1</td>
          </tr>
          <tr>
            <td>A</td>
            <td>3</td>
          </tr>
        </table>
      </nys-table>
    `);
    const table = el.shadowRoot?.querySelector("table");
    const firstTh = table?.querySelector("th");
    expect(firstTh).to.exist;

    // Initial order check
    let firstRowFirstCell = table
      ?.querySelectorAll("tbody tr")[0]
      .querySelectorAll("td")[0];
    expect(firstRowFirstCell?.textContent).to.equal("B");

    // Click to sort ascending
    firstTh?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    firstRowFirstCell = table
      ?.querySelectorAll("tbody tr")[0]
      .querySelectorAll("td")[0];
    expect(firstRowFirstCell?.textContent).to.equal("A");

    // Click to sort descending
    firstTh?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    firstRowFirstCell = table
      ?.querySelectorAll("tbody tr")[0]
      .querySelectorAll("td")[0];
    expect(firstRowFirstCell?.textContent).to.equal("C");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-table label="My Label"></nys-table>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
