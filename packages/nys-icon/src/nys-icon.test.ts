import { expect, html, fixture } from "@open-wc/testing";
// Import from dist bundle so the registry, cache, and component share the same module instance.
// The dist bundle's import.meta.url resolves icons correctly from dist/icons/.
import "../dist/nys-icon.js";
import type { NysIcon } from "./nys-icon";

// Dynamic import from dist to get registry/cache functions from the same module instance
let registerIconLibrary: (
  name: string,
  library: { resolver: (name: string) => string | undefined; mutator?: (svg: SVGElement) => void },
) => void;
let unregisterIconLibrary: (name: string) => void;
let clearIconCache: (url?: string) => void;

// Simple SVG for testing custom libraries
const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>`;

function svgDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Helper: wait for async icon load to complete (fetch + Lit re-render)
async function waitForIcon(el: NysIcon): Promise<void> {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 150));
  await el.updateComplete;
}

before(async () => {
  const mod = await import("../dist/nys-icon.js");
  registerIconLibrary = mod.registerIconLibrary;
  unregisterIconLibrary = mod.unregisterIconLibrary;
  clearIconCache = mod.clearIconCache;
});

describe("nys-icon", () => {
  afterEach(() => {
    clearIconCache();
  });

  // renders an SVG icon when 'name' is valid
  it("renders default attributes of SVG icon when 'name' is valid", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="ac_unit"></nys-icon>`,
    );
    await waitForIcon(el);

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
    await waitForIcon(el);
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.classList.contains("nys-icon--2xl")).to.be.true;
  });

  it("falls back to default size when size is not passed", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    await waitForIcon(el);
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.classList.contains("nys-icon--md")).to.be.true;
  });

  it("applies color styles", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" color="red"></nys-icon>`,
    );
    await waitForIcon(el);
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.style.color).to.equal("red");
  });

  it("applies rotation when prop is provided", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" rotate="90"></nys-icon>`,
    );
    await waitForIcon(el);
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.style.rotate).to.equal("90deg");
  });

  it("applies flip when prop is provided", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" flip="horizontal"></nys-icon>`,
    );
    await waitForIcon(el);
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.classList.contains("nys-icon--flip-horizontal")).to.be.true;
  });
});

// Accessibility Tests
describe("nys-icon accessibility", () => {
  afterEach(() => {
    clearIconCache();
  });

  it("sets role to 'img' on the <svg> element", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    await waitForIcon(el);
    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("role")).to.equal("img");
  });

  it("renders nothing when 'name' is not valid", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="unknown_icon_xyz"></nys-icon>`,
    );
    await waitForIcon(el);
    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null;
  });

  it("sets accessibility attributes when 'ariaLabel' is provided", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon ariaLabel="download icon" name="download"></nys-icon>`,
    );
    await waitForIcon(el);
    const svg = el.shadowRoot?.querySelector("svg");

    expect(svg).to.exist;
    expect(svg?.getAttribute("aria-label")).to.equal("download icon");
  });

  it("hides from screen readers when 'ariaLabel' is not provided", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    await waitForIcon(el);
    const svg = el.shadowRoot?.querySelector("svg");

    expect(svg?.getAttribute("aria-hidden")).to.equal("true");
    expect(svg?.getAttribute("aria-label")).to.be.null;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-icon name="check"></nys-icon>`);
    await waitForIcon(el);
    await expect(el).shadowDom.to.be.accessible();
  });
});

// Icon Library Tests
describe("nys-icon library system", () => {
  afterEach(() => {
    clearIconCache();
    // Clean up any test libraries
    unregisterIconLibrary("test-lib");
    unregisterIconLibrary("test-lib-2");
    unregisterIconLibrary("fa-test");
    unregisterIconLibrary("material-test");
  });

  it("renders an icon from a custom registered library", async () => {
    registerIconLibrary("test-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="custom-icon" library="test-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("role")).to.equal("img");
  });

  it("renders nothing for an unregistered library", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon
        name="check"
        library="nonexistent-library"
      ></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null;
  });

  it("switches libraries when library attribute changes", async () => {
    registerIconLibrary("test-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" library="default"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg1 = el.shadowRoot?.querySelector("svg");
    expect(svg1).to.exist;

    // Switch to custom library
    el.library = "test-lib";
    await waitForIcon(el);

    const svg2 = el.shadowRoot?.querySelector("svg");
    expect(svg2).to.exist;
    // The custom library SVG has a circle, not the default NYSDS icon
    expect(svg2?.querySelector("circle")).to.exist;
  });

  it("redraws when a library is re-registered", async () => {
    const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="currentColor"/></svg>`;
    const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>`;

    registerIconLibrary("test-lib", {
      resolver: () => svgDataUri(svg1),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="test-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    let svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.querySelector("rect")).to.exist;

    // Re-register with different SVG — clear cache so new SVG is fetched
    clearIconCache();
    registerIconLibrary("test-lib", {
      resolver: () => svgDataUri(svg2),
    });
    await waitForIcon(el);

    svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.querySelector("circle")).to.exist;
  });

  it("applies mutator function from library", async () => {
    registerIconLibrary("test-lib", {
      resolver: () => svgDataUri(testSvg),
      mutator: (svg) => {
        svg.setAttribute("data-mutated", "true");
      },
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="test-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("data-mutated")).to.equal("true");
  });

  it("handles library resolver returning undefined gracefully", async () => {
    registerIconLibrary("test-lib", {
      resolver: () => undefined,
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="missing" library="test-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null;
  });

  it("loads a Font Awesome style icon from a custom library", async () => {
    // Simulate a Font Awesome-like library using data URI
    const faSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V400 336c0-26.5-21.5-48-48-48H256c-26.5 0-48 21.5-48 48v64 72c0 22.1-17.9 40-40 40H120 96.5c-1.4 0-2.8 0-4.2-.1c-1.1 .1-2.2 .1-3.3 .1H56c-22.1 0-40-17.9-40-40v-8.1c-.3-2.6-.5-5.3-.5-7.9V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>`;

    registerIconLibrary("fa-test", {
      resolver: () => svgDataUri(faSvg),
      mutator: (svg) => {
        svg.setAttribute("fill", "currentColor");
      },
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="house" library="fa-test" size="4xl"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("fill")).to.equal("currentColor");
    expect(svg?.getAttribute("role")).to.equal("img");
    expect(svg?.classList.contains("nys-icon--4xl")).to.be.true;
  });

  it("loads a Material Icons style icon from a custom library", async () => {
    // Simulate a Material Symbols-like library using data URI
    const materialSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>`;

    registerIconLibrary("material-test", {
      resolver: () => svgDataUri(materialSvg),
      mutator: (svg) => {
        svg.setAttribute("fill", "currentColor");
      },
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon
        name="home"
        library="material-test"
        size="4xl"
      ></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("fill")).to.equal("currentColor");
    expect(svg?.getAttribute("role")).to.equal("img");
    expect(svg?.classList.contains("nys-icon--4xl")).to.be.true;
  });
});
