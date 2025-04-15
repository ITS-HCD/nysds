import { expect, html, fixture } from "@open-wc/testing";
import { NysAlert } from "./nys-alert";
// import "./nys-alert";

describe("nys-alert", () => {
  // FAIL THE TEST (this is me testing out the errors)
  // it("should NOT pass this basic test", () => {
  //   expect(true).to.be.false;
  // });

  it("should have default type as base", async () => {
    const el = await fixture<NysAlert>(html`<nys-alert></nys-alert>`);
    expect(el?.type).to.equal("base");
  });
});
