import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-errormessage.js";
import { NysErrorMessage } from "./nys-errormessage.js";

describe("nys-errormessage", () => {
  it("renders nothing when showError is false", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage></nys-errormessage>`,
    );
    expect(el.shadowRoot?.querySelector(".nys-errormessage")).to.be.null;
  });

  it("renders internal validationMessage when set", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage showError></nys-errormessage>`,
    );

    // Set a custom validity error (this updates internal validationMessage)
    (el as any)._internals.setValidity({ customError: true }, "Custom error");

    // Force Lit to re-render
    el.requestUpdate();
    await el.updateComplete;

    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv).to.exist;
    expect(errorDiv?.textContent).to.include("Custom error");
  });

  it("renders errorMessage fallback when internal validationMessage is empty", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage
        showError
        errorMessage="Fallback error"
      ></nys-errormessage>`,
    );

    // Clear any validation errors
    (el as any)._internals.setValidity({});
    await el.updateComplete;

    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv).to.exist;
    expect(errorDiv?.textContent).to.include("Fallback error");
  });

  it("renders with showDivider attribute when showDivider is true", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage
        showError
        showDivider
        errorMessage="Error with divider"
      ></nys-errormessage>`,
    );
    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv).to.exist;
    expect(errorDiv?.hasAttribute("showDivider")).to.be.true;
  });
});

describe("nys-errormessage styles", () => {
  it("has the correct font family applied", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage showError errorMessage="test"></nys-errormessage>`,
    );
    const style = getComputedStyle(
      el.shadowRoot!.querySelector(".nys-errormessage")!,
    );
    expect(style.fontFamily).to.include("Proxima Nova");
  });

  it("applies the danger color variable", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage showError errorMessage="test"></nys-errormessage>`,
    );
    const style = getComputedStyle(
      el.shadowRoot!.querySelector(".nys-errormessage")!,
    );
    // This should match your CSS var or fallback color from your styles
    expect(style.color).to.equal("rgb(181, 44, 44)");
  });

  it("applies the showDivider styles when attribute is set", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage
        showError
        showDivider
        errorMessage="test"
      ></nys-errormessage>`,
    );
    const errorDiv = el.shadowRoot!.querySelector(".nys-errormessage")!;
    const style = getComputedStyle(errorDiv);

    // Check border-top width and style applied
    expect(style.borderTopWidth).to.equal("1px");
    expect(style.borderTopStyle).to.equal("solid");
  });
});

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

    // Use setValidity to set custom validation message
    (el as any)._internals.setValidity(
      { customError: true },
      "Validation failed",
    );
    el.requestUpdate();
    await el.updateComplete;

    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv?.textContent).to.include("Validation failed");
  });

  it("renders errorMessage fallback if validationMessage is empty", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage
        showError
        errorMessage="Fallback error"
      ></nys-errormessage>`,
    );

    // Stub the validationMessage getter to return empty string
    Object.defineProperty((el as any)._internals, "validationMessage", {
      get: () => "",
      configurable: true,
    });

    el.requestUpdate();
    await el.updateComplete;

    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv?.textContent).to.include("Fallback error");
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

  it("does not render showDivider attribute when showDivider=false", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage
        showError
        errorMessage="Error"
      ></nys-errormessage>`,
    );
    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv?.hasAttribute("showDivider")).to.be.false;
  });

  it("toggles showError property and re-renders accordingly", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage></nys-errormessage>`,
    );
    expect(el.shadowRoot?.querySelector(".nys-errormessage")).to.be.null;

    el.showError = true;
    el.errorMessage = "Now showing error";
    await el.updateComplete;

    const errorDiv = el.shadowRoot?.querySelector(".nys-errormessage");
    expect(errorDiv).to.exist;
    expect(errorDiv?.textContent).to.include("Now showing error");

    el.showError = false;
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".nys-errormessage")).to.be.null;
  });
});
