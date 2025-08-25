import { css } from "lit";

export default css`
  :host {
    /* Global Alert Styles */
    --_nys-alert-border-width: var(--nys-border-width-lg, 4px);
    --_nys-alert-border-radius: var(--nys-radius-md, 4px);
    --_nys-alert-color: var(
      --nys-alert-color,
      var(--nys-color-text, var(--nys-color-neutral-900, #1b1b1b))
    );
    --_nys-alert-color--link: var(
      --nys-alert-color--link,
      var(--nys-color-link, var(--nys-color-blue-600, #004dd1))
    );
    --_nys-alert-color--link--hover: var(
      --nys-alert-color--link--hover,
      var(--nys-color-link-strong, var(--nys-color-blue-700, #003ba1))
    );
    --_nys-alert-color--link--active: var(
      --nys-alert-color--link--active,
      var(--nys-color-link-strongest, var(--nys-color-blue-800, #002971))
    );
    --_nys-alert-padding: var(--nys-space-250, 20px);
    --_nys-alert-font-family: var(
      --nys-font-family-ui,
      var(
        --nys-font-family-sans,
        "Proxima Nova",
        "Helvetica Neue",
        "Helvetica",
        "Arial",
        sans-serif
      )
    );
    --_nys-alert-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-alert-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-alert-letter-spacing: var(
      --nys-font-letterspacing-ui-md,
      var(--nys-font-letterspacing-400, 0.044px)
    );
    --_nys-alert-font-weight--regular: var(--nys-font-weight-regular, 400);
    --_nys-alert-font-weight--semibold: var(--nys-font-weight-semibold, 600);

    /* Border specifics */
    --_nys-alert-border-color: var(
      --nys-alert-border-color,
      var(--nys-color-base, var(--nys-color-neutral-600, #62666a))
    );

    /* Background type specifics */
    --_nys-alert-background-color: var(
      --nys-alert-background-color,
      var(--nys-color-base-weak, var(--nys-color-neutral-10, #f6f6f6))
    );

    /* Theme Icon */
    --_nys-alert-gap--icon: var(--nys-space-150, 12px);
    --_nys-alert-gap--text: var(--nys-space-50, 4px);

    /* Action Statement */
    --_nys-alert-gap--actions: var(--nys-space-150, 12px);
  }

  /* Main alert container */
  .nys-alert__container {
    display: flex;
    background-color: var(--_nys-alert-background-color);
    border-left: var(--_nys-alert-border-width) solid
      var(--_nys-alert-border-color);
    border-radius: var(--_nys-alert-border-radius);
    color: var(--_nys-alert-color);
    padding: var(--_nys-alert-padding);
    font-style: normal;
    font-family: var(--_nys-alert-font-family);
    font-size: var(--_nys-alert-font-size);
    line-height: var(--_nys-alert-line-height);
    letter-spacing: var(--_nys-alert-letter-spacing);
    gap: var(--_nys-alert-gap--icon);
    text-align: left;
  }

  p {
    margin: 0;
  }

  ::slotted(p) {
    margin-bottom: 0 !important;
  }

  /* Icon */
  .nys-alert__icon {
    margin-top: -1.5px;
  }

  /* Links */
  a,
  a:visited {
    font-weight: var(--_nys-alert-font-weight--semibold);
    font-size: var(--_nys-alert-font-size);
    color: var(--_nys-alert-color--link);
  }
  a:hover {
    color: var(--_nys-alert-color--link--hover);
  }
  a:active {
    color: var(--_nys-alert-color--link--active);
  }

  /* For HTML elements put into the slot */
  ::slotted(a) {
    color: var(--_nys-alert-color--link);
  }

  /* Handles both header and description text */
  .nys-alert__texts {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--_nys-alert-gap--text);
  }

  .nys-alert__header {
    margin: 0;
    font-weight: var(--_nys-alert-font-weight--semibold);
  }

  .nys-alert__text {
    font-weight: var(--_nys-alert-font-weight--regular);
    margin: 0;
  }

  /* For HTML elements put into the slot */
  ::slotted(*) {
    font-weight: var(--_nys-alert-font-weight--regular);
    margin: 0;
  }

  /* Centered variant: For no descriptions, we remove the <slot name="text"> via JS logic. In styling, centers the icon for a compact layout. */
  .nys-alert--centered {
    display: flex;
    align-items: center;
  }
  .nys-alert--centered .nys-alert__header {
    margin-bottom: -3px; /* Adjusts the header text to be centered */
  }
  .nys-alert--centered div[part="nys-alert__icon"] {
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Action Statement */
  .nys-alert__actions {
    display: flex;
    gap: var(--_nys-alert-gap--actions);
    flex-wrap: wrap;
  }

  /* Alert Types */
  :host([type="info"]) {
    --_nys-alert-border-color: var(
      --nys-alert-border-color,
      var(--nys-color-info, var(--nys-color-blue-600, #004dd1))
    );
    --_nys-alert-background-color: var(
      --nys-alert-background-color,
      var(--nys-color-info-weak, var(--nys-color-blue-50, #e5effa))
    );
  }
  :host([type="success"]) {
    --_nys-alert-border-color: var(
      --nys-alert-border-color,
      var(--nys-color-success, var(--nys-color-green-600, #1e752e))
    );
    --_nys-alert-background-color: var(
      --nys-alert-background-color,
      var(--nys-color-success-weak, var(--nys-color-green-50, #e8f1ea))
    );
  }
  :host([type="warning"]) {
    --_nys-alert-border-color: var(
      --nys-alert-border-color,
      var(--nys-color-warning, var(--nys-color-yellow-400, #face00))
    );
    --_nys-alert-background-color: var(
      --nys-alert-background-color,
      var(--nys-color-warning-weak, var(--nys-color-yellow-50, #fefae5))
    );
  }
  :host([type="danger"]) {
    --_nys-alert-border-color: var(
      --nys-alert-border-color,
      var(--nys-color-danger, var(--nys-color-red-600, #b52c2c))
    );
    --_nys-alert-background-color: var(
      --nys-alert-background-color,
      var(--nys-color-danger-weak, var(--nys-color-red-50, #f7eaea))
    );
  }
  :host([type="emergency"]) {
    --_nys-alert-border-color: var(
      --nys-alert-border-color,
      var(--nys-color-emergency, var(--nys-color-red-800, #721c1c))
    );
    --_nys-alert-background-color: var(
      --nys-alert-background-color,
      var(--nys-color-emergency, var(--nys-color-red-800, #721c1c))
    );
    --_nys-alert-color: var(
      --nys-alert-color,
      var(--nys-color-text-reverse, var(--nys-color-white, #fff))
    );
    --_nys-alert-color--link: var(
      --nys-alert-color--link,
      var(--nys-color-link-reverse-neutral, var(--nys-color-white, #fff))
    );
    --_nys-alert-color--link--hover: var(
      --nys-alert-color--link--hover,
      var(--nys-color-link-reverse-neutral, var(--nys-color-white, #fff))
    );
    --_nys-alert-color--link--active: var(
      --nys-alert-color--link--active,
      var(--nys-color-link-reverse-neutral, var(--nys-color-white, #fff))
    );
  }
  :host([type="emergency"]) a:hover {
    text-decoration-thickness: 2px;
  }
  :host([type="emergency"]) a:active {
    text-decoration-thickness: 3px;
  }
`;
