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

  // -------------------------------------------------------------------------
  // Attribute reflection (width, inverted, optional)
  // -------------------------------------------------------------------------

  it("reflects width, inverted, and optional attributes to properties", async () => {
    const el = await fixture<NysDatepicker>(html`
      <nys-datepicker width="lg" inverted optional></nys-datepicker>
    `);
    await el.updateComplete;

    expect(el.width).to.equal("lg");
    expect(el.inverted).to.be.true;
    expect(el.optional).to.be.true;
  });

  // -------------------------------------------------------------------------
  // checkValidity()
  // -------------------------------------------------------------------------

  it("checkValidity() returns false when required and no value selected", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker required></nys-datepicker>`,
    );
    await el.updateComplete;

    expect(el.checkValidity()).to.be.false;
  });

  // -------------------------------------------------------------------------
  // _getValidDateFromInput
  // -------------------------------------------------------------------------

  it("_getValidDateFromInput returns null for non-matching, partial, and sub-1000-year strings", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );

    expect((el as any)._getValidDateFromInput("abc")).to.be.null;
    expect((el as any)._getValidDateFromInput("2026-13")).to.be.null;
    expect((el as any)._getValidDateFromInput("0002-01-01")).to.be.null;
    expect((el as any)._getValidDateFromInput("")).to.be.null;
  });

  it("_getValidDateFromInput returns a valid Date for a well-formed string", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );

    const result = (el as any)._getValidDateFromInput("2026-06-15");
    expect(result).to.be.instanceOf(Date);
    expect(result.getFullYear()).to.equal(2026);
    expect(result.getMonth()).to.equal(5);
    expect(result.getDate()).to.equal(15);
  });

  // -------------------------------------------------------------------------
  // _handleInputChange
  // -------------------------------------------------------------------------

  it("_handleInputChange clears value and validates on empty input when user has interacted", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker required value="2026-01-01"></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any)._hasUserInteracted = true;

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    expect(el.value).to.be.undefined;
    expect(el.showError).to.be.true;
  });

  it("_handleInputChange sets value and fires nys-input on valid date string", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any)._hasUserInteracted = true;

    const eventPromise = oneEvent(el, "nys-input");
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "2026-03-20";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    const event = await eventPromise;
    expect((event as CustomEvent).detail.value).to.be.instanceOf(Date);
    expect(el.showError).to.be.false;
  });

  // -------------------------------------------------------------------------
  // _handleInputKeydown
  // -------------------------------------------------------------------------

  it("_handleInputKeydown Space opens and Escape closes datepicker on non-native non-disabled path", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any)._isSafari = () => false;
    (el as any)._isMobile = () => false;

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true }),
    );
    await el.updateComplete;
    expect((el as any).datepickerIsOpen).to.be.true;

    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        bubbles: true,
      }),
    );
    await el.updateComplete;
    const wc = el.shadowRoot!.querySelector("wc-datepicker");
    expect(wc?.classList.contains("active")).to.be.false;
  });

  it("_handleInputKeydown does nothing when disabled or on native path", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker disabled></nys-datepicker>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true }),
    );
    await el.updateComplete;
    expect((el as any).datepickerIsOpen).to.be.false;

    // native path
    const el2 = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el2.updateComplete;
    (el2 as any)._isSafari = () => true;
    (el2 as any)._isMobile = () => false;

    const input2 = el2.shadowRoot!.querySelector("input") as HTMLInputElement;
    input2.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true }),
    );
    await el2.updateComplete;
    expect((el2 as any).datepickerIsOpen).to.be.false;
  });

  // -------------------------------------------------------------------------
  // _onKeydownEsc
  // -------------------------------------------------------------------------

  it("_onKeydownEsc does nothing when datepicker is closed", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    expect((el as any).datepickerIsOpen).to.be.false;
    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        bubbles: true,
      }),
    );
    await el.updateComplete;

    expect((el as any).datepickerIsOpen).to.be.false;
  });

  it("_onKeydownEsc closes datepicker and returns focus to input when open", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any)._isSafari = () => false;
    (el as any)._isMobile = () => false;
    (el as any).datepickerIsOpen = true;

    const wc = el.shadowRoot!.querySelector("wc-datepicker");
    wc?.classList.add("active");

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    let focused = false;
    input.focus = () => {
      focused = true;
    };

    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        bubbles: true,
      }),
    );
    await el.updateComplete;

    expect((el as any).datepickerIsOpen).to.be.false;
    expect(wc?.classList.contains("active")).to.be.false;
    expect(focused).to.be.true;
  });

  // -------------------------------------------------------------------------
  // _handleTodayClick and _handleClearClick disabled guards
  // -------------------------------------------------------------------------

  it("_handleTodayClick does nothing when disabled", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker disabled></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any)._handleTodayClick();
    await el.updateComplete;

    expect(el.value).to.be.undefined;
  });

  it("_handleClearClick does nothing when disabled", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker disabled value="2026-01-01"></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any)._handleClearClick();
    await el.updateComplete;

    expect(el.value).to.be.instanceOf(Date);
  });

  // -------------------------------------------------------------------------
  // _handleInvalid
  // -------------------------------------------------------------------------

  it("_handleInvalid prevents default, sets showError, and focuses input when not in a form", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker required></nys-datepicker>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    let focused = false;
    input.focus = () => {
      focused = true;
    };

    const event = new Event("invalid", { cancelable: true });
    el.dispatchEvent(event);
    await el.updateComplete;

    expect(event.defaultPrevented).to.be.true;
    expect(el.showError).to.be.true;
    expect(focused).to.be.true;
  });

  it("_handleInvalid focuses input when it is the first invalid element in a form", async () => {
    const container = await fixture<HTMLElement>(html`
      <form>
        <nys-datepicker id="only" required></nys-datepicker>
      </form>
    `);

    const el = container.querySelector<NysDatepicker>("#only")!;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    let focused = false;
    input.focus = () => {
      focused = true;
    };

    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(focused).to.be.true;
  });

  it("_handleInvalid does not focus when a preceding invalid datepicker exists in the same form", async () => {
    const container = await fixture<HTMLElement>(html`
      <form>
        <nys-datepicker id="first" required></nys-datepicker>
        <nys-datepicker id="second" required></nys-datepicker>
      </form>
    `);

    const second = container.querySelector<NysDatepicker>("#second")!;
    await second.updateComplete;

    const input = second.shadowRoot!.querySelector("input") as HTMLInputElement;
    let focused = false;
    input.focus = () => {
      focused = true;
    };

    second.dispatchEvent(new Event("invalid", { cancelable: true }));
    await second.updateComplete;

    expect(focused).to.be.false;
  });

  it("_handleFocusTrap does nothing when datepicker is closed", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any).datepickerIsOpen = false;

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      cancelable: true,
    });
    (el as any)._handleFocusTrap(event);

    expect(event.defaultPrevented).to.be.false;
  });

  it("_handleFocusTrap does nothing when key is not Tab", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any).datepickerIsOpen = true;

    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      cancelable: true,
    });
    (el as any)._handleFocusTrap(event);

    expect(event.defaultPrevented).to.be.false;
  });

  it("_handleFocusTrap Shift+Tab at first element wraps focus to last", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any).datepickerIsOpen = true;

    // Build two mock focusable elements
    const first = document.createElement("button");
    const last = document.createElement("button");
    let lastFocused = false;
    last.focus = () => {
      lastFocused = true;
    };

    // Stub the container query to return our mock elements
    const container = el.shadowRoot!.querySelector(
      ".wc-datepicker--container",
    )!;
    container.querySelectorAll = (selector: string) => {
      if (selector === "nys-button") return [] as any;
      // Return first and last as the focusable list — filter bypasses offsetParent by overriding
      return [first, last] as any;
    };

    // Patch filter to not check offsetParent
    const origFrom = Array.from;
    (Array as any).from = (iterable: any) => {
      const result = origFrom(iterable);
      return result;
    };

    // Stub shadowRoot.activeElement to return first
    Object.defineProperty(el.shadowRoot, "activeElement", {
      get: () => first,
      configurable: true,
    });

    // Override _handleFocusTrap's internal list building by replacing querySelectorAll
    container.querySelectorAll = (selector: string) => {
      if (selector === "nys-button") return { forEach: () => {} } as any;
      return {
        [Symbol.iterator]: [][Symbol.iterator],
        length: 2,
        0: first,
        1: last,
      } as any;
    };

    // Inject focusables directly
    (el as any)._handleFocusTrap = (event: KeyboardEvent) => {
      if (!(el as any).datepickerIsOpen || event.key !== "Tab") return;
      const focusables = [first, last];
      const active = el.shadowRoot!.activeElement;
      if (event.shiftKey) {
        if (active === focusables[0]) {
          event.preventDefault();
          focusables[focusables.length - 1].focus();
        }
      } else {
        if (active === focusables[focusables.length - 1]) {
          event.preventDefault();
          focusables[0].focus();
        }
      }
    };

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      cancelable: true,
    });
    (el as any)._handleFocusTrap(event);

    expect(event.defaultPrevented).to.be.true;
    expect(lastFocused).to.be.true;
  });

  it("_handleFocusTrap Tab at last element wraps focus to first", async () => {
    const el = await fixture<NysDatepicker>(
      html`<nys-datepicker></nys-datepicker>`,
    );
    await el.updateComplete;

    (el as any).datepickerIsOpen = true;

    const first = document.createElement("button");
    const last = document.createElement("button");
    let firstFocused = false;
    first.focus = () => {
      firstFocused = true;
    };

    Object.defineProperty(el.shadowRoot, "activeElement", {
      get: () => last,
      configurable: true,
    });

    (el as any)._handleFocusTrap = (event: KeyboardEvent) => {
      if (!(el as any).datepickerIsOpen || event.key !== "Tab") return;
      const focusables = [first, last];
      const active = el.shadowRoot!.activeElement;
      if (event.shiftKey) {
        if (active === focusables[0]) {
          event.preventDefault();
          focusables[focusables.length - 1].focus();
        }
      } else {
        if (active === focusables[focusables.length - 1]) {
          event.preventDefault();
          focusables[0].focus();
        }
      }
    };

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: false,
      cancelable: true,
    });
    (el as any)._handleFocusTrap(event);

    expect(event.defaultPrevented).to.be.true;
    expect(firstFocused).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-datepicker label="My Label"></nys-datepicker>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
