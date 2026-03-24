import { expect, html, fixture } from "@open-wc/testing";
import type { NysIcon } from "./nys-icon";
// Import the built bundle to register the <nys-icon> custom element.
// (Source .ts has SCSS imports that the test runner's esbuild cannot handle.)
import "../dist/nys-icon.js";
// Import registry functions from source — the globalThis-backed singleton
// ensures these write to the same Map the dist bundle's component reads from.
import {
  registerIconLibrary,
  unregisterIconLibrary,
} from "./nys-icon.registry";

describe("nys-icon", () => {
  // renders an SVG icon when 'name' is valid
  it("renders default attributes of SVG icon when 'name' is valid", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="ac_unit"></nys-icon>`,
    );
    await el.iconLoaded;

    expect(el.name).to.equal("ac_unit");

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.classList.contains("nys-icon--md")).to.be.true;
    expect(svg?.classList.contains("nys-icon--flip-")).to.be.false;
    expect(svg?.style.color).to.equal("currentcolor"); // Default color
    expect(svg?.style.rotate).to.equal("0deg");
  });

  it("applies size class based on size property", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" size="2xl"></nys-icon>`,
    );
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.classList.contains("nys-icon--2xl")).to.be.true;
  });

  it("falls back to default size when size is not passed", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.classList.contains("nys-icon--md")).to.be.true;
  });

  it("applies color styles", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" color="red"></nys-icon>`,
    );
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.style.color).to.equal("red");
  });

  it("applies rotation when prop is provided", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" rotate="90"></nys-icon>`,
    );
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.style.rotate).to.equal("90deg");
  });

  it("applies flip when prop is provided", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" flip="horizontal"></nys-icon>`,
    );
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.classList.contains("nys-icon--flip-horizontal")).to.be.true;
  });
});

// Accessibility Tests
/*
 * Ensure that the <nys-icon> component's aria is set correctly:
 * - role is set to "img" on the <svg> element.
 * - aria-label is set correctly on the <svg> element.
 * - aria-hidden is set correctly on the <svg> element.
 */
describe("nys-icon", () => {
  it("sets role to 'img' on the <svg> element", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("role")).to.equal("img");
  });

  it("renders nothing when 'name' is not valid", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="unknown"></nys-icon>`,
    );
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null;
  });

  it("sets accessibility attributes when 'ariaLabel' is provided", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon ariaLabel="download icon" name="download"></nys-icon>`,
    );
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg");

    expect(svg).to.exist;
    expect(svg?.getAttribute("aria-label")).to.equal("download icon");
  });

  it("hides from screen readers when 'ariaLabel' is not provided", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg");

    expect(svg?.getAttribute("aria-hidden")).to.equal("true");
    expect(svg?.getAttribute("aria-label")).to.be.null;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-unavfooter></nys-unavfooter>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});

// Fetch & Cache Tests
describe("nys-icon fetch behavior", () => {
  it("dispatches nys-icon-error event for invalid icon names", async () => {
    let errorDetail: { name: string; library: string } | null = null;
    const el = await fixture<NysIcon>(
      html`<nys-icon
        name="nonexistent_icon_xyz"
        @nys-icon-error=${(e: CustomEvent) => {
          errorDetail = e.detail;
        }}
      ></nys-icon>`,
    );
    await el.iconLoaded;
    expect(errorDetail).to.not.be.null;
    expect(errorDetail!.name).to.equal("nonexistent_icon_xyz");
  });

  it("shares fetch cache across instances", async () => {
    const el1 = await fixture<NysIcon>(
      html`<nys-icon name="check"></nys-icon>`,
    );
    const el2 = await fixture<NysIcon>(
      html`<nys-icon name="check"></nys-icon>`,
    );
    await el1.iconLoaded;
    await el2.iconLoaded;

    const svg1 = el1.shadowRoot?.querySelector("svg");
    const svg2 = el2.shadowRoot?.querySelector("svg");
    expect(svg1).to.exist;
    expect(svg2).to.exist;
  });
});

// Library Registry Tests
describe("nys-icon library registry", () => {
  // Helper: base URL for the test server serving dist/icons/
  const testIconsBase = new URL("../dist/icons/", import.meta.url).href;

  afterEach(() => {
    // Clean up any test libraries registered during tests.
    // Use try/catch because unregister warns on "default".
    try {
      unregisterIconLibrary("test-lib");
    } catch {
      /* noop */
    }
    try {
      unregisterIconLibrary("mutator-lib");
    } catch {
      /* noop */
    }
    try {
      unregisterIconLibrary("late-lib");
    } catch {
      /* noop */
    }
  });

  it("library attribute defaults to 'default'", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    expect(el.library).to.equal("default");
  });

  it("default library still works unchanged", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    await el.iconLoaded;
    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("role")).to.equal("img");
  });

  it("renders icon from a custom library", async () => {
    // Register a custom library that resolves to the same built-in icons.
    registerIconLibrary("test-lib", {
      resolver: (name) => `${testIconsBase}${name}.svg`,
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon library="test-lib" name="check"></nys-icon>`,
    );
    await el.iconLoaded;

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("role")).to.equal("img");
  });

  it("applies mutator from custom library", async () => {
    registerIconLibrary("mutator-lib", {
      resolver: (name) => `${testIconsBase}${name}.svg`,
      mutator: (svg) => svg.setAttribute("data-mutated", "true"),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon library="mutator-lib" name="check"></nys-icon>`,
    );
    await el.iconLoaded;

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("data-mutated")).to.equal("true");
  });

  it("re-renders when library is registered after mount", async () => {
    // Mount icon BEFORE registering the library — should initially be empty.
    const el = await fixture<NysIcon>(
      html`<nys-icon library="late-lib" name="check"></nys-icon>`,
    );
    await el.iconLoaded;

    let svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null; // Library not yet registered.

    // Now register the library — the icon should auto-render.
    registerIconLibrary("late-lib", {
      resolver: (name) => `${testIconsBase}${name}.svg`,
    });
    await el.iconLoaded;

    svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
  });

  it("dispatches error for unknown library", async () => {
    let errorDetail: { name: string; library: string } | null = null;
    const el = await fixture<NysIcon>(
      html`<nys-icon
        library="nonexistent"
        name="check"
        @nys-icon-error=${(e: CustomEvent) => {
          errorDetail = e.detail;
        }}
      ></nys-icon>`,
    );
    await el.iconLoaded;

    expect(errorDetail).to.not.be.null;
    expect(errorDetail!.library).to.equal("nonexistent");
    expect(errorDetail!.name).to.equal("check");
  });

  it("unregister clears rendered icons", async () => {
    registerIconLibrary("test-lib", {
      resolver: (name) => `${testIconsBase}${name}.svg`,
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon library="test-lib" name="check"></nys-icon>`,
    );
    await el.iconLoaded;

    let svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;

    // Unregister — icon should clear.
    unregisterIconLibrary("test-lib");
    await el.iconLoaded;

    svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null;
  });
});
