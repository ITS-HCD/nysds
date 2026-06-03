import { expect, html, fixture } from "@open-wc/testing";

import "../dist/nys-icon.js";
import type { NysIcon } from "./nys-icon";

// Dynamic import from dist to get registry/cache functions from the same module instance
let registerIconLibrary: (
  name: string,
  library: {
    resolver: (name: string) => string | undefined;
    mutator?: (svg: SVGElement) => void;
  },
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
  // Poll until the SVG appears (max 2s) to handle async file fetches across browsers.
  for (let i = 0; i < 40; i++) {
    await new Promise<void>((r) => setTimeout(r, 50));
    await el.updateComplete;
    if (el.shadowRoot?.querySelector("svg") !== null) break;
  }
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
      html`<nys-icon name="check" library="nonexistent-library"></nys-icon>`,
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

// Font Awesome library tests
describe("nys-icon — Font Awesome library", () => {
  const houseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path data-icon="house" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2H416V336h-80v112H160V287.6H32c-18 0-32-14-32-32.1L266.4 8 564.8 231.5c8 7 12 15 11 24z"/></svg>`;
  const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path data-icon="user" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`;

  const faResolver = (name: string): string | undefined => {
    if (name === "house") return svgDataUri(houseSvg);
    if (name === "user") return svgDataUri(userSvg);
    return undefined;
  };

  afterEach(() => {
    clearIconCache();
    unregisterIconLibrary("fa-icons");
  });

  it('renders "house" icon with correct SVG content', async () => {
    registerIconLibrary("fa-icons", {
      resolver: faResolver,
      mutator: (svg) => svg.setAttribute("fill", "currentColor"),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="house" library="fa-icons"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.querySelector("path[data-icon='house']")).to.exist;
  });

  it('renders "user" icon with correct SVG content', async () => {
    registerIconLibrary("fa-icons", {
      resolver: faResolver,
      mutator: (svg) => svg.setAttribute("fill", "currentColor"),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="user" library="fa-icons"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.querySelector("path[data-icon='user']")).to.exist;
  });

  it("applies the FA mutator (sets fill=currentColor)", async () => {
    registerIconLibrary("fa-icons", {
      resolver: faResolver,
      mutator: (svg) => svg.setAttribute("fill", "currentColor"),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="house" library="fa-icons"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.getAttribute("fill")).to.equal("currentColor");
  });

  it("renders nothing for an unrecognized FA icon name", async () => {
    registerIconLibrary("fa-icons", {
      resolver: faResolver,
      mutator: (svg) => svg.setAttribute("fill", "currentColor"),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="unknown-fa-icon" library="fa-icons"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null;
  });
});

// Material Icons library tests
describe("nys-icon — Material Icons library", () => {
  const homeSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path data-icon="home" d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>`;
  const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path data-icon="star" d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM480-200l-168 102 45-190-149-129 196-17 76-180 76 180 196 17-149 130 45 190L480-200Zm0-280Z"/></svg>`;

  const materialResolver = (name: string): string | undefined => {
    if (name === "home") return svgDataUri(homeSvg);
    if (name === "star") return svgDataUri(starSvg);
    return undefined;
  };

  afterEach(() => {
    clearIconCache();
    unregisterIconLibrary("material-icons");
  });

  it('renders "home" icon with correct SVG content', async () => {
    registerIconLibrary("material-icons", {
      resolver: materialResolver,
      mutator: (svg) => svg.setAttribute("fill", "currentColor"),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="home" library="material-icons"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.querySelector("path[data-icon='home']")).to.exist;
  });

  it('renders "star" icon with correct SVG content', async () => {
    registerIconLibrary("material-icons", {
      resolver: materialResolver,
      mutator: (svg) => svg.setAttribute("fill", "currentColor"),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="star" library="material-icons"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.querySelector("path[data-icon='star']")).to.exist;
  });

  it("applies the Material mutator (sets fill=currentColor)", async () => {
    registerIconLibrary("material-icons", {
      resolver: materialResolver,
      mutator: (svg) => svg.setAttribute("fill", "currentColor"),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="home" library="material-icons"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.getAttribute("fill")).to.equal("currentColor");
  });

  it("renders nothing for an unrecognized Material icon name", async () => {
    registerIconLibrary("material-icons", {
      resolver: materialResolver,
      mutator: (svg) => svg.setAttribute("fill", "currentColor"),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="unknown-material-icon" library="material-icons"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null;
  });
});

// Fetch failure tests
describe("nys-icon — fetch failure", () => {
  afterEach(() => {
    clearIconCache();
    unregisterIconLibrary("bad-lib");
  });

  it("renders nothing when the resolver returns an invalid URL", async () => {
    registerIconLibrary("bad-lib", {
      resolver: () => "data:image/svg+xml,INVALID_SVG_CONTENT_NOT_PARSEABLE!!!",
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="some-icon" library="bad-lib"></nys-icon>`,
    );
    // Wait generously for the fetch + error path to complete
    await el.updateComplete;
    for (let i = 0; i < 40; i++) {
      await new Promise<void>((r) => setTimeout(r, 50));
      await el.updateComplete;
    }

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null;
  });
});

// Stale fetch cancellation tests
describe("nys-icon — stale fetch cancellation", () => {
  afterEach(() => {
    clearIconCache();
    unregisterIconLibrary("seq-lib");
  });

  it("discards a stale fetch when name changes synchronously", async () => {
    const rectSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect data-shape="rect" width="24" height="24"/></svg>`;
    const circleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle data-shape="circle" cx="12" cy="12" r="12"/></svg>`;

    registerIconLibrary("seq-lib", {
      resolver: (name) => {
        if (name === "icon-a") return svgDataUri(rectSvg);
        if (name === "icon-b") return svgDataUri(circleSvg);
        return undefined;
      },
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon-a" library="seq-lib"></nys-icon>`,
    );

    // Synchronously change to icon-b before icon-a fetch resolves
    el.name = "icon-b";

    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    // Only icon-b (circle) should be rendered; icon-a (rect) was stale
    expect(svg?.querySelector("[data-shape='circle']")).to.exist;
    expect(svg?.querySelector("[data-shape='rect']")).to.be.null;
  });
});

// Visual prop updates after load tests
describe("nys-icon — visual prop updates after load", () => {
  afterEach(() => {
    clearIconCache();
    unregisterIconLibrary("prop-lib");
  });

  it("updates aria-label without re-fetching the SVG", async () => {
    registerIconLibrary("prop-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="prop-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svgBefore = el.shadowRoot?.querySelector("svg");
    expect(svgBefore?.getAttribute("aria-hidden")).to.equal("true");
    expect(svgBefore?.getAttribute("aria-label")).to.be.null;

    // Set ariaLabel
    el.ariaLabel = "descriptive label";
    await el.updateComplete;

    const svgAfter = el.shadowRoot?.querySelector("svg");
    expect(svgAfter?.getAttribute("aria-label")).to.equal("descriptive label");
    expect(svgAfter?.hasAttribute("aria-hidden")).to.be.false;

    // Clear ariaLabel — should revert to aria-hidden
    el.ariaLabel = "";
    await el.updateComplete;

    const svgFinal = el.shadowRoot?.querySelector("svg");
    expect(svgFinal?.getAttribute("aria-hidden")).to.equal("true");
    expect(svgFinal?.getAttribute("aria-label")).to.be.null;
  });

  it("updates rotation without re-fetching", async () => {
    registerIconLibrary("prop-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="prop-lib" rotate="0"></nys-icon>`,
    );
    await waitForIcon(el);

    el.rotate = "180";
    await el.updateComplete;

    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.style.rotate).to.equal("180deg");
  });

  it("updates color without re-fetching", async () => {
    registerIconLibrary("prop-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="prop-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    el.color = "blue";
    await el.updateComplete;

    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.style.color).to.equal("blue");
  });

  it("adds flip class without re-fetching", async () => {
    registerIconLibrary("prop-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="prop-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    el.flip = "vertical";
    await el.updateComplete;

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.classList.contains("nys-icon--flip-vertical")).to.be.true;
  });

  it("adds new size class when size changes (classList.add is cumulative)", async () => {
    registerIconLibrary("prop-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="prop-lib" size="md"></nys-icon>`,
    );
    await waitForIcon(el);

    const svgBefore = el.shadowRoot?.querySelector("svg");
    expect(svgBefore?.classList.contains("nys-icon--md")).to.be.true;

    el.size = "xl";
    await el.updateComplete;

    const svgAfter = el.shadowRoot?.querySelector("svg");
    expect(svgAfter?.classList.contains("nys-icon--xl")).to.be.true;
  });
});

// Pixel sizes tests
describe("nys-icon — pixel sizes", () => {
  afterEach(() => {
    clearIconCache();
    unregisterIconLibrary("px-lib");
  });

  it('applies class "nys-icon--12" for size="12"', async () => {
    registerIconLibrary("px-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="px-lib" size="12"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.classList.contains("nys-icon--12")).to.be.true;
  });

  it('applies class "nys-icon--24" for size="24"', async () => {
    registerIconLibrary("px-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="px-lib" size="24"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.classList.contains("nys-icon--24")).to.be.true;
  });

  it('applies class "nys-icon--50" for size="50"', async () => {
    registerIconLibrary("px-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="px-lib" size="50"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.classList.contains("nys-icon--50")).to.be.true;
  });
});

// DOMPurify branch coverage tests
// These test specific internal branches in the bundled DOMPurify 3.x code.
describe("nys-icon — DOMPurify branch coverage", () => {
  afterEach(() => {
    clearIconCache();
    unregisterIconLibrary("branch-lib");
  });

  // --- Comment node branches (be() function) ---

  // Exercises: ft && t.nodeType === F.comment && b(/<[/\w]/g, t.data) → TRUE path (early removal)
  it("removes SVG comments whose data contains HTML markup (early-return path in be())", async () => {
    const svgWithBadComment = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><!-- <script>alert('xss')</script> --><circle cx="12" cy="12" r="10"/></svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithBadComment),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const hasScriptComment = Array.from(svg?.childNodes ?? []).some(
      (n) =>
        n.nodeType === Node.COMMENT_NODE &&
        (n as Comment).data?.includes("<script>"),
    );
    expect(hasScriptComment).to.be.false;
    expect(svg?.querySelector("circle")).to.exist;
  });

  // Exercises: ft && t.nodeType === F.comment && b(/<[/\w]/g, t.data) → FALSE path (falls through to tag-not-allowed removal)
  it("removes safe comments (no HTML markup) via the generic tag-not-allowed path", async () => {
    const svgWithSafeComment = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><!-- safe metadata --><circle data-safe="yes" cx="12" cy="12" r="10"/></svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithSafeComment),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const hasAnyComment = Array.from(svg?.childNodes ?? []).some(
      (n) => n.nodeType === Node.COMMENT_NODE,
    );
    expect(hasAnyComment).to.be.false;
    expect(svg?.querySelector("circle")).to.exist;
  });

  // --- data-* attribute branch (Re() function) ---

  // Exercises: Ht && !It[n] && b(tn, n) → TRUE path (data-* allowed through)
  it("preserves data-* attributes on SVG elements (ALLOW_DATA_ATTR branch)", async () => {
    const svgWithData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle data-icon="my-icon" data-size="24" cx="12" cy="12" r="10"/></svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithData),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const circle = el.shadowRoot?.querySelector("circle");
    expect(circle).to.exist;
    expect(circle?.getAttribute("data-icon")).to.equal("my-icon");
    expect(circle?.getAttribute("data-size")).to.equal("24");
  });

  // --- aria-* attribute branch (Re() function) ---

  // Exercises: le && b(en, n) → TRUE path (aria-* allowed through)
  it("preserves aria-* attributes on SVG child elements (ALLOW_ARIA_ATTR branch)", async () => {
    const svgWithAria = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g aria-label="shapes group" aria-hidden="false"><circle cx="12" cy="12" r="10"/></g></svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithAria),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const g = el.shadowRoot?.querySelector("g");
    expect(g).to.exist;
    expect(g?.getAttribute("aria-label")).to.equal("shapes group");
    expect(g?.getAttribute("aria-hidden")).to.equal("false");
  });

  // --- svgFilters profile branch (Kt() function) ---

  // Exercises: Z.svgFilters === true → c(g, te) (filter elements added to allowed-tags set)
  it("preserves SVG filter primitive elements allowed by the svgFilters profile", async () => {
    const svgWithFilter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <defs><filter id="f1">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
        <feBlend in="SourceGraphic" in2="blur" mode="multiply"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter></defs>
      <circle cx="12" cy="12" r="10" filter="url(#f1)"/>
    </svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithFilter),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.querySelector("feGaussianBlur")).to.exist;
    expect(svg?.querySelector("feBlend")).to.exist;
    expect(svg?.querySelector("feColorMatrix")).to.exist;
  });

  // --- FORBID_ATTR branches ---

  // Exercises: It[n] → TRUE for "onbegin"
  it("strips onbegin event handler from SVG animation elements", async () => {
    const svgWithOnbegin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10">
        <animateMotion dur="1s" onbegin="alert('xss')" repeatCount="indefinite"/>
      </circle>
    </svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithOnbegin),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const animateMotion = svg?.querySelector("animateMotion");
    if (animateMotion) {
      expect(animateMotion.hasAttribute("onbegin")).to.be.false;
    }
  });

  // Exercises: It[n] → TRUE for "xlink:href" (namespaced attribute)
  it("strips xlink:href attribute from image elements via FORBID_ATTR", async () => {
    const svgWithXlinkHref = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
      <image xlink:href="//evil.com/payload.svg" width="24" height="24"/>
      <circle cx="12" cy="12" r="10"/>
    </svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithXlinkHref),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const image = svg?.querySelector("image");
    if (image) {
      expect(image.hasAttribute("xlink:href")).to.be.false;
      expect(
        image.getAttributeNS("http://www.w3.org/1999/xlink", "href"),
      ).to.be.null;
    }
  });

  // --- URL validation branch (Re() function) ---

  // Exercises: !$t[n] → !b(se, value) → if (o) return false (URI validation strips bad scheme)
  it("strips SVG attributes whose values use a javascript: URI scheme", async () => {
    const svgWithJsUri = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="javascript:evil()"/>
    </svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithJsUri),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const circle = svg?.querySelector("circle");
    expect(circle).to.exist;
    expect(circle?.getAttribute("fill") ?? "").to.not.include("javascript");
  });

  // --- Attribute value HTML-close-tag branch (we() function) ---

  // Exercises: ft && b(/((--!?|])>)|<\/(style|script|...)/i, S) → attribute stripped
  it("strips attributes whose values contain HTML close-tag sequences (SAFE_FOR_XML check)", async () => {
    const svgWithBadAttrValue = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" data-desc="text</style>injection"/>
    </svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithBadAttrValue),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const circle = svg?.querySelector("circle");
    expect(circle).to.exist;
    expect(circle?.getAttribute("data-desc") ?? "").to.not.include("</style>");
  });

  // --- attributeName="href" mXSS protection branch (we() function) ---

  // Exercises: v === "attributename" && xe(S, "href") → attribute stripped
  it("strips attributeName attribute when its value contains 'href' (mXSS protection)", async () => {
    const svgWithAttrNameHref = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10">
        <animateTransform attributeName="href" type="translate" from="0 0" to="10 10" dur="1s"/>
      </circle>
    </svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithAttrNameHref),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const animateTransform = svg?.querySelector("animateTransform");
    if (animateTransform) {
      expect(animateTransform.hasAttribute("attributeName")).to.be.false;
      expect(animateTransform.hasAttribute("attributename")).to.be.false;
    }
  });

  // --- SANITIZE_DOM / DOM-clobbering branch (Re() function) ---

  // Exercises: ue && (n === "id") && (o in document) → attribute stripped
  it("strips id attributes whose value shadows a document property (DOM-clobbering protection)", async () => {
    // 'body' is a property of document so id="body" would clobber document.body
    const svgWithClobberingId = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle id="body" cx="12" cy="12" r="10"/>
    </svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgWithClobberingId),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const circle = svg?.querySelector("circle");
    expect(circle).to.exist;
    expect(circle?.hasAttribute("id")).to.be.false;
  });

  // --- Multiple forbidden attributes on a single element ---

  it("strips all forbidden attributes when several are present on the same element", async () => {
    const svgMultiForbidden = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" onload="evil()" onerror="evil()" onbegin="evil()"/>
    </svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(svgMultiForbidden),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const circle = svg?.querySelector("circle");
    expect(circle).to.exist;
    expect(circle?.hasAttribute("onload")).to.be.false;
    expect(circle?.hasAttribute("onerror")).to.be.false;
    expect(circle?.hasAttribute("onbegin")).to.be.false;
    expect(circle?.getAttribute("cx")).to.equal("12");
  });

  // --- Mixed safe + unsafe content ---

  it("preserves allowed SVG elements while stripping all forbidden ones in a mixed document", async () => {
    const mixedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle data-keep="yes" cx="12" cy="12" r="10"/>
      <script>alert('xss')<\/script>
      <use href="//evil.com/x.svg"/>
      <path d="M0 0 L24 24" stroke="black"/>
    </svg>`;
    registerIconLibrary("branch-lib", {
      resolver: () => svgDataUri(mixedSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="branch-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.querySelector("circle")).to.exist;
    expect(svg?.querySelector("path")).to.exist;
    expect(svg?.querySelector("circle")?.getAttribute("data-keep")).to.equal(
      "yes",
    );
    expect(svg?.querySelector("script")).to.be.null;
    expect(svg?.querySelector("use")).to.be.null;
  });
});

// DOMPurify sanitization tests
describe("nys-icon — DOMPurify sanitization", () => {
  afterEach(() => {
    clearIconCache();
    unregisterIconLibrary("sanitize-lib");
  });

  it("strips <script> tags embedded in SVG content", async () => {
    const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><script>alert('xss')<\/script></svg>`;
    registerIconLibrary("sanitize-lib", {
      resolver: () => svgDataUri(maliciousSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="sanitize-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.querySelector("script")).to.be.null;
  });

  it("strips onload event handler attributes from the <svg> element", async () => {
    const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg" onload="alert('xss')" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`;
    registerIconLibrary("sanitize-lib", {
      resolver: () => svgDataUri(maliciousSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="sanitize-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.hasAttribute("onload")).to.be.false;
  });

  it("strips onerror event handler attributes from SVG child elements", async () => {
    const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><image onerror="alert('xss')" href="x"/><circle cx="12" cy="12" r="10"/></svg>`;
    registerIconLibrary("sanitize-lib", {
      resolver: () => svgDataUri(maliciousSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="sanitize-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const image = svg?.querySelector("image");
    if (image) {
      expect(image.hasAttribute("onerror")).to.be.false;
    }
  });

  it("strips <use> elements that could reference external resources", async () => {
    const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><use href="//evil.com/payload.svg"/><circle cx="12" cy="12" r="10"/></svg>`;
    registerIconLibrary("sanitize-lib", {
      resolver: () => svgDataUri(maliciousSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="sanitize-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.querySelector("use")).to.be.null;
  });

  it("strips href attributes from SVG anchor elements", async () => {
    const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><a href="javascript:alert('xss')"><circle cx="12" cy="12" r="10"/></a></svg>`;
    registerIconLibrary("sanitize-lib", {
      resolver: () => svgDataUri(maliciousSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="sanitize-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    const anchor = svg?.querySelector("a");
    if (anchor) {
      expect(anchor.hasAttribute("href")).to.be.false;
    }
  });

  it("preserves safe SVG content after sanitization", async () => {
    const safeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle data-shape="circle" cx="12" cy="12" r="10" fill="blue"/></svg>`;
    registerIconLibrary("sanitize-lib", {
      resolver: () => svgDataUri(safeSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="sanitize-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.querySelector("[data-shape='circle']")).to.exist;
  });
});

// HTTP fetch error tests
describe("nys-icon — HTTP fetch errors", () => {
  let originalFetch: typeof window.fetch;

  beforeEach(() => {
    originalFetch = window.fetch;
  });

  afterEach(() => {
    window.fetch = originalFetch;
    clearIconCache();
    unregisterIconLibrary("error-lib");
  });

  it("renders nothing when the server returns a non-OK HTTP status", async () => {
    window.fetch = async () => new Response("Not Found", { status: 404 });

    registerIconLibrary("error-lib", {
      resolver: () => "https://example.invalid/icon.svg",
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="error-lib"></nys-icon>`,
    );
    await el.updateComplete;
    for (let i = 0; i < 20; i++) {
      await new Promise<void>((r) => setTimeout(r, 50));
      await el.updateComplete;
    }

    expect(el.shadowRoot?.querySelector("svg")).to.be.null;
  });

  it("renders nothing when the server returns non-SVG content", async () => {
    window.fetch = async () =>
      new Response("<p>This is not SVG content</p>", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });

    registerIconLibrary("error-lib", {
      resolver: () => "https://example.invalid/not-svg.svg",
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="error-lib"></nys-icon>`,
    );
    await el.updateComplete;
    for (let i = 0; i < 20; i++) {
      await new Promise<void>((r) => setTimeout(r, 50));
      await el.updateComplete;
    }

    expect(el.shadowRoot?.querySelector("svg")).to.be.null;
  });
});

// Flip direction tests
describe("nys-icon — flip directions", () => {
  afterEach(() => {
    clearIconCache();
    unregisterIconLibrary("flip-lib");
  });

  it('applies "nys-icon--flip-vertical" class for flip="vertical"', async () => {
    registerIconLibrary("flip-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="flip-lib" flip="vertical"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.classList.contains("nys-icon--flip-vertical")).to.be.true;
  });

  it('applies "nys-icon--flip-horizontal" class for flip="horizontal"', async () => {
    registerIconLibrary("flip-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="flip-lib" flip="horizontal"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.classList.contains("nys-icon--flip-horizontal")).to.be.true;
  });

  it("does not apply any flip class when flip is not set", async () => {
    registerIconLibrary("flip-lib", {
      resolver: () => svgDataUri(testSvg),
    });

    const el = await fixture<NysIcon>(
      html`<nys-icon name="icon" library="flip-lib"></nys-icon>`,
    );
    await waitForIcon(el);

    const svg = el.shadowRoot?.querySelector("svg");
    const classes = Array.from(svg?.classList ?? []);
    const flipClasses = classes.filter((c) => c.startsWith("nys-icon--flip-"));
    expect(flipClasses).to.have.length(0);
  });
});
