import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-video.scss?inline";

let videoIdCounter = 0;

export class NysVideo extends LitElement {
  static styles = unsafeCSS(styles);

  /** Full YouTube URL — required. Component will not render if invalid. */
  @property({ type: String, reflect: true }) id = "";

  /** Title text for the thumbnail of the video */
  @property({ type: String, reflect: true }) titleText = "";

  /** Full YouTube URL — required. Component will not render if invalid. */
  @property({ type: String }) videourl = "";

  /**
   * Largest size for the video player.
   * If not set, size is determined automatically by viewport width.
   */
  @property({ type: String, reflect: true }) size:
    | "full"
    | "contained"
    | "compacted"
    | "" = "";

  @property({ type: String }) loading: "lazy" | "eager" = "eager";

  // /** Accessible label describing the video content **/
  // @property({ type: String }) ariaLabel = "";

  /** Time in seconds where playback begins. **/
  @property({ type: Number }) starttime = 0;

  /**
   * Custom thumbnail image path.
   * Falls back to YouTube's auto-generated thumbnail if not provided.
   */
  @property({ type: String }) thumbnail: string | null = null;

  /** Triggers autoplay when the iframe loads */
  @property({ type: Boolean }) autoplay = false;

  /** Prevents the video from being played */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Tracks whether the user has clicked to load the player */
  @state() private _playerActive = false;

  /** Auto-computed size when no explicit size prop is set */
  @state() private _autoSize: "full" | "contained" | "compacted" = "full";

  private _mediaFull = window.matchMedia("(min-width: 768px)");
  private _mediaMobileLarge = window.matchMedia("(min-width: 480px)");
  private _onMediaChange = () => this._updateAutoSize();

  // Lifecycle Methods
  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-video-${Date.now()}-${videoIdCounter++}`;
    }

    // if (!this.ariaLabel) {
    //   console.warn("<nys-video>: arialabel is required for accessibility.");
    // }

    if (this.videourl && !this._isValidYouTubeUrl()) {
      console.error(
        "<nys-video>: videourl is not a valid YouTube URL. Component will not render.",
      );
    }

    if (!this.size) {
      this._updateAutoSize();
      this._mediaFull.addEventListener("change", this._onMediaChange);
      this._mediaMobileLarge.addEventListener("change", this._onMediaChange);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mediaFull.removeEventListener("change", this._onMediaChange);
    this._mediaMobileLarge.removeEventListener("change", this._onMediaChange);
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  private _updateAutoSize() {
    if (this._mediaFull.matches) {
      this._autoSize = "full";
    } else if (this._mediaMobileLarge.matches) {
      this._autoSize = "contained";
    } else {
      this._autoSize = "compacted";
    }
  }

  private _isValidYouTubeUrl(): boolean {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(
      this.videourl,
    );
  }

  private _getVideoId() {
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&]+)/;
    const match = this.videourl.match(regExp);
    return match ? match[1] : null;
  }

  private _getThumbnailUrl() {
    if (this.thumbnail) return this.thumbnail;
    const videoId = this._getVideoId();
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  private _getEmbedUrl() {
    const videoId = this._getVideoId();
    if (!videoId) return null;

    const params = new URLSearchParams({
      autoplay: "1",
      ...(this.starttime > 0 && { start: String(this.starttime) }),
    });

    return `https://www.youtube.com/embed/${videoId}?${params}`;
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _handleThumbnailClick() {
    if (this.disabled) return;
    this._playerActive = true;
  }

  render() {
    if (!this._isValidYouTubeUrl()) {
      return html``;
    }

    const embedUrl = this._getEmbedUrl();
    if (!embedUrl) return html``;

    // Use explicit size if set, otherwise fall back to auto-computed size
    const effectiveSize = this.size || this._autoSize;

    /**
     * Show thumbnail first, unless until user clicks or developer sets "autoplay".
     * Then, swap to iframe.
     */
    if (!this._playerActive && !this.autoplay) {
      return html`
        <div
          class="nys-video nys-video--${effectiveSize} ${this.disabled
            ? "nys-video--disabled"
            : ""}"
        >
          <div class="nys-video__ratio-box">
            <div
              class="nys-video__thumbnail"
              @click=${this._handleThumbnailClick}
            >
              <img src=${this._getThumbnailUrl()} alt="" />
              <button
                class="nys-video__play-icon"
                aria-hidden="true"
                aria-label="Play ${this.titleText}"
                ?disabled=${this.disabled}
              >
                ${!this.disabled
                  ? html`<svg
                      width="31"
                      height="35"
                      viewBox="0 0 31 35"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M29.4221 15.7357L2.568 0.231711C1.42656 -0.426849 0 0.396831 0 1.71395V32.7229C0 34.041 1.42656 34.8647 2.568 34.2052L29.4221 18.7012C30.5635 18.0426 30.5635 16.3952 29.4221 15.7357Z"
                        fill="white"
                      />
                    </svg>`
                  : html`<svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="31"
                      height="35"
                      viewBox="0 0 31 35"
                      fill="none"
                    >
                      <path
                        d="M29.4221 15.7357L2.568 0.231711C1.42656 -0.426849 0 0.396831 0 1.71395V32.7229C0 34.041 1.42656 34.8647 2.568 34.2052L29.4221 18.7012C30.5635 18.0426 30.5635 16.3952 29.4221 15.7357Z"
                        fill="white"
                        fill-opacity="0.4"
                      />
                    </svg>`}
              </button>
            </div>
          </div>
          ${this.titleText &&
          html`<div class="nys-video__title-text">
            <p>${this.titleText}</p>
          </div>`}
        </div>
      `;
    }

    return html`<div class="nys-video nys-video--${effectiveSize}">
      <div class="nys-video__ratio-box">
        <iframe
          src=${embedUrl}
          title=${this.titleText}
          aria-label=${this.titleText}
          loading=${this.loading}
          allowfullscreen
          frameborder="0"
          allow="accelerometer; ${this.autoplay
            ? "autoplay;"
            : ""} clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>`;
  }
}

if (!customElements.get("nys-video")) {
  customElements.define("nys-video", NysVideo);
}
