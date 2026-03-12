import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-table.js";
import { NysTable } from "./nys-table.js";

describe("nys-table", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-table></nys-table>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysTable>(html`<nys-table></nys-table>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-table-\d+-\d+$/);
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
        <table>
          <caption>
            Caption Table
          </caption>
        </table>
      </nys-table>
    `);
    const button = el.shadowRoot?.getElementById("test-table-download-button");
    expect(button).to.exist;
    expect(el.download).to.equal("data.csv");
    expect(button?.ariaLabel).to.equal("Download Caption Table");
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

  it("sorts the table when a sortable header button is clicked", async () => {
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
    const firstButton = table?.querySelector("th nys-button");
    expect(firstButton).to.exist;

    // Initial order check
    let firstRowFirstCell = table
      ?.querySelectorAll("tbody tr")[0]
      .querySelectorAll("td")[0];
    expect(firstRowFirstCell?.textContent).to.equal("B");

    // Click to sort ascending
    firstButton?.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    firstRowFirstCell = table
      ?.querySelectorAll("tbody tr")[0]
      .querySelectorAll("td")[0];
    expect(firstRowFirstCell?.textContent).to.equal("A");

    // Click to sort descending
    firstButton?.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    firstRowFirstCell = table
      ?.querySelectorAll("tbody tr")[0]
      .querySelectorAll("td")[0];
    expect(firstRowFirstCell?.textContent).to.equal("C");
  });

  it("appends the sortable comment to the caption", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table sortable>
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
    const caption = table?.querySelector("caption");
    const commentSpan = caption?.querySelector("span");

    expect(commentSpan).to.exist;
    expect(commentSpan?.textContent).to.equal(
      "Column headers with buttons are sortable.",
    );
  });

  it("creates the sortable comment if no caption", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table sortable>
        <table>
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
    const caption = table?.querySelector("caption");
    const commentSpan = caption?.querySelector("span");

    expect(commentSpan).to.exist;
    expect(commentSpan?.textContent).to.equal(
      "Column headers with buttons are sortable.",
    );
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-table label="My Label"></nys-table>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("dispatches nys-column-sort with correct detail on first click (asc)", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table sortable>
        <table>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
          <tr>
            <td>Alice</td>
            <td>30</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>25</td>
          </tr>
        </table>
      </nys-table>
    `);

    const table = el.shadowRoot?.querySelector("table");
    const firstButton = table?.querySelector("th nys-button");
    expect(firstButton).to.exist;

    let firedEvent: CustomEvent | null = null;
    el.addEventListener("nys-column-sort", (e) => {
      firedEvent = e as CustomEvent;
    });

    firstButton?.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(firedEvent).to.exist;
    expect(firedEvent!.detail.columnIndex).to.equal(0);
    expect(firedEvent!.detail.columnLabel).to.equal("Name");
    expect(firedEvent!.detail.sortDirection).to.equal("asc");
  });

  it("dispatches nys-column-sort with sortDirection 'desc' on second click of same column", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table sortable>
        <table>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
          <tr>
            <td>Alice</td>
            <td>30</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>25</td>
          </tr>
        </table>
      </nys-table>
    `);

    const table = el.shadowRoot?.querySelector("table");
    const firstButton = table?.querySelector("th nys-button");

    const events: CustomEvent[] = [];
    el.addEventListener("nys-column-sort", (e) => {
      events.push(e as CustomEvent);
    });

    // First click → asc
    firstButton?.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    // Second click → desc
    firstButton?.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(events.length).to.equal(2);
    expect(events[1].detail.sortDirection).to.equal("desc");
    expect(events[1].detail.columnIndex).to.equal(0);
    expect(events[1].detail.columnLabel).to.equal("Name");
  });

  it("dispatches only one nys-column-sort event when switching to a new column", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table sortable>
        <table>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
          <tr>
            <td>Alice</td>
            <td>30</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>25</td>
          </tr>
        </table>
      </nys-table>
    `);

    const table = el.shadowRoot?.querySelector("table");
    const buttons = table?.querySelectorAll("th nys-button");
    const firstButton = buttons?.[0];
    const secondButton = buttons?.[1];

    const events: CustomEvent[] = [];
    el.addEventListener("nys-column-sort", (e) => {
      events.push(e as CustomEvent);
    });

    // Sort first column
    firstButton?.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    // Switch to second column — should only fire one event (not two)
    secondButton?.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(events.length).to.equal(2);
    expect(events[1].detail.columnIndex).to.equal(1);
    expect(events[1].detail.columnLabel).to.equal("Age");
    expect(events[1].detail.sortDirection).to.equal("asc");
  });

  it("does not sort when preventDefault is called on nys-column-sort", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table sortable>
        <table>
          <tr>
            <th>Name</th>
          </tr>
          <tr>
            <td>B</td>
          </tr>
          <tr>
            <td>A</td>
          </tr>
        </table>
      </nys-table>
    `);

    const table = el.shadowRoot?.querySelector("table");
    const firstButton = table?.querySelector("th nys-button");

    el.addEventListener("nys-column-sort", (e) => {
      e.preventDefault();
    });

    firstButton?.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    // Row order should be unchanged since sort was prevented
    const firstRowCell = table
      ?.querySelectorAll("tbody tr")[0]
      .querySelectorAll("td")[0];
    expect(firstRowCell?.textContent).to.equal("B");
  });
});
