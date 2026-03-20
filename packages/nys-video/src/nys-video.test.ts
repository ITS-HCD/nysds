import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-video.js";
import { NysVideo } from "./nys-video.js";

const VALID_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const VALID_TITLE_TEXT = "Rick Astley - Never Gonna Give You Up";

describe("nys-video", () => {
  it("renders nothing", async () => {
    const el = await fixture<NysVideo>(html`<nys-video></nys-video>`);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".nys-video")).to.be.null;
  });

  it("renders nothing when videourl is invalid", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl="not-a-url"
        titleText=${VALID_TITLE_TEXT}
      ></nys-video>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".nys-video")).to.be.null;
  });

  it("renders the thumbnail when given a valid URL", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
      ></nys-video>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".nys-video")).to.exist;
    expect(el.shadowRoot!.querySelector(".nys-video__thumbnail")).to.exist;
    expect(el.shadowRoot!.querySelector("iframe")).to.be.null;
  });

  it("renders the iframe directly when autoplay is set", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        autoplay
      ></nys-video>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("iframe")).to.exist;
    expect(el.shadowRoot!.querySelector(".nys-video__thumbnail")).to.be.null;
  });

  it("swaps thumbnail for iframe after click", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
      ></nys-video>`,
    );
    await el.updateComplete;

    const thumbnail = el.shadowRoot!.querySelector<HTMLElement>(
      ".nys-video__thumbnail",
    );
    thumbnail!.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector("iframe")).to.exist;
    expect(el.shadowRoot!.querySelector(".nys-video__thumbnail")).to.be.null;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
      ></nys-video>`,
    );
    await el.updateComplete;
    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-video-\d+-\d+$/);
  });

  // ─── Properties & Attributes ──────────────────────────────────────────────
  it("reflects titleText property", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video videourl=${VALID_URL} titleText="My Title"></nys-video>`,
    );
    await el.updateComplete;
    expect(el.titleText).to.equal("My Title");
    expect(
      el.shadowRoot!.querySelector(".nys-video__title-text p")!.textContent,
    ).to.equal("My Title");
  });

  it("does not render title-text element when titleText is empty", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video videourl=${VALID_URL}></nys-video>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".nys-video__title-text")).to.be.null;
  });

  it("reflects size attribute", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        size="contained"
      ></nys-video>`,
    );
    await el.updateComplete;
    expect(el.size).to.equal("contained");
    expect(el.shadowRoot!.querySelector(".nys-video--contained")).to.exist;
  });

  it("reflects disabled attribute", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        disabled
      ></nys-video>`,
    );
    await el.updateComplete;
    expect(el.disabled).to.be.true;
    expect(el.shadowRoot!.querySelector(".nys-video--disabled")).to.exist;
  });

  it("reflects starttime attribute", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        starttime="42"
      ></nys-video>`,
    );
    await el.updateComplete;
    expect(el.starttime).to.equal(42);
  });

  it("reflects loading attribute", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        loading="lazy"
      ></nys-video>`,
    );
    await el.updateComplete;
    expect(el.loading).to.equal("lazy");
  });

  it("uses custom thumbnail when provided", async () => {
    const customThumb =
      "https://plus.unsplash.com/premium_photo-1755883199872-2d31c8b8b012?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        thumbnail=${customThumb}
      ></nys-video>`,
    );
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector<HTMLImageElement>(
      ".nys-video__thumbnail img",
    );
    expect(img!.src).to.equal(customThumb);
  });

  it("falls back to YouTube thumbnail when no custom thumbnail is provided", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
      ></nys-video>`,
    );
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector<HTMLImageElement>(
      ".nys-video__thumbnail img",
    );
    expect(img!.src).to.include("img.youtube.com/vi/dQw4w9WgXcQ");
  });

  // ─── Disabled ─────────────────────────────────────────────────────────────
  it("does not activate player when disabled and thumbnail is clicked", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        disabled
      ></nys-video>`,
    );
    await el.updateComplete;

    const thumbnail = el.shadowRoot!.querySelector<HTMLElement>(
      ".nys-video__thumbnail",
    );
    thumbnail!.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector("iframe")).to.be.null;
    expect(el.shadowRoot!.querySelector(".nys-video__thumbnail")).to.exist;
  });

  it("disables the play button when disabled", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        disabled
      ></nys-video>`,
    );
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(
      ".nys-video__play-icon",
    );
    expect(btn!.disabled).to.be.true;
  });

  // ─── Embed URL ────────────────────────────────────────────────────────────
  it("includes starttime in embed URL when set", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        starttime="30"
        autoplay
      ></nys-video>`,
    );
    await el.updateComplete;
    const iframe = el.shadowRoot!.querySelector<HTMLIFrameElement>("iframe");
    expect(iframe!.src).to.include("start=30");
  });

  it("includes autoplay in iframe's 'allow' attribute when autoplay is set", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
        autoplay
      ></nys-video>`,
    );
    await el.updateComplete;
    const iframe = el.shadowRoot!.querySelector<HTMLIFrameElement>("iframe");
    expect(iframe!.getAttribute("allow")).to.include("autoplay");
  });

  // ─── Accessibility ──────────────────────────────────────────────

  it("passes the a11y audit", async () => {
    const el = await fixture<NysVideo>(
      html`<nys-video
        videourl=${VALID_URL}
        titleText=${VALID_TITLE_TEXT}
      ></nys-video>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
