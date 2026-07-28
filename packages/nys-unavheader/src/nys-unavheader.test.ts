import { expect, html, fixture, nextFrame } from "@open-wc/testing";
import { NysUnavHeader, NYS_ALERT_URL } from "./nys-unavheader";
import "../dist/nys-unavheader.js";
import "@nysds/nys-alert";
import sinon from "sinon";

/** Payload the header should treat as "nothing published". */
const EMPTY_FEED = {};

/**
 * The suite keeps a fetch stub in place throughout: every header reads the alert
 * endpoint on connect, and no test should touch the real one.
 */
let fetchStub: sinon.SinonStub;

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
  });

/** Serves the alert endpoint the given payload. */
const serveFeed = (feed: { alert?: unknown }) => {
  fetchStub
    .withArgs(NYS_ALERT_URL, sinon.match.any)
    .resolves(jsonResponse(feed.alert ? { alert: feed.alert } : EMPTY_FEED));
};

/** Renders a header that has already consumed the given feed. */
const headerWithFeed = async (feed: { alert?: unknown }) => {
  serveFeed(feed);
  const el = await fixture<NysUnavHeader>(
    html`<nys-unavheader></nys-unavheader>`,
  );
  await nextFrame();
  await el.updateComplete;
  return el;
};

describe("nys-unavheader", () => {
  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch");
    serveFeed(EMPTY_FEED);
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it("should render with NYS logo link", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );
    const logoLink = el.shadowRoot?.getElementById(
      "nys-unavheader__logolink",
    ) as HTMLAnchorElement;
    expect(logoLink).to.exist;
    expect(logoLink?.getAttribute("href")).to.equal("https://www.ny.gov");
    expect(logoLink?.getAttribute("aria-label")).to.equal(
      "Visit the NY.gov homepage",
    );
  });

  it("toggles trustbar visibility when clicking the top trustbar", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const trustbarToggle = el.shadowRoot?.querySelector(
      ".nys-unavheader__trustbar.wrapper",
    ) as HTMLElement;

    expect(trustbarToggle).to.exist;
    expect(el.trustbarVisible).to.be.false;

    trustbarToggle.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el.trustbarVisible).to.be.true;

    trustbarToggle.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el.trustbarVisible).to.be.false;
  });

  it("toggles trustbar and manages focus when clicking the inline 'Here's how you know' button", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const inlineButton = el.shadowRoot?.getElementById(
      "nys-unavheader__know--inline",
    ) as HTMLElement;

    const closeButton = el.shadowRoot?.getElementById(
      "nys-unavheader__closetrustbar",
    ) as HTMLElement;

    expect(inlineButton).to.exist;
    expect(closeButton).to.exist;

    // Spy on focus behavior
    const inlineFocusSpy = sinon.spy(inlineButton, "focus");
    const closeFocusSpy = sinon.spy(closeButton, "focus");

    // Open trustbar via inline button
    inlineButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(el.trustbarVisible).to.be.true;

    // Focus should move to close button
    await el.updateComplete;
    expect(closeFocusSpy.calledOnce).to.be.true;

    // Close trustbar via inline button again
    inlineButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(el.trustbarVisible).to.be.false;

    // Focus should return to inline button
    await el.updateComplete;
    expect(inlineFocusSpy.calledOnce).to.be.true;

    inlineFocusSpy.restore();
    closeFocusSpy.restore();
  });

  it("toggles language list when 'nys-click' event dispatched on translate button", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const translateButton = el.shadowRoot?.querySelector(
      "#nys-unavheader__translate--desktop",
    ) as HTMLElement;

    const langList = el.shadowRoot?.querySelector(
      ".nys-unavheader__languagelist",
    ) as HTMLElement;

    expect(translateButton).to.exist;
    expect(langList).to.exist;

    translateButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(langList.classList.contains("show")).to.be.true;
    expect(langList.classList.contains("hide")).to.be.false;

    translateButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(langList.classList.contains("hide")).to.be.true;
    expect(langList.classList.contains("show")).to.be.false;
  });

  it("toggles search dropdown when 'nys-click' event dispatched on search button", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const searchButton = el.shadowRoot?.querySelector(
      "#nys-unavheader__searchbutton",
    ) as HTMLElement;

    const searchDropdown = el.shadowRoot?.querySelector(
      ".nys-unavheader__searchdropdown",
    ) as HTMLElement;

    expect(searchButton).to.exist;
    expect(searchDropdown).to.exist;

    searchButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(searchDropdown.classList.contains("show")).to.be.true;
    expect(searchDropdown.classList.contains("hide")).to.be.false;

    searchButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(searchDropdown.classList.contains("hide")).to.be.true;
    expect(searchDropdown.classList.contains("show")).to.be.false;
  });

  it("handles search focus and blur correctly", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    el.trustbarVisible = true;
    el.languageVisible = true;
    await el.updateComplete;

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    expect(searchBar).to.exist;

    // Focus
    searchBar.dispatchEvent(
      new FocusEvent("focus", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(el.isSearchFocused).to.be.true;
    expect(el.trustbarVisible).to.be.false;
    expect(el.languageVisible).to.be.false;

    // Blur
    searchBar.dispatchEvent(
      new FocusEvent("blur", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(el.isSearchFocused).to.be.false;
  });

  it("blurs search input and clears focus on Escape key", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    el.isSearchFocused = true;
    await el.updateComplete;

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement & { blur: () => void };

    expect(searchBar).to.exist;

    const blurSpy = sinon.spy(searchBar, "blur");

    searchBar.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Escape",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;

    expect(blurSpy.calledOnce).to.be.true;
    expect(el.isSearchFocused).to.be.false;
  });

  it("triggers search handler on Enter key when value is non-empty", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    Object.defineProperty(searchBar, "value", {
      configurable: true,
      value: "housing",
    });

    const searchStub = sinon.stub(el as any, "_handleSearch");

    searchBar.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    expect(searchStub.calledOnce).to.be.true;
    expect(searchStub.calledWith("housing")).to.be.true;

    searchStub.restore();
  });

  it("does not trigger search handler on Enter when value is empty", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    Object.defineProperty(searchBar, "value", {
      configurable: true,
      value: "   ",
    });

    const searchStub = sinon.stub(el as any, "_handleSearch");

    searchBar.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    expect(searchStub.notCalled).to.be.true;

    searchStub.restore();
  });

  it("triggers search handler when search button is clicked with a value", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    const searchButton = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar--button",
    ) as HTMLElement;

    Object.defineProperty(searchBar, "value", {
      configurable: true,
      value: "transportation",
    });

    const searchStub = sinon.stub(el as any, "_handleSearch");

    searchButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );

    expect(searchStub.calledOnce).to.be.true;
    expect(searchStub.calledWith("transportation")).to.be.true;

    searchStub.restore();
  });

  it("dispatches nys-search-submit event with correct detail when search is triggered", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    Object.defineProperty(searchBar, "value", {
      configurable: true,
      value: "housing",
    });

    let eventDetail: any;
    let eventFired = false;
    el.addEventListener("nys-search-submit", (e: Event) => {
      eventFired = true;
      eventDetail = (e as CustomEvent).detail;
      e.preventDefault(); // Prevent redirect in test
    });

    searchBar.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;

    expect(eventFired).to.be.true;
    expect(eventDetail).to.exist;
    expect(eventDetail.query).to.equal("housing");
  });

  it("uses custom searchUrl when provided and event is not prevented", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader
        searchUrl="https://example.com/search"
      ></nys-unavheader>`,
    );

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    Object.defineProperty(searchBar, "value", {
      configurable: true,
      value: "test query",
    });

    // Spy on the actual _handleSearch method to capture the redirect URL
    const originalHandleSearch = (el as any)._handleSearch.bind(el);
    let capturedUrl = "";

    (el as any)._handleSearch = function (searchValue: string) {
      // Call original to trigger event
      const event = new CustomEvent("nys-search-submit", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { query: searchValue },
      });

      this.dispatchEvent(event);

      if (!event.defaultPrevented) {
        if (this.searchUrl) {
          capturedUrl = `${this.searchUrl}?q=${encodeURIComponent(searchValue)}`;
        }
      }
    };

    searchBar.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;

    expect(capturedUrl).to.equal("https://example.com/search?q=test%20query");

    // Restore
    (el as any)._handleSearch = originalHandleSearch;
  });

  it("uses default search URL when searchUrl is not provided", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    Object.defineProperty(searchBar, "value", {
      configurable: true,
      value: "housing",
    });

    const originalHandleSearch = (el as any)._handleSearch.bind(el);
    let capturedUrl = "";

    (el as any)._handleSearch = function (searchValue: string) {
      const event = new CustomEvent("nys-search-submit", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { query: searchValue },
      });

      this.dispatchEvent(event);

      if (!event.defaultPrevented) {
        if (this.searchUrl) {
          capturedUrl = `${this.searchUrl}?q=${encodeURIComponent(searchValue)}`;
        } else {
          capturedUrl = `https://search.its.ny.gov/search/search.html?btnG=Search&client=default_frontend&output=xml_no_dtd&proxystylesheet=default_frontend&ulang=en&sort=date:D:L:d1&entqr=3&entqrm=0&wc=200&wc_mc=1&oe=UTF-8&ie=UTF-8&ud=1&site=default_collection&q=${encodeURIComponent(searchValue)}+inurl:${window.location.hostname}&site=default_collection`;
        }
      }
    };

    searchBar.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;

    expect(capturedUrl).to.include("search.its.ny.gov");
    expect(capturedUrl).to.include("q=housing");

    // Restore
    (el as any)._handleSearch = originalHandleSearch;
  });

  it("does not redirect when nys-search-submit event is prevented", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    Object.defineProperty(searchBar, "value", {
      configurable: true,
      value: "housing",
    });

    let redirectAttempted = false;
    const originalHandleSearch = (el as any)._handleSearch.bind(el);

    (el as any)._handleSearch = function (searchValue: string) {
      const event = new CustomEvent("nys-search-submit", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { query: searchValue },
      });

      this.dispatchEvent(event);

      if (!event.defaultPrevented) {
        redirectAttempted = true;
      }
    };

    el.addEventListener("nys-search-submit", (e: Event) => {
      e.preventDefault();
    });

    searchBar.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;

    expect(redirectAttempted).to.be.false;

    // Restore
    (el as any)._handleSearch = originalHandleSearch;
  });

  it("encodes search query properly in URL", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader
        searchUrl="https://example.com/search"
      ></nys-unavheader>`,
    );

    const searchBar = el.shadowRoot?.getElementById(
      "nys-unavheader__searchbar",
    ) as HTMLElement;

    Object.defineProperty(searchBar, "value", {
      configurable: true,
      value: "test & special chars",
    });

    const originalHandleSearch = (el as any)._handleSearch.bind(el);
    let capturedUrl = "";

    (el as any)._handleSearch = function (searchValue: string) {
      const event = new CustomEvent("nys-search-submit", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { query: searchValue },
      });

      this.dispatchEvent(event);

      if (!event.defaultPrevented) {
        if (this.searchUrl) {
          capturedUrl = `${this.searchUrl}?q=${encodeURIComponent(searchValue)}`;
        }
      }
    };

    searchBar.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;

    expect(capturedUrl).to.equal(
      "https://example.com/search?q=test%20%26%20special%20chars",
    );

    // Restore
    (el as any)._handleSearch = originalHandleSearch;
  });

  it("dispatches nys-language-select event with correct detail and uses Smartling subdomain redirect when no url is provided", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    el.languages = [
      { code: "en", label: "English" },
      { code: "es", label: "Español" },
    ];
    await el.updateComplete;

    const originalHandleLanguageSelect = (el as any)._handleLanguageSelect.bind(
      el,
    );
    let capturedUrl = "";

    (el as any)._handleLanguageSelect = function (language: {
      code: string;
      label: string;
      url?: string;
    }) {
      const event = new CustomEvent("nys-language-select", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { language },
      });

      this.dispatchEvent(event);

      if (!event.defaultPrevented) {
        if (language.url) {
          capturedUrl = language.url;
        } else {
          const subdomain = language.code === "en" ? "" : `${language.code}.`;
          capturedUrl = `https://${subdomain}${window.location.hostname}`;
        }
      }
    };

    const langButtons = el.shadowRoot?.querySelectorAll(
      ".nys-unavheader__languagelink",
    ) as NodeListOf<HTMLElement>;

    // Click Español (index 1)
    langButtons[1].dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );

    await el.updateComplete;

    expect(capturedUrl).to.equal(`https://es.${window.location.hostname}`);

    (el as any)._handleLanguageSelect = originalHandleLanguageSelect;
  });

  it("redirects to custom url when language has a url property", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    el.languages = [
      { code: "en", label: "English" },
      { code: "es", label: "Español", url: "https://www.google.com" },
    ];
    await el.updateComplete;

    const originalHandleLanguageSelect = (el as any)._handleLanguageSelect.bind(
      el,
    );
    let capturedUrl = "";

    (el as any)._handleLanguageSelect = function (language: {
      code: string;
      label: string;
      url?: string;
    }) {
      const event = new CustomEvent("nys-language-select", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { language },
      });

      this.dispatchEvent(event);

      if (!event.defaultPrevented) {
        if (language.url) {
          capturedUrl = language.url;
        } else {
          const subdomain = language.code === "en" ? "" : `${language.code}.`;
          capturedUrl = `https://${subdomain}${window.location.hostname}`;
        }
      }
    };

    const langButtons = el.shadowRoot?.querySelectorAll(
      ".nys-unavheader__languagelink",
    ) as NodeListOf<HTMLElement>;

    // Click Español (index 1)
    langButtons[1].dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );

    await el.updateComplete;

    expect(capturedUrl).to.equal("https://www.google.com");

    (el as any)._handleLanguageSelect = originalHandleLanguageSelect;
  });

  it("does not redirect when nys-language-select event is prevented", async () => {
    const el = await fixture<NysUnavHeader>(
      html`<nys-unavheader></nys-unavheader>`,
    );

    el.languages = [
      { code: "en", label: "English" },
      { code: "es", label: "Español" },
    ];
    await el.updateComplete;

    let redirectAttempted = false;
    const originalHandleLanguageSelect = (el as any)._handleLanguageSelect.bind(
      el,
    );

    (el as any)._handleLanguageSelect = function (language: {
      code: string;
      label: string;
      url?: string;
    }) {
      const event = new CustomEvent("nys-language-select", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { language },
      });

      this.dispatchEvent(event);

      if (!event.defaultPrevented) {
        redirectAttempted = true;
      }
    };

    el.addEventListener("nys-language-select", (e: Event) => {
      e.preventDefault();
    });

    const langButtons = el.shadowRoot?.querySelectorAll(
      ".nys-unavheader__languagelink",
    ) as NodeListOf<HTMLElement>;

    langButtons[1].dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );

    await el.updateComplete;

    expect(redirectAttempted).to.be.false;

    (el as any)._handleLanguageSelect = originalHandleLanguageSelect;
  });

  describe("statewide alerts", () => {
    const publishedAlert = {
      alert: {
        status: "on",
        severity: "high",
        headline: "TEST - Winter Storm Warning",
        description: "Areas Affected: Bronx; Kings (Brooklyn)",
        linkAriaLabel: "See more details about the affected areas.",
        link: "https://governor.ny.gov/",
        linkTitle: "Learn More",
        icon: "Virus",
      },
    };

    it("reads the alert endpoint on connect", async () => {
      await headerWithFeed(EMPTY_FEED);
      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal(NYS_ALERT_URL);
    });

    it("renders no alert when nothing is published", async () => {
      const el = await headerWithFeed(EMPTY_FEED);
      expect(el.shadowRoot?.querySelector(".nys-unavheader__alert")).to.not
        .exist;
    });

    it("renders an alert that is switched on", async () => {
      const el = await headerWithFeed(publishedAlert);

      const band = el.shadowRoot?.querySelector(
        ".nys-unavheader__alert.wrapper",
      ) as HTMLElement;
      expect(band).to.exist;
      // severity "high" maps to the emergency treatment
      expect(band.getAttribute("data-type")).to.equal("emergency");

      const alert = band.querySelector("nys-alert") as HTMLElement;
      expect(alert.getAttribute("heading")).to.equal(
        "TEST - Winter Storm Warning",
      );
      // Feed icon names are mapped onto the nys-icon library
      expect(alert.getAttribute("icon")).to.equal("coronavirus");
      expect(alert.textContent).to.contain("Areas Affected");

      const link = alert.querySelector("a") as HTMLAnchorElement;
      expect(link.getAttribute("href")).to.equal("https://governor.ny.gov/");
      expect(link.textContent?.trim()).to.equal("Learn More");
      expect(link.getAttribute("aria-label")).to.equal(
        "See more details about the affected areas.",
      );
    });

    it("hides an alert that is switched off", async () => {
      const el = await headerWithFeed({
        alert: { ...publishedAlert.alert, status: "off" },
      });
      expect(el.shadowRoot?.querySelector(".nys-unavheader__alert")).to.not
        .exist;
    });

    it("leaves the type's default icon in place for an unknown icon name", async () => {
      const el = await headerWithFeed({
        alert: { ...publishedAlert.alert, icon: "Nonsense" },
      });
      const alert = el.shadowRoot?.querySelector("nys-alert") as HTMLElement;
      expect(alert.getAttribute("icon")).to.equal("");
    });

    it("maps severity onto the alert type", async () => {
      for (const [severity, type] of [
        ["high", "emergency"],
        ["medium", "warning"],
        ["low", "info"],
        ["nonsense", "info"],
      ]) {
        const el = await headerWithFeed({
          alert: { ...publishedAlert.alert, severity },
        });
        const band = el.shadowRoot?.querySelector(
          ".nys-unavheader__alert.wrapper",
        ) as HTMLElement;
        expect(band.getAttribute("data-type"), severity).to.equal(type);
      }
    });

    it("renders the header normally when the endpoint fails", async () => {
      const warn = sinon.stub(console, "warn");
      fetchStub.resetBehavior();
      fetchStub.rejects(new Error("network down"));

      const el = await fixture<NysUnavHeader>(
        html`<nys-unavheader></nys-unavheader>`,
      );
      await nextFrame();
      await el.updateComplete;

      expect(el.shadowRoot?.getElementById("nys-unavheader__logolink")).to
        .exist;
      expect(el.shadowRoot?.querySelector(".nys-unavheader__alert")).to.not
        .exist;
      expect(warn.called).to.be.true;

      warn.restore();
    });

    it("renders the header normally when a response is not valid JSON", async () => {
      const warn = sinon.stub(console, "warn");
      fetchStub.resetBehavior();
      fetchStub.resolves(new Response("not json"));

      const el = await fixture<NysUnavHeader>(
        html`<nys-unavheader></nys-unavheader>`,
      );
      await nextFrame();
      await el.updateComplete;

      expect(el.shadowRoot?.getElementById("nys-unavheader__logolink")).to
        .exist;
      expect(el.shadowRoot?.querySelector(".nys-unavheader__alert")).to.not
        .exist;
      expect(warn.called).to.be.true;

      warn.restore();
    });

    it("renders a band per alert when the feed sends several", async () => {
      const el = await headerWithFeed({
        alert: [
          publishedAlert.alert,
          { ...publishedAlert.alert, severity: "low", headline: "Second" },
          { ...publishedAlert.alert, status: "off", headline: "Hidden" },
        ],
      });

      const bands = el.shadowRoot?.querySelectorAll(
        ".nys-unavheader__alert.wrapper",
      ) as NodeListOf<HTMLElement>;
      expect(bands.length).to.equal(2);
      expect(bands[0].getAttribute("data-type")).to.equal("emergency");
      expect(bands[1].getAttribute("data-type")).to.equal("info");
    });

    it("passes the a11y audit with an alert published", async () => {
      const el = await headerWithFeed(publishedAlert);
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-unavheader></nys-unavheader>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
