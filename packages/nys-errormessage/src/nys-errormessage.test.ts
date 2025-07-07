import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-errormessage.js";
import { NysErrorMessage } from "./nys-errormessage.js";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-errormessage", () => {
  it("renders the component", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage></nys-errormessage>`,
    );
    expect(el).to.exist;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-errormessage label="My Label"></nys-errormessage>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("renders nothing if showError is false", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage></nys-errormessage>`,
    );
    expect(el.shadowRoot?.querySelector(".nys-errormessage")).to.be.null;
  });

  it("renders validationMessage from internals when set", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage showError></nys-errormessage>`,
    );
    // Set custom validity
    (el as any)._internals.setValidity(
      { customError: true },
      "Validation failed",
    );
    el.requestUpdate();
    await el.updateComplete;
    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv?.textContent).to.include("Validation failed");
  });

  it("renders nothing when showError is false", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage></nys-errormessage>`,
    );
    expect(el.shadowRoot?.querySelector(".nys-errormessage")).to.be.null;
  });

  it("renders errorMessage when showError is true and no validationMessage", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage
        showError
        errorMessage="Error occurred"
      ></nys-errormessage>`,
    );
    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv).to.exist;
    expect(errorDiv?.textContent).to.include("Error occurred");
  });

  it("renders validationMessage from internals when set", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage showError></nys-errormessage>`,
    );
    (el as any)._internals.setValidity(
      { customError: true },
      "Validation failed",
    );
    el.requestUpdate();
    await el.updateComplete;
    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv?.textContent).to.include("Validation failed");
  });

  it("renders with showDivider attribute when showDivider=true", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage
        showError
        showDivider
        errorMessage="Error"
      ></nys-errormessage>`,
    );
    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv?.hasAttribute("showDivider")).to.be.true;
  });
});
