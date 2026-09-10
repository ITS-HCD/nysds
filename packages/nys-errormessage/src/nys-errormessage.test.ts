import { expect, html, fixture } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
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

  it("registers every nys-* element it renders", async () => {
    const el = await fixture<NysErrorMessage>(
      html`<nys-errormessage
        showError
        errorMessage="Test error"
      ></nys-errormessage>`,
    );
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });
});
