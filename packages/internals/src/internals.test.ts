import { html, fixture, expect } from "@open-wc/testing";
import { LitElement } from "lit";
import {
  generateId,
  supportsElementRefs,
  associateControl,
  associateHost,
  ReflectsAriaMixin,
  FormControlMixin,
} from "./index";

/* -------------------------------------------------------------------------- */
/* Test elements                                                              */
/* -------------------------------------------------------------------------- */

class ReflectsTestEl extends ReflectsAriaMixin(LitElement) {
  protected get defaultRole() {
    return "note";
  }
  get exposedInternals() {
    return this.internals;
  }
  callSetHostAria(name: string, value: string | null) {
    this.setHostAria(name, value);
  }
  render() {
    return html`<span>content</span>`;
  }
}
customElements.define("reflects-test-el", ReflectsTestEl);

class FormTestEl extends FormControlMixin(LitElement) {
  get exposedInternals() {
    return this.internals;
  }
  callSetValue(v: string | null) {
    this.setFormValue(v);
  }
  callSetValidity(
    flags: ValidityStateFlags,
    msg?: string,
    anchor?: HTMLElement,
  ) {
    this.setValidityFromState(flags, msg, anchor);
  }
  callClearValidity() {
    this.clearValidity();
  }
  render() {
    return html`<input aria-label="test field" />`;
  }
}
customElements.define("form-test-el", FormTestEl);

// A presentational element with no default role override — exercises the base
// `defaultRole` getter and the no-role branch of reflectDefaultSemantics.
class PlainReflectsEl extends ReflectsAriaMixin(LitElement) {
  render() {
    return html`<span></span>`;
  }
}
customElements.define("plain-reflects-el", PlainReflectsEl);

/* -------------------------------------------------------------------------- */
/* generateId                                                                 */
/* -------------------------------------------------------------------------- */

describe("generateId", () => {
  it("uses the prefix and produces unique ids in the legacy format", () => {
    const a = generateId("nys-foo");
    const b = generateId("nys-foo");
    expect(a).to.match(/^nys-foo-\d+-\d+$/);
    expect(a).to.not.equal(b);
  });
});

/* -------------------------------------------------------------------------- */
/* supportsElementRefs                                                        */
/* -------------------------------------------------------------------------- */

describe("supportsElementRefs", () => {
  it("detects ARIA element-reference reflection", () => {
    expect(
      supportsElementRefs({
        ariaDescribedByElements: null,
      } as unknown as ElementInternals),
    ).to.equal(true);
    expect(supportsElementRefs({} as unknown as ElementInternals)).to.equal(
      false,
    );
  });
});

/* -------------------------------------------------------------------------- */
/* associateControl (IDREF on native control)                                 */
/* -------------------------------------------------------------------------- */

describe("associateControl", () => {
  it("sets an IDREF attribute and auto-assigns missing target ids", async () => {
    const wrapper = await fixture(html`<div><input /><span>Label</span></div>`);
    const input = wrapper.querySelector("input")!;
    const label = wrapper.querySelector("span")!;
    associateControl(input, "labelledby", [label]);
    expect(label.id).to.match(/^nys-ref-/);
    expect(input.getAttribute("aria-labelledby")).to.equal(label.id);
  });

  it("supports errormessage and removes the attribute when targets are empty", async () => {
    const input = await fixture<HTMLInputElement>(html`<input />`);
    const err = document.createElement("span");
    err.id = "err-1";
    associateControl(input, "errormessage", [err, null]);
    expect(input.getAttribute("aria-errormessage")).to.equal("err-1");
    associateControl(input, "errormessage", []);
    expect(input.hasAttribute("aria-errormessage")).to.equal(false);
  });
});

/* -------------------------------------------------------------------------- */
/* associateHost (element refs + fallbacks)                                    */
/* -------------------------------------------------------------------------- */

describe("associateHost", () => {
  it("uses element references when supported", () => {
    const host = document.createElement("div");
    const label = document.createElement("span");
    const internals = {
      ariaDescribedByElements: null,
      ariaLabelledByElements: null,
    } as unknown as ElementInternals;
    associateHost(host, internals, "labelledby", [label]);
    expect(
      (internals as unknown as { ariaLabelledByElements: Element[] })
        .ariaLabelledByElements,
    ).to.deep.equal([label]);
  });

  it("falls back to string reflection from text content", () => {
    const host = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = "Hello";
    const internals = {
      ariaLabel: null,
      ariaDescription: null,
    } as unknown as ElementInternals;
    associateHost(host, internals, "labelledby", [label]);
    expect((internals as unknown as { ariaLabel: string }).ariaLabel).to.equal(
      "Hello",
    );
  });

  it("prefers an explicit fallback string", () => {
    const host = document.createElement("div");
    const internals = { ariaLabel: null } as unknown as ElementInternals;
    associateHost(host, internals, "labelledby", [], "Custom");
    expect((internals as unknown as { ariaLabel: string }).ariaLabel).to.equal(
      "Custom",
    );
  });

  it("clears string reflection to null when there is nothing to associate", () => {
    const host = document.createElement("div");
    const internals = { ariaLabel: "stale" } as unknown as ElementInternals;
    associateHost(host, internals, "labelledby", []);
    expect(
      (internals as unknown as { ariaLabel: string | null }).ariaLabel,
    ).to.equal(null);
  });

  it("falls back to a host attribute when no reflection exists", () => {
    const host = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = "Hi";
    const internals = {} as unknown as ElementInternals;
    associateHost(host, internals, "describedby", [label]);
    expect(host.getAttribute("aria-description")).to.equal("Hi");
  });

  it("ignores errormessage at host level", () => {
    const host = document.createElement("div");
    const internals = {} as unknown as ElementInternals;
    associateHost(host, internals, "errormessage", [host]);
    expect(host.hasAttribute("aria-errormessage")).to.equal(false);
  });

  it("removes a stale host attribute when targets are empty and no reflection exists", () => {
    const host = document.createElement("div");
    host.setAttribute("aria-label", "stale");
    const internals = {} as unknown as ElementInternals;
    associateHost(host, internals, "labelledby", []);
    expect(host.hasAttribute("aria-label")).to.equal(false);
  });
});

/* -------------------------------------------------------------------------- */
/* ReflectsAriaMixin                                                          */
/* -------------------------------------------------------------------------- */

describe("ReflectsAriaMixin", () => {
  it("auto-generates an id and reflects the default role", async () => {
    const el = await fixture<ReflectsTestEl>(
      html`<reflects-test-el></reflects-test-el>`,
    );
    expect(el.id).to.match(/^reflects-test-el-/);
    const internals = el.exposedInternals as unknown as {
      role?: string;
    } | null;
    const roleApplied =
      internals?.role === "note" || el.getAttribute("role") === "note";
    expect(roleApplied).to.equal(true);
  });

  it("respects a consumer-provided id", async () => {
    const el = await fixture<ReflectsTestEl>(
      html`<reflects-test-el id="mine"></reflects-test-el>`,
    );
    expect(el.id).to.equal("mine");
  });

  it("reflects host attribute for unsupported aria state, and removes on null", async () => {
    const el = await fixture<ReflectsTestEl>(
      html`<reflects-test-el></reflects-test-el>`,
    );
    el.callSetHostAria("ariaMadeUpState", "x");
    expect(el.getAttribute("aria-madeUpState")).to.equal("x");
    el.callSetHostAria("ariaMadeUpState", null);
    expect(el.hasAttribute("aria-madeUpState")).to.equal(false);
  });

  it("is not a form-associated element", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><reflects-test-el></reflects-test-el></form>`,
    );
    const el = form.querySelector("reflects-test-el")!;
    expect(Array.from(form.elements)).to.not.include(el);
  });

  it("applies no role when defaultRole is null", async () => {
    const el = await fixture(html`<plain-reflects-el></plain-reflects-el>`);
    expect(el.id).to.match(/^plain-reflects-el-/);
    expect(el.hasAttribute("role")).to.equal(false);
  });
});

/* -------------------------------------------------------------------------- */
/* FormControlMixin                                                           */
/* -------------------------------------------------------------------------- */

describe("FormControlMixin", () => {
  it("is a form-associated custom element", () => {
    expect(
      (FormTestEl as unknown as { formAssociated: boolean }).formAssociated,
    ).to.equal(true);
  });

  it("submits its value through the owning form and participates in form.elements", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><form-test-el name="field"></form-test-el></form>`,
    );
    const el = form.querySelector<FormTestEl>("form-test-el")!;
    el.callSetValue("hello");
    const data = new FormData(form);
    expect(data.get("field")).to.equal("hello");
    expect(Array.from(form.elements)).to.include(el);
  });

  it("reflects validity and aria-invalid, then clears", async () => {
    const el = await fixture<FormTestEl>(
      html`<form-test-el name="f"></form-test-el>`,
    );
    el.callSetValidity({ valueMissing: true }, "Required");
    expect(el.checkValidity()).to.equal(false);
    const internals = el.exposedInternals as unknown as {
      ariaInvalid?: string;
    } | null;
    const invalid =
      internals?.ariaInvalid === "true" ||
      el.getAttribute("aria-invalid") === "true";
    expect(invalid).to.equal(true);

    el.callClearValidity();
    expect(el.checkValidity()).to.equal(true);
    expect(el.reportValidity()).to.equal(true);
  });

  it("uses a default message when none is provided", async () => {
    const el = await fixture<FormTestEl>(
      html`<form-test-el name="f"></form-test-el>`,
    );
    el.callSetValidity({ customError: true });
    expect(el.checkValidity()).to.equal(false);
    const internals = el.exposedInternals as unknown as {
      validationMessage?: string;
    } | null;
    expect(internals?.validationMessage).to.equal("Invalid value");
    el.callClearValidity();
  });

  it("accepts a null form value", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><form-test-el name="n"></form-test-el></form>`,
    );
    const el = form.querySelector<FormTestEl>("form-test-el")!;
    el.callSetValue(null);
    expect(new FormData(form).get("n")).to.equal(null);
  });

  it("clears validity on form reset", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><form-test-el name="f"></form-test-el></form>`,
    );
    const el = form.querySelector<FormTestEl>("form-test-el")!;
    el.callSetValidity({ valueMissing: true }, "Required");
    expect(el.checkValidity()).to.equal(false);
    form.reset();
    expect(el.checkValidity()).to.equal(true);
  });

  it("passes an axe a11y audit", async () => {
    const el = await fixture<FormTestEl>(
      html`<form-test-el name="f"></form-test-el>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
