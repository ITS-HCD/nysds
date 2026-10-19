import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-onthispage.js";
import { NysOnthispage } from "./nys-onthispage.js";

// Waits a little so scroll listeners and the MutationObserver can run.
const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

const basicPage = () => html`
  <div>
    <nys-onthispage></nys-onthispage>
    <main>
      <h1>Apply for a permit</h1>
      <h2>Eligibility</h2>
      <p>You must be a New York State resident.</p>
      <h2>How to apply</h2>
      <p>Complete the online form.</p>
      <h2>Required documents</h2>
      <p>Bring a photo ID.</p>
      <h2>What happens next</h2>
      <p>We review applications within 10 business days.</p>
    </main>
  </div>
`;

// A tall page for scroll tests. The spacer keeps every heading below the
// trigger line at the top, and the last section is short on purpose.
const longPage = () => html`
  <div>
    <nys-onthispage></nys-onthispage>
    <div style="height: 1200px;"></div>
    <main>
      <h2>Eligibility</h2>
      <p style="min-height: 1500px;">Eligibility details.</p>
      <h2>How to apply</h2>
      <p style="min-height: 1500px;">Application steps.</p>
      <h2>Required documents</h2>
      <p style="min-height: 1500px;">Document list.</p>
      <h2>What happens next</h2>
      <p style="min-height: 100px;">Next steps.</p>
    </main>
  </div>
`;

describe("nys-onthispage", () => {
  afterEach(() => {
    window.scrollTo(0, 0);
    history.replaceState(null, "", location.pathname + location.search);
  });

  it("renders the component", async () => {
    const el = await fixture(basicPage());
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysOnthispage>(
      html`<nys-onthispage></nys-onthispage>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-onthispage-\d+-\d+$/);
  });

  it("has the expected default values", async () => {
    const el = await fixture<NysOnthispage>(
      html`<nys-onthispage></nys-onthispage>`,
    );
    expect(el.headingTracker).to.equal("h2");
    expect(el.heading).to.equal("On this page");
    expect(el.scope).to.equal("main");
    expect(el.sticky).to.be.false;
    expect(el.offset).to.equal(80);
    expect(el.smoothScroll).to.be.true;
    expect(el.hashBehavior).to.equal("none");
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysOnthispage>(html`
      <nys-onthispage
        heading="In this guide"
        headingTracker="h3"
        scope="#guide"
        offset="24"
        hashBehavior="replace"
        smoothScroll="false"
        sticky
      ></nys-onthispage>
    `);
    expect(el.heading).to.equal("In this guide");
    expect(el.headingTracker).to.equal("h3");
    expect(el.scope).to.equal("#guide");
    expect(el.offset).to.equal(24);
    expect(el.hashBehavior).to.equal("replace");
    expect(el.smoothScroll).to.be.false;
    expect(el.sticky).to.be.true;
  });

  it("renders one link per h2 and skips the h1", async () => {
    const wrapper = await fixture(basicPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const links = el.shadowRoot!.querySelectorAll("a");
    expect(links.length).to.equal(4);
    expect(links[0].textContent?.trim()).to.equal("Eligibility");
    expect(links[0].getAttribute("href")).to.equal("#eligibility");
    expect(links[3].getAttribute("href")).to.equal("#what-happens-next");
  });

  it("renders a custom heading", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-onthispage heading="In this guide"></nys-onthispage>
        <main>
          <h2>One</h2>
          <h2>Two</h2>
        </main>
      </div>
    `);
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const heading = el.shadowRoot!.querySelector("h2");
    expect(heading?.textContent?.trim()).to.equal("In this guide");
  });

  it("tracks the heading level set by headingTracker", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-onthispage headingTracker="h3"></nys-onthispage>
        <main>
          <h2>Part 1</h2>
          <h3>Eligibility</h3>
          <h3>How to apply</h3>
        </main>
      </div>
    `);
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const links = el.shadowRoot!.querySelectorAll("a");
    expect(links.length).to.equal(2);
    expect(links[0].textContent?.trim()).to.equal("Eligibility");
  });

  it("only looks inside the scope", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-onthispage scope="#guide"></nys-onthispage>
        <h2>Outside</h2>
        <article id="guide">
          <h2>Inside one</h2>
          <h2>Inside two</h2>
        </article>
      </div>
    `);
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const links = el.shadowRoot!.querySelectorAll("a");
    expect(links.length).to.equal(2);
    expect(links[0].textContent?.trim()).to.equal("Inside one");
  });

  it("renders nothing with fewer than 2 headings", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-onthispage></nys-onthispage>
        <main><h2>Only one</h2></main>
      </div>
    `);
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector("nav")).to.not.exist;
  });

  it("skips headings marked data-nys-onthispage-ignore", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-onthispage></nys-onthispage>
        <main>
          <h2>Eligibility</h2>
          <h2>How to apply</h2>
          <h2 data-nys-onthispage-ignore>Related links</h2>
        </main>
      </div>
    `);
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll("a").length).to.equal(2);
  });

  it("skips hidden headings and headings inside nys-accordion", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-onthispage></nys-onthispage>
        <main>
          <h2>Eligibility</h2>
          <h2>How to apply</h2>
          <section hidden><h2>Hidden</h2></section>
          <nys-accordion><h2>In accordion</h2></nys-accordion>
        </main>
      </div>
    `);
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll("a").length).to.equal(2);
  });

  it("uses an existing heading id instead of generating one", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-onthispage></nys-onthispage>
        <main>
          <h2 id="custom-id">Eligibility</h2>
          <h2>How to apply</h2>
        </main>
      </div>
    `);
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const link = el.shadowRoot!.querySelector("a");
    expect(link?.getAttribute("href")).to.equal("#custom-id");
  });

  it("adds a number to the id when headings share the same text", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-onthispage></nys-onthispage>
        <main>
          <h2>How to apply</h2>
          <h2>How to apply</h2>
        </main>
      </div>
    `);
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const headings = wrapper.querySelectorAll("h2");
    expect(headings[0].id).to.equal("how-to-apply");
    expect(headings[1].id).to.equal("how-to-apply-2");
  });

  it("cleans punctuation and accents out of generated ids", async () => {
    const wrapper = await fixture(html`
      <div>
        <nys-onthispage></nys-onthispage>
        <main>
          <h2>How to apply!</h2>
          <h2>Café &amp; Résumé</h2>
        </main>
      </div>
    `);
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const headings = wrapper.querySelectorAll("h2");
    expect(headings[0].id).to.equal("how-to-apply");
    expect(headings[1].id).to.equal("cafe-resume");
  });

  it("adds a link when a heading is added to the page", async () => {
    const wrapper = await fixture(basicPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll("a").length).to.equal(4);

    const heading = document.createElement("h2");
    heading.textContent = "Fees";
    wrapper.querySelector("main")!.appendChild(heading);
    await wait();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll("a").length).to.equal(5);
  });

  it("sets scroll-margin-top on headings from offset", async () => {
    const wrapper = await fixture(basicPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const heading = wrapper.querySelector("h2")!;
    expect(getComputedStyle(heading).scrollMarginTop).to.equal("80px");

    el.offset = 24;
    await el.updateComplete;
    expect(getComputedStyle(heading).scrollMarginTop).to.equal("24px");
  });

  it("has no active link until a heading reaches the trigger line", async () => {
    const wrapper = await fixture(longPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll("a.active").length).to.equal(0);
  });

  it("marks the link for the section you scrolled to as active", async () => {
    const wrapper = await fixture(longPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const second = wrapper.querySelectorAll("h2")[1];
    window.scrollTo(
      0,
      second.getBoundingClientRect().top + window.scrollY - el.offset + 2,
    );
    await wait();
    await el.updateComplete;

    const active = el.shadowRoot!.querySelectorAll("a.active");
    expect(active.length).to.equal(1);
    expect(active[0].textContent?.trim()).to.equal("How to apply");
    expect(active[0].getAttribute("aria-current")).to.equal("location");
  });

  it("marks the last link active at the bottom of the page", async () => {
    const wrapper = await fixture(longPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    window.scrollTo(0, document.documentElement.scrollHeight);
    await wait();
    await el.updateComplete;

    const active = el.shadowRoot!.querySelector("a.active");
    expect(active?.textContent?.trim()).to.equal("What happens next");
  });

  it("scrolls to the heading and moves focus when a link is clicked", async () => {
    const wrapper = await fixture(longPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    el.smoothScroll = false;
    await el.updateComplete;

    el.shadowRoot!.querySelectorAll("a")[1].click();
    await el.updateComplete;

    // Browsers land a few pixels apart, so check a range instead of an exact number.
    const heading = wrapper.querySelectorAll("h2")[1];
    const top = heading.getBoundingClientRect().top;
    expect(top).to.be.greaterThan(50); // below the top edge, so the offset was used
    expect(top).to.be.lessThan(150); // and scrolled close to the top

    expect(document.activeElement).to.equal(heading);

    const active = el.shadowRoot!.querySelector("a.active");
    expect(active?.textContent?.trim()).to.equal("How to apply");
  });

  it("fires nys-click with id, label and index", async () => {
    const wrapper = await fixture(longPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    el.smoothScroll = false;
    await el.updateComplete;

    let detail: unknown;
    el.addEventListener("nys-click", (e) => {
      detail = (e as CustomEvent).detail;
    });
    el.shadowRoot!.querySelectorAll("a")[1].click();

    expect(detail).to.deep.equal({
      id: "how-to-apply",
      label: "How to apply",
      index: 1,
    });
  });

  it("leaves the URL alone when hashBehavior is none", async () => {
    const wrapper = await fixture(longPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    el.smoothScroll = false;
    await el.updateComplete;

    el.shadowRoot!.querySelectorAll("a")[1].click();
    expect(location.hash).to.equal("");
  });

  it("updates the hash without a new history entry when hashBehavior is replace", async () => {
    const wrapper = await fixture(longPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    el.smoothScroll = false;
    el.hashBehavior = "replace";
    await el.updateComplete;

    const historyLength = history.length;
    el.shadowRoot!.querySelectorAll("a")[1].click();

    expect(location.hash).to.equal("#how-to-apply");
    expect(history.length).to.equal(historyLength);
  });

  it("updates the hash and adds a history entry when hashBehavior is hash", async () => {
    const wrapper = await fixture(longPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    el.smoothScroll = false;
    el.hashBehavior = "hash";
    await el.updateComplete;

    const historyLength = history.length;
    el.shadowRoot!.querySelectorAll("a")[1].click();

    expect(location.hash).to.equal("#how-to-apply");
    expect(history.length).to.equal(historyLength + 1);
  });

  it("labels the nav with its heading", async () => {
    const wrapper = await fixture(basicPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    const nav = el.shadowRoot!.querySelector("nav")!;
    const labelId = nav.getAttribute("aria-labelledby")!;
    const label = el.shadowRoot!.getElementById(labelId);

    expect(label?.textContent?.trim()).to.equal("On this page");
  });

  it("passes the a11y audit", async () => {
    const wrapper = await fixture(basicPage());
    const el = wrapper.querySelector("nys-onthispage") as NysOnthispage;
    await el.updateComplete;

    await expect(el).shadowDom.to.be.accessible();
  });
});
