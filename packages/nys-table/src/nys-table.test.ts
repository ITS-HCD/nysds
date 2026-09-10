import { expect, html, fixture } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
import "../dist/nys-table.js";
import { NysTable } from "./nys-table.js";
import "@nysds/nys-icon";
import "@nysds/nys-button";
import sinon from "sinon";
// nys-table's self-registration of these two is fixed on
// fix/a11y-arialabel-sweep (not this branch) — kept here so the
// self-registration test below is meaningful on this branch standalone. Safe
// to drop once that branch merges and nys-table.ts imports them itself.
import "@nysds/nys-button";
import "@nysds/nys-icon";

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

  it("auto-generates an id in the <tag>-<ts>-<n> format", async () => {
    const el = await fixture<NysTable>(html`<nys-table></nys-table>`);
    await el.updateComplete;
    expect(el.id).to.match(/^nys-table-\d+-\d+$/);
  });

  it("adds scope='col' to normalized column header cells (WCAG 1.3.1)", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table>
        <table>
          <caption>
            Scope Table
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
    await el.updateComplete;

    const headerCells = el.querySelector("table")?.querySelectorAll("thead th");
    expect(headerCells?.length).to.equal(2);
    headerCells?.forEach((th) => {
      expect(th.getAttribute("scope")).to.equal("col");
    });
  });

  it("adds scope='col' to pre-structured thead header cells (WCAG 1.3.1)", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table>
        <table>
          <caption>
            Structured Table
          </caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>30</td>
            </tr>
          </tbody>
        </table>
      </nys-table>
    `);
    await el.updateComplete;

    const headerCells = el.querySelector("table")?.querySelectorAll("thead th");
    expect(headerCells?.length).to.equal(2);
    headerCells?.forEach((th) => {
      expect(th.getAttribute("scope")).to.equal("col");
    });
  });

  it("preserves an author-provided scope on header cells (WCAG 1.3.1)", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table>
        <table>
          <thead>
            <tr>
              <th scope="colgroup">Group</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>30</td>
            </tr>
          </tbody>
        </table>
      </nys-table>
    `);
    await el.updateComplete;

    const headerCells = el.querySelector("table")?.querySelectorAll("thead th");
    expect(headerCells?.[0].getAttribute("scope")).to.equal("colgroup");
    expect(headerCells?.[1].getAttribute("scope")).to.equal("col");
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

    const table = el.querySelector("table");
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
    const button = el.shadowRoot?.getElementById(
      "test-table-download-button",
    ) as HTMLElement;
    expect(button).to.exist;
    expect(el.download).to.equal("data.csv");

    // The old dead `aria-label` binding on the host never reached nys-button
    // (host has no role, so it never maps into the accessibility tree). The
    // real accessible name has to come from nys-button's `label` prop, which
    // it renders into the internal <button>'s `.nys-button__text` node.
    expect(button.hasAttribute("aria-label")).to.be.false;
    const text = button.shadowRoot?.querySelector("button .nys-button__text");
    expect(text?.textContent?.trim()).to.equal("Download Caption Table");
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
    const table = el.querySelector("table");
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
    const table = el.querySelector("table");
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

    const table = el.querySelector("table");
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

    const table = el.querySelector("table");
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

    const table = el.querySelector("table");
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

    const table = el.querySelector("table");
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

    const table = el.querySelector("table");
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

    const table = el.querySelector("table");
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

  it("triggers a file download when downloadFile is called", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table id="download-test" download="data/table-data.csv">
        <table>
          <caption>
            Download Table
          </caption>
        </table>
      </nys-table>
    `);

    const appendSpy = sinon.spy(document.body, "appendChild");
    const removeSpy = sinon.spy(document.body, "removeChild");
    const clickSpy = sinon.stub(HTMLAnchorElement.prototype, "click");

    el.downloadFile();

    const anchor = appendSpy.firstCall.args[0] as HTMLAnchorElement;
    expect(anchor.tagName).to.equal("A");
    expect(anchor.href).to.include("data/table-data.csv");
    expect(anchor.download).to.equal("table-data.csv");
    expect(clickSpy.calledOnce).to.be.true;
    expect(removeSpy.calledOnce).to.be.true;

    appendSpy.restore();
    removeSpy.restore();
    clickSpy.restore();
  });

  it("keeps embedded cell content as a single interactive light-DOM copy", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table>
        <table>
          <tr>
            <th>Header</th>
          </tr>
          <tr>
            <td><button id="embedded-btn">Click</button></td>
          </tr>
        </table>
      </nys-table>
    `);

    // The table is enhanced in place, not cloned, so exactly one copy of the
    // embedded element exists and it lives in the light DOM.
    expect(el.querySelectorAll("#embedded-btn").length).to.equal(1);
    expect(el.shadowRoot?.querySelector("#embedded-btn")).to.be.null;

    // A listener bound to the real element receives its events (the bug this
    // refactor fixes: with a shadow-DOM clone, the visible copy had no listener).
    const btn = el.querySelector("#embedded-btn") as HTMLButtonElement;
    const spy = sinon.spy();
    btn.addEventListener("click", spy);
    btn.click();
    expect(spy.calledOnce).to.be.true;
  });

  it("registers every nys-* element it renders", async () => {
    const el = await fixture<NysTable>(html`
      <nys-table sortable download="data.csv">
        <table>
          <caption>
            Test table
          </caption>
          <tr>
            <th>col 1</th>
          </tr>
          <tr>
            <td>data 1</td>
          </tr>
        </table>
      </nys-table>
    `);
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });
});
