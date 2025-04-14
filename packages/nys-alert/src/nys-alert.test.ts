import { expect, html, fixture } from "@open-wc/testing";
import "./nys-alert";
import { NysAlert } from "./nys-alert";

describe("nys-textinput", () => {
  it("should render component", async () => {
    const el = await fixture(html`<nys-alert></nys-alert>`);
    expect(el).to.exist;
  });

  it("should have default type as base", async () => {
    const el = await fixture<NysAlert>(html`<nys-alert></nys-alert>`);
    expect(el.type).to.equal("base");
  });
});
