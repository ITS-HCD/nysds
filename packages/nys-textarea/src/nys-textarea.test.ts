import { expect, html, fixture } from "@open-wc/testing";
import { NysTextarea } from "./nys-textarea";
import "../dist/nys-textarea.js";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

describe("nys-textarea", () => {
  it("renders the component with default attributes", async () => {
    const el = await fixture<NysTextarea>(html`<nys-textarea></nys-textarea>`);

    expect(el).to.exist;

    expect(el.id).to.match(/^nys-textarea-\d+/);
    expect(el.name).to.equal("");
    expect(el.label).to.equal("");
    expect(el.description).to.equal("");
    expect(el.placeholder).to.equal("");
    expect(el.value).to.equal("");
    expect(el.disabled).to.equal(false);
    expect(el.readonly).to.equal(false);
    expect(el.required).to.equal(false);
    expect(el.optional).to.equal(false);
    expect(el.form).to.equal(null);
    expect(el.maxlength).to.equal(null);
    expect(el.width).to.equal("full");
    expect(el.rows).to.equal(4);
    expect(el.showError).to.equal(false);
    expect(el.errorMessage).to.equal("");

    const textarea = el.shadowRoot?.querySelector("textarea");
    expect(el.resize).to.equal("vertical");
    expect(textarea?.classList.contains("vertical")).to.be.true;
  });

  it("renders the component with correct label and value", async () => {
    const el = await fixture<NysTextarea>(
      html`<nys-textarea
        id="quote"
        label="Enter your favorite quote:"
        value="Majorities, of course, start with minorities."
      >
      </nys-textarea>`,
    );

    const label = el.shadowRoot?.querySelector("nys-label");
    expect(label?.getAttribute("for")).to.equal("quote--native");

    const textarea = el.shadowRoot?.querySelector<HTMLTextAreaElement>(
      ".nys-textarea__textarea",
    );
    expect(textarea?.value).to.equal(
      "Majorities, of course, start with minorities.",
    );
  });

  it("renders a placeholder when provided", async () => {
    const el = await fixture<NysTextarea>(
      html`<nys-textarea
        placeholder="Type your answer here..."
      ></nys-textarea>`,
    );
    const textarea = el.shadowRoot?.querySelector("textarea");

    expect(textarea?.getAttribute("placeholder")).to.equal(
      "Type your answer here...",
    );
  });

  it("renders textarea as readonly when the readonly attribute is set", async () => {
    const el = await fixture<NysTextarea>(
      html`<nys-textarea
        readonly
        value="This cannot be changed."
      ></nys-textarea>`,
    );
    const textarea = el.shadowRoot?.querySelector("textarea");

    expect(textarea?.hasAttribute("readonly")).to.be.true;
  });

  it("ignores required if readonly is also set", async () => {
    const el = await fixture<NysTextarea>(
      html`<nys-textarea required readonly></nys-textarea>`,
    );

    const textarea = el.shadowRoot?.querySelector("textarea");

    expect(textarea?.hasAttribute("readonly")).to.be.true;
    expect(textarea?.hasAttribute("required")).to.be.false;
  });

  it("sets the correct number of rows on the textarea", async () => {
    const el = await fixture<NysTextarea>(html`
      <nys-textarea rows="6"></nys-textarea>
    `);

    expect(el.rows).to.equal(6);

    const textarea = el.shadowRoot?.querySelector("textarea")!;
    expect(textarea.rows).to.equal(6);
  });

  it("applies resize or no resize to the textarea", async () => {
    const el = await fixture<NysTextarea>(html`
      <nys-textarea resize="none"></nys-textarea>
    `);

    expect(el.resize).to.equal("none");

    const textarea = el.shadowRoot?.querySelector("textarea")!;
    expect(textarea.classList.contains("none")).to.be.true;
  });

  it("sets the maxlength attribute on the textarea", async () => {
    const el = await fixture<NysTextarea>(html`
      <nys-textarea maxlength="120"></nys-textarea>
    `);

    expect(el.maxlength).to.equal(120);

    const textarea = el.shadowRoot?.querySelector("textarea")!;
    expect(textarea.getAttribute("maxlength")).to.equal("120");
  });

  it("show required symbol when type is required", async () => {
    const el = await fixture<NysTextarea>(
      html`<nys-textarea required></nys-textarea>`,
    );
    const textarea = el.shadowRoot?.querySelector("textarea");

    expect(textarea?.hasAttribute("required")).to.be.true;
    expect(textarea?.hasAttribute("aria-required")).to.be.true;

    const label = el.shadowRoot?.querySelector("nys-label");
    expect(label?.getAttribute("flag")).to.equal("required");
  });

  it("displays an error message when required field is empty", async () => {
    const el = await fixture<NysTextarea>(
      html`<nys-textarea required></nys-textarea>`,
    );
    const textarea = el.shadowRoot?.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    textarea.value = "";
    textarea.dispatchEvent(new Event("change")); // simulate typing
    textarea.dispatchEvent(new Event("blur")); // simulate losing focus
    await el.updateComplete;

    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.hasAttribute("showError")).to.be.true;
  });
});

// Accessibility Tests
/*
 * Ensure that the <textarea> element is correctly associated with a label:
 * - Verify that the label is properly read by screen readers when the <textarea> is focused.
 * - Ensure textarea is focusable and keyboard accessibility.
 * - Placeholder is readable for screen readers.
 * - The width is correctly applied. (css styling)
 */
describe("nys-textarea", () => {
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-textarea label="Inspirational Quote"></nys-textarea>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
