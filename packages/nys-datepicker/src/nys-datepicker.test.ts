import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import "../dist/nys-datepicker.js";
import { NysDatepicker } from "./nys-datepicker.js";

describe("nys-datepicker", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-datepicker></nys-datepicker>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-datepicker-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysDatepicker>(html`
      <nys-datepicker
        label="My Label"
        hideTodayButton
        hideClearButton
        required
      ></nys-datepicker>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
    expect(el.optional).to.be.false;
    expect(el.hideTodayButton).to.be.true;
    expect(el.hideClearButton).to.be.true;
    expect(el.disabled).to.be.false;
  });

  it("sets the value property and updates input and wc-datepicker", async () => {
    const el = await fixture<NysDatepicker>(
      html` <nys-datepicker></nys-datepicker>`,
    );

    const testDate = new Date(2026, 0, 10); // Jan 10, 2026
    el.value = testDate;
    await el.updateComplete;

    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    const wcDatepicker = el.shadowRoot?.querySelector("wc-datepicker") as any;

    expect(input.value).to.equal("2026-01-10");
    expect(wcDatepicker?.value.getTime()).to.equal(testDate.getTime());
  });

  it("parses string value to Date correctly", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker value="2025-12-31"></nys-datepicker>`,
    );

    expect(el.value).to.be.instanceOf(Date);
    expect((el.value as Date).getFullYear()).to.equal(2025);
    expect((el.value as Date).getMonth()).to.equal(11);
    expect((el.value as Date).getDate()).to.equal(31);
  });

  it("handles startDate properly and updates WC datepicker", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker startDate="2026-01-01"></nys-datepicker>`,
    );
    await el.updateComplete;

    const wcDatepicker = el.shadowRoot?.querySelector("wc-datepicker") as any;
    expect(wcDatepicker.getAttribute("start-date")).to.equal("2026-01-01");
  });

  it("fires nys-input event on input change", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;

    setTimeout(() => {
      input.value = "2025-02-20";
      input.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    });

    const event = await oneEvent(el, "nys-input");
    expect(event).to.exist;
    expect(event.detail.value).to.be.instanceOf(Date);
    expect(event.detail.value.getFullYear()).to.equal(2025);
    expect(event.detail.value.getMonth()).to.equal(1);
    expect(event.detail.value.getDate()).to.equal(20);
  });

  it("handles Today button click", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    const todayBtn = el.shadowRoot?.querySelector(
      "nys-button[label='Today']",
    ) as HTMLButtonElement;
    if (!todayBtn) return;

    todayBtn.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const today = new Date();
    const valueDate = el.value as Date;
    expect(valueDate.getFullYear()).to.equal(today.getFullYear());
    expect(valueDate.getMonth()).to.equal(today.getMonth());
    expect(valueDate.getDate()).to.equal(today.getDate());
  });

  it("handles Clear button click", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    const clearBtn = el.shadowRoot?.querySelector(
      "nys-button[label='Clear']",
    ) as HTMLButtonElement;
    if (!clearBtn) return;

    clearBtn.click();
    await el.updateComplete;

    expect(el.value).to.be.undefined;
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    expect(input.value).to.equal("");
  });

  it("shows error message when required and empty", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker required></nys-datepicker>`,
    );
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;

    input.dispatchEvent(new Event("change")); // simulate typing
    input.dispatchEvent(new Event("blur")); // simulate losing focus

    await el.updateComplete;

    expect(el.showError).to.be.true;
    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.hasAttribute("showError")).to.be.true;
    expect(errorMessage?.hasAttribute("errorMessage")).to.exist;
  });

  it("fires nys-blur event on blur", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );

    setTimeout(() => {
      el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    });

    const event = await oneEvent(el, "nys-blur");
    expect(event).to.exist;
  });

  it("returns true from checkValidity when input is valid", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );

    const valid = el.checkValidity();

    expect(valid).to.be.true;
  });

  it("uses custom errorMessage instead of native validation message", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker
        required
        errorMessage="Custom error"
      ></nys-datepicker>`,
    );

    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;

    input.dispatchEvent(new Event("blur"));

    await el.updateComplete;

    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");

    expect(errorMessage?.getAttribute("errorMessage")).to.equal("Custom error");
  });

  it("parses a local date string without timezone shift", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );

    const parsed = (el as any)._parseLocalDate("2026-05-15");

    expect(parsed).to.be.instanceOf(Date);
    expect(parsed.getFullYear()).to.equal(2026);
    expect(parsed.getMonth()).to.equal(4);
    expect(parsed.getDate()).to.equal(15);
  });

  it("focuses input when _toggleDatepicker is called on native datepicker", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    // Force native datepicker path
    (el as any)._isSafari = () => true;
    (el as any)._isMobile = () => false;

    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    let focused = false;
    input.focus = () => {
      focused = true;
    };

    (el as any)._toggleDatepicker();
    await el.updateComplete;

    expect(focused).to.be.true;
  });

  it("does nothing when _toggleDatepicker is called while disabled", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker disabled></nys-datepicker>`,
    );
    await el.updateComplete;

    const before = (el as any).datepickerIsOpen;
    (el as any)._toggleDatepicker();
    await el.updateComplete;

    expect((el as any).datepickerIsOpen).to.equal(before);
  });

  it("does nothing when _openDatepicker is called while disabled", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker disabled></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any)._openDatepicker();
    await el.updateComplete;

    expect((el as any).datepickerIsOpen).to.be.false;
  });

  it("does nothing when _openDatepicker is called on native datepicker", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any)._isSafari = () => true;
    (el as any)._isMobile = () => false;

    (el as any)._openDatepicker();
    await el.updateComplete;

    expect((el as any).datepickerIsOpen).to.be.false;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-datepicker label="My Label"></nys-datepicker>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
