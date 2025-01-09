import { css } from "lit";

export default css`
  :host {
    /* Global Toggle Styles */
    --_nys-toggle-width: var(--nys-font-size-8xl, 44px);
    --_nys-toggle-height: var(--nys-size-300, 24px);
    --_nys-toggle-border-radius: var(--nys-radius-round, 1776px);
    --_nys-toggle-slider-diameter: var(--nys-font-size-lg, 18px);
    --_nys-toggle-slider-offset: calc(
      (var(--_nys-toggle-height) - var(--_nys-toggle-slider-diameter)) / 2
    );
    --_nys-toggle-slider-checked-translate: calc(
      var(--_nys-toggle-width) - var(--_nys-toggle-slider-diameter) - var(
          --_nys-toggle-slider-offset
        ) -
        2px
    );
    --_nys-toggle-transition-duration: 0.3s;

    /* Focus outline */
    --_nys-toggle-border-focus-color: var(--nys-color-focus, #004dd1);
    --_nys-toggle-border-width-focus: var(--nys-border-width-md, 2px);

    /* Slider colors */
    --_nys-toggle-color-base: var(--nys-color-neutral-500, #797c7f);
    --_nys-toggle-color-base-weak: var(--nys-color-neutral-100, #d0d0ce);
    --_nys-toggle-color-theme: var(
      --nys-toggle-color-theme,
      var(--nys-color-state-blue-700, #154973)
    );
    --_nys-toggle-color-neutral: var(--nys-color-neutral-600, #62666a);
    --_nys-toggle-color-neutral-700: var(--nys-color-neutral-700, #4a4d4f);
    --_nys-toggle-color-theme-strong: var(
      --nys-toggle-color-theme-strong,
      var(--nys-toggle-color-state-blue-800, #0e324f)
    );
    --_nys-toggle-color-theme-stronger: var(
      --nys-toggle-color-theme-stronger,
      var(--nys-toggle-color-state-blue-900, #081b2b)
    );
    --_nys-toggle-color-ink-reverse: var(
      --nys-toggle-color-ink-reverse,
      var(--nys-toggle-color-white, #fff)
    );

    /* Font sizes and spacing for labels, descriptions, and icons */
    --_nys-toggle-label-font-size: var(--nys-font-size-sm, 14px);
    --_nys-toggle-description-font-size: var(--nys-font-size-xs, 12px);
    --_nys-toggle-icon-font-size: var(--nys-font-size-xs, 12px);
  }

  /* Slotted styling (e.g. HTML <p> tags for descriptions) */
  ::slotted([slot^="description"]) {
    font-size: var(--_nys-toggle-description-font-size);
    color: gray;
    margin: 0;
  }
  slot[name="description"] {
    font-size: var(--_nys-toggle-description-font-size);
    color: gray;
    margin: 0;
  }

  /* Toggle switch overall container */
  .nys-toggle__content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Label & description text container */
  .nys-toggle__text {
    display: flex;
    flex-direction: column;
    font-size: var(--_nys-toggle-label-font-size);
  }

  .nys-toggle__text.disabled {
    color: var(--_nys-toggle-color-base, #797c7f);
  }

  /* Toggle Switch component */
  .nys-toggle__toggle {
    position: relative;
    display: inline-block;
    width: var(--_nys-toggle-width);
    height: var(--_nys-toggle-height);
  }

  .nys-toggle__toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    border-radius: var(--_nys-toggle-border-radius);
    outline: solid 2px white;
    outline-offset: 2px;
    width: var(--_nys-toggle-width);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--_nys-toggle-color-base, #797c7f);
  }

  .knob {
    content: "";
    position: absolute;
    height: var(--_nys-toggle-slider-diameter);
    width: var(--_nys-toggle-slider-diameter);
    left: var(--_nys-toggle-slider-offset);
    bottom: var(--_nys-toggle-slider-offset);
    border-radius: 50%;
    background-color: var(--_nys-toggle-color-ink-reverse, #fff);
    transition: all var(--_nys-toggle-transition-duration) cubic-bezier(0.27, 0.2, 0.25, 1.51);
    overflow: hidden;
    display: flex; /* Center icon inside the knob */
    align-items: center;
    justify-content: center;
  }

  /* Switch BG: Checked */
  input:checked + .slider {
    background-color: var(--_nys-toggle-color-theme, #154973);
  }

  /* Switch BG: Hover */
  .slider:hover {
    background-color: var(--_nys-toggle-color-neutral, #62666a);
  }

  /* Switch BG: Hover + Checked */
  input:checked + .slider:hover {
    background-color: var(--_nys-toggle-color-theme-strong, #0e324f);
  }

  /* Switch Icon color: Hover */
  .slider:hover .knob .toggle-icon {
    color: var(--_nys-toggle-color-neutral, #62666a);
  }

  /* Switch Icon color: Hover + Checked */
  input:checked:not(:disabled) + .slider:hover .knob .toggle-icon {
    color: var(--_nys-toggle-color-theme-strong, #0e324f);
  }

  /* Switch BG: Active */
  input:active + .slider {
    background-color: var(--_nys-toggle-color-neutral-700, #4a4d4f);
  }

  /* Switch BG: Active + Checked */
  input:active:checked + .slider {
    background-color: var(--_nys-toggle-color-theme-stronger, #081b2b);
  }

  /* Switch Outline: Focus */
  input:focus + .slider {
    outline: solid var(--_nys-toggle-border-width-focus) var(--_nys-toggle-border-focus-color);
    outline-offset: 2px;
  }

  input:focus:active + .slider {
    outline: solid 2px var(--_nys-border-focus-color, #004dd1);
    outline-offset: 2px;
  }

  /* Switch Knob: Checked */
  input:checked + .slider .knob {
    transform: translateX(var(--_nys-toggle-slider-checked-translate));
  }

  /* Icon Styling */
  .toggle-icon {
    position: absolute;
    color: var(--_nys-toggle-color-base, #797c7f);
  }
  input:checked + .slider .knob .toggle-icon {
    color: var(--_nys-toggle-color-theme, #154973);
  }
  input:active + .slider .knob .toggle-icon {
    color: var(--_nys-toggle-color-neutral-700, #4a4d4f);
  }
  input:active:checked + .slider .knob .toggle-icon {
    color: var(--_nys-toggle-color-theme-stronger, #081b2b);
  }
  :host([size="sm"]) .toggle-icon {
    font-size: var(--_nys-toggle-icon-font-size);
  }
  :host([size="md"]) .toggle-icon {
    font-size: var(--_nys-toggle-icon-font-size);
  }
  /* If 'cap' is not supported, account for the extra padding from svg due to nys-icon's 'display:inline' */
  @supports not (font-size: 1cap) {
    :host([size="sm"]) .toggle-icon {
      font-size: var(--_nys-toggle-icon-font-size);
    }
    :host([size="md"]) .toggle-icon {
      font-size: calc(var(--_nys-toggle-icon-font-size) - 1px);
    }
  }

  /*** Disabled State ***/
  /* Switch BG: Disabled */
  input:disabled + .slider,
  input:disabled + .slider:hover {
    background-color: var(--_nys-toggle-color-base-weak, #d0d0ce);
    cursor: not-allowed;
  }
  input:disabled + .slider .knob .toggle-icon,
  input:disabled:active + .slider .knob .toggle-icon {
    color: var(--_nys-toggle-color-base-weak, #d0d0ce);
  }

  /* Sizes */
  :host([size="sm"]) {
    --_nys-toggle-width: var(--nys-toggle-font-size-6xl, 36px);
    --_nys-toggle-height: var(--nys-toggle-size-250, 20px);
    --_nys-toggle-slider-diameter: var(--nys-toggle--font-size-md, 16px);
    --_nys-label-font-size: var(--nys-toggle-font-size-xs, 12px);
    --_nys-description-font-size: var(--nys-toggle-font-size-2xs, 10px);
    --_nys-icon-font-size: var(--nys-toggle-font-size-sm, 14px);
  }

  :host([size="md"]) {
    --_nys-toggle-width: var(--nys-toggle-font-size-8xl, 44px);
    --_nys-toggle-height: var(--nys-toggle-size-300, 24px);
    --_nys-toggle-slider-diameter: var(--nys-toggle-font-size-xl, 20px);
    --_nys-label-font-size: var(--nys-toggle-font-size-sm, 14px);
    --_nys-description-font-size: var(--nys-toggle-font-size-xs, 12px);
    --_nys-icon-font-size: var(--nys-toggle-font-size-md, 16px);
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      --toggle-transition-duration: 0s; /* Disable animation */
    }
  }
`;
