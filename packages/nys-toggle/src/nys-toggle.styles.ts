import { css } from "lit";

export default css`
  :host {
    /* Global Checkbox Styles */
    --_nys-toggle-width: var(--nys-font-size-8xl, 44px);
    --_nys-toggle-height: var(--nys-size-300, 24px);
    --_nys-border-radius: var(--nys-radius-round, 1776px);
    --_nys-slider-diameter: var(--nys-font-size-lg, 18px);
    --_nys-slider-offset: calc((var(--_nys-toggle-height) - var(--_nys-slider-diameter)) / 2);
    --_nys-border-focus-color: var(--nys-color-focus, #004dd1);
    --_nys-slider-checked-translate: calc(
      var(--_nys-toggle-width) - var(--_nys-slider-diameter) - var(--_nys-slider-offset) - 2px
    );

    /* Slider colors */
    --_nys-color-base: var(--nys-color-neutral-500, #797c7f);
    --_nys-color-base-weak: var(--nys-color-neutral-100, #d0d0ce);
    --_nys-color-theme: var(--nys-color-theme, var(nys-color-state-blue-700, #154973));
    --_nys-color-theme-strong: var(--nys-color-theme-strong, var(--nys-color-state-blue-800, #0e324f));
    --_nys-color-theme-stronger: var(--nys-color-theme-stronger, var(--nys-color-state-blue-900, #081b2b));
    --_nys-color-ink-reverse: var(--nys-color-ink-reverse, var(--nys-color-white, #fff));

    /* Font sizes and spacing for labels, descriptions, and icons */
    --_nys-label-font-size: var(--nys-font-size-sm, 14px);
    --_nys-description-font-size: var(--nys-font-size-xs, 12px);
    --_nys-icon-font-size: var(--nys-font-size-xs, 12px);
  }

  /* Slotted styling (e.g. HTML <p> tags for descriptions) */
  ::slotted([slot^="description"]) {
    font-size: var(--_nys-description-font-size);
    color: gray;
    margin: 0;
  }
  slot[name="description"] {
    font-size: var(--_nys-description-font-size);
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
    font-size: var(--_nys-label-font-size);
  }

  .nys-toggle__text.disabled {
    color: var(--_nys-color-base, #797c7f);
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
    border-radius: var(--_nys-border-radius);
    width: var(--_nys-toggle-width);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--_nys-color-base, #797c7f);
    transition: all 0.3s cubic-bezier(0.27, 0.2, 0.25, 1.51);
  }

  .knob {
    content: "";
    position: absolute;
    height: var(--_nys-slider-diameter);
    width: var(--_nys-slider-diameter);
    left: var(--_nys-slider-offset);
    bottom: var(--_nys-slider-offset);
    border-radius: 50%;
    background-color: var(--_nys-color-ink-reverse, #fff);
    transition: 0.3s;
    overflow: hidden;
    display: flex; /* Center icon inside the knob */
    align-items: center;
    justify-content: center;
  }

  /* Switch BG: Checked */
  input:checked + .slider {
    background-color: var(--_nys-color-theme, #154973);
  }

  /* Switch BG: Hover */
  input:hover + .slider {
    background-color: var(--_nys-color-base, #797c7f);
  }

  /* Switch BG: Hover + Checked*/
  input:checked:hover + .slider {
    background-color: var(--_nys-color-theme-strong, #0e324f);
  }

  /* Switch BG: Active */
  input:active + .slider {
    background-color: var(--_nys-color-theme-stronger, #081b2b);
  }

  /* Switch Outline: Focus */
  input:focus + .slider {
    box-shadow:
      0 0 0 1.5px white,
      0 0 0 3px var(--_nys-border-focus-color, #004dd1);
  }

  /* Switch Knob: Checked */
  input:checked + .slider .knob {
    transform: translateX(var(--_nys-slider-checked-translate));
  }

  /* Icon Styling */
  .toggle-icon {
    position: absolute;
    color: var(--_nys-color-base, #797c7f);
  }
  input:checked + .slider .knob .toggle-icon {
    color: var(--_nys-color-theme, #154973);
  }
  :host([size="sm"]) .toggle-icon {
    font-size: var(--_nys-icon-font-size);
  }
  :host([size="md"]) .toggle-icon {
    font-size: var(--_nys-icon-font-size);
  }
  /* If 'cap' is not supported, account for the extra padding from svg due to nys-icon's 'display:inline' */
  @supports not (font-size: 1cap) {
    :host([size="sm"]) .toggle-icon {
      font-size: var(--_nys-icon-font-size);
    }
    :host([size="md"]) .toggle-icon {
      font-size: calc(var(--_nys-icon-font-size) - 1px);
    }
  }

  /*** Disabled State ***/
  /* Switch BG: Disabled */
  input:disabled + .slider {
    background-color: var(--_nys-color-base-weak, #d0d0ce);
    cursor: not-allowed;
  }
  input:disabled + .slider .knob .toggle-icon {
    color: var(--_nys-color-base-weak, #d0d0ce);
  }

  /* Sizes */
  :host([size="sm"]) {
    --_nys-toggle-width: var(--nys-font-size-6xl, 36px);
    --_nys-toggle-height: var(--nys-size-250, 20px);
    --_nys-slider-diameter: var(--nys-font-size-md, 16px);
    --_nys-label-font-size: var(--nys-font-size-xs, 12px);
    --_nys-description-font-size: var(--nys-font-size-2xs, 10px);
    --_nys-icon-font-size: var(--nys-font-size-sm, 14px);
  }

  :host([size="md"]) {
    --_nys-toggle-width: var(--nys-font-size-8xl, 44px);
    --_nys-toggle-height: var(--nys-size-300, 24px);
    --_nys-slider-diameter: var(--nys-font-size-xl, 20px);
    --_nys-label-font-size: var(--nys-font-size-sm, 14px);
    --_nys-description-font-size: var(--nys-font-size-xs, 12px);
    --_nys-icon-font-size: var(--nys-font-size-md, 16px);
  }
`;
