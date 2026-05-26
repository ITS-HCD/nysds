import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-video.scss?inline";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

let videoIdCounter = 0;

/**
 * A YouTube video player with a thumbnail preview and play button overlay.
 * Loads the YouTube iframe only after the user clicks play, keeping initial page load fast and reducing data usage.
 * Supports autoplay (muted for browser policies), custom thumbnails, start time, lazy loading, and disabled state.
 * Announces playback state and ad state to screen readers via a live region.
 *
 * For use with YouTube URLs only (youtube.com, youtu.be, youtube.com/shorts).
 * Component renders nothing if the URL is invalid or malformed.
 *
 * ## When to use
 * - Embed YouTube videos on pages where bandwidth or load time matters.
 * - Provide context with a title and thumbnail; users must explicitly consent to load the video.
 * - Use `autoplay` sparingly; only for hero videos or when the video is the primary page content (muted by default).
 * - Set `starttime` to begin playback at a specific timestamp (in seconds).
 * - Use `disabled` to prevent playback in certain contexts (e.g., when content is restricted).
 *
 * ## Variants
 * - **Preview thumbnail**: Shows YouTube's auto-generated thumbnail with a play button overlay.
 * - **Custom thumbnail**: Provide a `thumbnail` URL to override YouTube's default thumbnail.
 * - **Autoplay muted**: Set `autoplay` to load and auto-play the video on page load (muted for browser policy compliance).
 * - **Start time**: Set `starttime` (in seconds) to skip to a specific point in the video.
 * - **Lazy loading**: Set `loading="lazy"` (default) for deferred iframe load; `"eager"` for immediate load.
 * - **Size variants**: `"full"` (responsive, fills container), `"md"` (medium), `"sm"` (small), or auto-sized if not set.
 *
 * ## Accessibility
 * - Title text is announced to screen readers when the video is not yet loaded.
 * - When the video loads, the iframe title and aria-label are set to the `titleText`.
 * - Live region announces playback state ("Video is playing", "Advertisement is playing").
 * - Play button is properly labeled and keyboard accessible.
 * - Disabled state prevents play button interaction.
 * - Focus is transferred to the iframe once the video is loaded (for keyboard users).
 *
 * ## Content Guidelines
 * - Keep video titles concise and descriptive (e.g., "How to Apply for a License" not just "Video").
 * - Always provide a custom thumbnail if the auto-generated one is unclear or unappealing.
 * - Ensure the video content is related to the page context and aligns with user expectations.
 * - Consider using autoplay sparingly; it can be distracting and uses bandwidth.
 * - Use `starttime` only if a specific section of the video is relevant to the page content.
 *
 * @summary YouTube video player with lazy-loaded iframe and accessibility announcements.
 * @element nys-video
 *
 * @fires nys-video-play - Fired when the user clicks the thumbnail to load and play the video.
 *   Does not fire if `autoplay` is set (video loads automatically).
 *
 * @example Basic usage with auto-generated thumbnail
 * ```html
 * <nys-video
 *   videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *   titleText="Video Title"
 * ></nys-video>
 * ```
 *
 * @example With custom thumbnail and start time
 * ```html
 * <nys-video
 *   videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *   titleText="Rick Astley - Never Gonna Give You Up"
 *   thumbnail="https://custom-thumbnail.jpg"
 *   starttime="30"
 * ></nys-video>
 * ```
 *
 * @example With autoplay (muted)
 * ```html
 * <nys-video
 *   videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *   titleText="Hero Video"
 *   autoplay
 * ></nys-video>
 * ```
 *
 * @example Listen for video play
 * ```javascript
 * const video = document.querySelector('nys-video');
 * video.addEventListener('nys-video-play', () => {
 *   console.log('User clicked play');
 * });
 * ```
 *
 * ## Dependencies
 *  *
 *  * This component has no dependencies on other NYS Design System components.
 */

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
  @property({ type: String, reflect: true }) size: "full" | "md" | "sm" | "" =
    "";

  @property({ type: String }) loading: "lazy" | "eager" = "lazy";

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

  /** Screen reader announcement text */
  @state() private _announcement = "";

  /** Tracks whether an ad is currently playing to suppress false "Video is playing" announcements */
  private _adPlaying = false;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-video-${Date.now()}-${videoIdCounter++}`;
    }

    if (this.autoplay) {
      this._announceVideoVO();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */
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
      enablejsapi: "1",
      ...(this.autoplay && { mute: "1" }),
      ...(this.starttime > 0 && { start: String(this.starttime) }),
    });

    return `https://www.youtube.com/embed/${videoId}?${params}`;
  }

  /**
   * Because I need to know if Youtube ADs are playing, I need to call YT's API.
   * Hence, the YT API setup below. The VO has 2 types of announcements:
   * - "Advertisement is playing"
   * - "Video is playing"
   *
   * YT IFrame Player API: https://developers.google.com/youtube/iframe_api_reference
   */
  private _announceVideoVO() {
    const setup = () => {
      this.updateComplete.then(() => {
        const iframe = this.shadowRoot?.querySelector("iframe");
        if (!iframe) return;

        new window.YT.Player(iframe, {
          events: {
            onStateChange: (event: { data: number }) => {
              if (this._adPlaying) return;

              if (event.data === window.YT.PlayerState.PLAYING) {
                this._announcement = this.autoplay
                  ? "Video is playing, muted"
                  : "Video is playing";
                setTimeout(() => (this._announcement = ""), 1000);
              }
            },
            // // NOTE: onAdStateChange is not officially documented by YouTube.
            // It is a real event fired by the IFrame player, discovered through community reverse-engineering
            onAdStateChange: (event: { data: number }) => {
              this._adPlaying = event.data === window.YT.PlayerState.PLAYING;

              if (this._adPlaying) {
                this._announcement = "Advertisement is playing";
                setTimeout(() => (this._announcement = ""), 1000);
              }
            },
          },
        });
      });
    };

    // The window.YT is YouTube's API object. If already loaded, run setup immediately.
    if (window.YT?.Player) {
      setup();
    } else {
      if (!document.getElementById("yt-iframe-api")) {
        const script = document.createElement("script");
        script.id = "yt-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
      window.onYouTubeIframeAPIReady = setup;
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  private _handleThumbnailClick() {
    if (this.disabled) return;
    this._playerActive = true;

    this.updateComplete.then(() => {
      const iframe = this.shadowRoot?.querySelector("iframe");
      if (!iframe) return;

      iframe.addEventListener(
        "load",
        () => {
          iframe.focus();
        },
        { once: true },
      );
    });

    this._announceVideoVO();
  }

  /**
   * Render Helpers
   * --------------------------------------------------------------------------
   */
  private _renderAnnouncer() {
    return html`
      <div
        aria-live="assertive"
        aria-atomic="true"
        class="nys-video__announcer sr-only"
      >
        ${this._announcement}
      </div>
    `;
  }

  private _renderPlayIcon() {
    return this.disabled
      ? html`<svg
          aria-hidden="true"
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
        </svg>`
      : html`<svg
          aria-hidden="true"
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
        </svg>`;
  }

  render() {
    if (!this._isValidYouTubeUrl()) {
      return html``;
    }

    const embedUrl = this._getEmbedUrl();
    if (!embedUrl) return html``;

    // Use explicit size if set, otherwise fall back to auto-computed size
    const effectiveSize = this.size || "md";

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
          ${this._renderAnnouncer()}
          <div class="nys-video__ratio-box">
            <div
              class="nys-video__thumbnail"
              @click=${this._handleThumbnailClick}
            >
              <img src=${this._getThumbnailUrl()} alt="" />
              <button
                class="nys-video__play-icon"
                aria-label="Play ${this.titleText}"
                ?disabled=${this.disabled}
              >
                ${this._renderPlayIcon()}
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
      ${this._renderAnnouncer()}
      <div class="nys-video__ratio-box">
        <iframe
          tabindex="0"
          src=${embedUrl}
          title=${this.titleText}
          aria-label=${this.titleText}
          loading=${this.loading}
          allowfullscreen
          frameborder="0"
          allow="accelerometer;autoplay;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>`;
  }
}

if (!customElements.get("nys-video")) {
  customElements.define("nys-video", NysVideo);
}
