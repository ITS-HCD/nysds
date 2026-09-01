/**
 * Smoke suite for @nysds/react (runs in real Chromium via Playwright).
 *
 * Covers the WS3 acceptance criteria:
 * - every exported component renders and its custom element upgrades
 * - nys-textinput controlled round-trip, including re-setting the same
 *   value after the element diverged
 * - nys-checkbox checked round-trip
 * - nys-radiogroup and nys-checkboxgroup group value round-trips
 * - nys-fileinput files set through setFiles
 */
import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import * as lib from "../src/index.js";
import type {
  NysCheckboxElement,
  NysCheckboxgroupElement,
  NysFileinputElement,
  NysRadiogroupElement,
  NysTextinputElement,
} from "../src/index.js";

// React 19 exports act; React 18 needs the test-utils fallback.
const act: <T>(cb: () => T | Promise<T>) => Promise<T> =
  (React as { act?: never }).act ??
  ((await import("react-dom/test-utils")) as { act?: never }).act;
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

const mounted: Array<{ root: Root; container: HTMLElement }> = [];

async function render(node: React.ReactElement): Promise<HTMLElement> {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  mounted.push({ root, container });
  await act(async () => {
    root.render(node);
  });
  return container;
}

afterEach(async () => {
  for (const { root, container } of mounted.splice(0)) {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  }
});

type LitLike = HTMLElement & { updateComplete: Promise<unknown> };

function innerInput(el: HTMLElement): HTMLInputElement {
  const input =
    el.shadowRoot?.querySelector("input, textarea") ??
    el.querySelector("input, textarea");
  if (!input) throw new Error(`no inner input found in <${el.localName}>`);
  return input as HTMLInputElement;
}

async function typeInto(el: LitLike, text: string): Promise<void> {
  const input = innerInput(el);
  await act(async () => {
    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  });
  await el.updateComplete;
}

const componentEntries = Object.entries(lib).filter(
  ([name, value]) =>
    /^Nys[A-Z]/.test(name) &&
    value !== null &&
    (typeof value === "object" || typeof value === "function")
) as Array<[string, React.ComponentType]>;

describe("every export renders and upgrades", () => {
  it("exports the full component surface", () => {
    expect(componentEntries.length).toBeGreaterThanOrEqual(50);
  });

  for (const [name, Component] of componentEntries) {
    it(name, async () => {
      const container = await render(React.createElement(Component));
      const el = container.firstElementChild;
      expect(el, `${name} rendered nothing`).not.toBeNull();
      expect(
        el!.localName.startsWith("nys-"),
        `${name} rendered <${el!.localName}>`
      ).toBe(true);
      const ctor = customElements.get(el!.localName);
      expect(ctor, `<${el!.localName}> is not registered`).toBeDefined();
      expect(el instanceof ctor!, `<${el!.localName}> did not upgrade`).toBe(
        true
      );
    });
  }
});

describe("nys-textinput (value kind)", () => {
  it("controlled round-trip", async () => {
    let current = "";
    function Harness() {
      const [v, setV] = React.useState("initial");
      current = v;
      return (
        <lib.NysTextinput
          label="Name"
          value={v}
          onNysInput={(e) => setV(e.detail.value)}
        />
      );
    }
    const container = await render(<Harness />);
    const el = container.querySelector("nys-textinput") as NysTextinputElement;
    await el.updateComplete;
    expect(el.value).toBe("initial");

    await typeInto(el, "typed value");
    expect(current).toBe("typed value");
    expect(el.value).toBe("typed value");
  });

  it("re-setting the same value reverts diverged input", async () => {
    // The value prop never changes; the handler only forces a commit.
    // @lit/react re-sets properties on every commit, so the element
    // snaps back to the controlled value.
    function Locked() {
      const [, force] = React.useReducer((n: number) => n + 1, 0);
      return (
        <lib.NysTextinput label="Locked" value="locked" onNysInput={force} />
      );
    }
    const container = await render(<Locked />);
    const el = container.querySelector("nys-textinput") as NysTextinputElement;
    await el.updateComplete;
    expect(el.value).toBe("locked");

    await typeInto(el, "user typed something else");
    expect(el.value).toBe("locked");
  });
});

describe("nys-checkbox (checked kind)", () => {
  it("checked round-trip", async () => {
    let current = false;
    function Harness() {
      const [checked, setChecked] = React.useState(false);
      current = checked;
      return (
        <lib.NysCheckbox
          label="Agree"
          name="agree"
          value="yes"
          checked={checked}
          onNysChange={(e) => setChecked(e.detail.checked)}
        />
      );
    }
    const container = await render(<Harness />);
    const el = container.querySelector("nys-checkbox") as NysCheckboxElement;
    await el.updateComplete;
    expect(el.checked).toBe(false);

    await act(async () => {
      innerInput(el).click();
    });
    await el.updateComplete;
    expect(current).toBe(true);
    expect(el.checked).toBe(true);
  });
});

describe("nys-radiogroup (group value)", () => {
  it("group value round-trip", async () => {
    let current = "";
    function Harness() {
      const [v, setV] = React.useState("");
      current = v;
      return (
        <lib.NysRadiogroup
          label="Pick one"
          name="pick"
          value={v}
          onNysChange={(e) => setV(e.detail.value)}
        >
          <lib.NysRadiobutton label="Option A" name="pick" value="a" />
          <lib.NysRadiobutton label="Option B" name="pick" value="b" />
        </lib.NysRadiogroup>
      );
    }
    const container = await render(<Harness />);
    const group = container.querySelector(
      "nys-radiogroup"
    ) as NysRadiogroupElement;
    const buttons = Array.from(
      container.querySelectorAll("nys-radiobutton")
    ) as LitLike[];
    await group.updateComplete;
    await Promise.all(buttons.map((b) => b.updateComplete));

    await act(async () => {
      innerInput(buttons[1]).click();
    });
    await group.updateComplete;
    expect(current).toBe("b");
    expect(group.value).toBe("b");
  });
});

describe("nys-checkboxgroup (group value)", () => {
  it("group value round-trip", async () => {
    let current: string[] = [];
    function Harness() {
      const [v, setV] = React.useState<string[]>([]);
      current = v;
      return (
        <lib.NysCheckboxgroup
          label="Pick any"
          name="pickany"
          value={v}
          onNysChange={(e) => setV(e.detail.value)}
        >
          <lib.NysCheckbox label="Option A" name="pickany" value="a" />
          <lib.NysCheckbox label="Option B" name="pickany" value="b" />
        </lib.NysCheckboxgroup>
      );
    }
    const container = await render(<Harness />);
    const group = container.querySelector(
      "nys-checkboxgroup"
    ) as NysCheckboxgroupElement;
    const boxes = Array.from(
      container.querySelectorAll("nys-checkbox")
    ) as LitLike[];
    await group.updateComplete;
    await Promise.all(boxes.map((b) => b.updateComplete));

    await act(async () => {
      innerInput(boxes[0]).click();
    });
    await group.updateComplete;
    expect(current).toEqual(["a"]);
    expect(group.value).toEqual(["a"]);
  });
});

describe("nys-fileinput (files kind)", () => {
  it("files set through setFiles reach the element and the form model", async () => {
    const ref = React.createRef<NysFileinputElement>();
    let fromEvent: File[] | null = null;
    const container = await render(
      <lib.NysFileinput
        ref={ref}
        label="Upload"
        name="upload"
        onNysChange={(e) => {
          fromEvent = e.detail.files;
        }}
      />
    );
    const el = ref.current!;
    expect(el).toBe(container.querySelector("nys-fileinput"));
    await el.updateComplete;

    // Programmatic path: setFiles resolves once validation settles.
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    await act(async () => {
      await el.setFiles([file]);
    });
    await el.updateComplete;
    expect(el.files.map((f: File) => f.name)).toEqual(["hello.txt"]);

    // User path: a change on the hidden input dispatches nys-change.
    const hidden = el.shadowRoot!.querySelector(
      ".hidden-file-input"
    ) as HTMLInputElement;
    const dt = new DataTransfer();
    dt.items.add(new File(["world"], "world.txt", { type: "text/plain" }));
    await act(async () => {
      hidden.files = dt.files;
      hidden.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(fromEvent).not.toBeNull();
    expect(fromEvent!.some((f) => f.name === "world.txt")).toBe(true);
  });
});
