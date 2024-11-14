import { fixture, expect } from "@open-wc/testing";
import sinon from "sinon";
import { NysCheckbox } from "./nys-checkbox";

describe("nys-checkbox", () => {
  it("should instantiate with default properties", async () => {
    const el = await fixture<NysCheckbox>(`<nys-checkbox></nys-checkbox>`);
    expect(el.checked).to.be.false;
    expect(el.disabled).to.be.false;
    expect(el.required).to.be.false;
    expect(el.label).to.equal("");
    expect(el.description).to.equal("");
  });

  it('should reflect the "checked" property', async () => {
    const el = await fixture<NysCheckbox>(
      `<nys-checkbox checked></nys-checkbox>`,
    );
    expect(el.checked).to.be.true;

    el.checked = false;
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it('should dispatch a "change" event on toggle', async () => {
    const el = await fixture<NysCheckbox>(`<nys-checkbox></nys-checkbox>`);
    const changeSpy = sinon.spy();
    el.addEventListener("change", changeSpy);

    el.checked = true;
    el.dispatchEvent(new Event("change"));
    await el.updateComplete;

    expect(changeSpy).to.have.been.calledOnce;
    expect(el.checked).to.be.true;
  });

  it('should apply "disabled" attribute correctly', async () => {
    const el = await fixture<NysCheckbox>(
      `<nys-checkbox disabled></nys-checkbox>`,
    );
    expect(el.disabled).to.be.true;
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.disabled).to.be.true;
  });

  it('should toggle "checked" on space key press', async () => {
    const el = await fixture<NysCheckbox>(`<nys-checkbox></nys-checkbox>`);
    el.focus();

    const spaceEvent = new KeyboardEvent("keydown", {
      code: "Space",
      bubbles: true,
      cancelable: true,
    });

    el.dispatchEvent(spaceEvent);
    await el.updateComplete;

    expect(el.checked).to.be.true;
  });
});
