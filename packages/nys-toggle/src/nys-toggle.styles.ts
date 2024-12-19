import { css } from "lit";

export default css`
  :host {
    --toggle-width: 44px;
    --toggle-height: 24px;
    --slider-diameter: 18px;
    --slider-offset: calc((var(--toggle-height) - var(--slider-diameter)) / 2);
    --slider-checked-translate: calc(
      var(--toggle-width) - var(--slider-diameter) - var(--slider-offset) - 2px
    );

    /* Slider colors */
    --nys-color-base: #797C7F;
    --nys-color-theme: #154973;
    --nys-color-theme-strong: #0E324F;
    --nys-color-theme-stronger: #081B2B;
    --nys-color-theme-weaker: #D0D0CE;
    --nys-color-ink-reverse: #FFF;
    --slider-checked-focus-border: #146598;

    /* Font sizes and spacing for labels/descriptions and icons */
    --label-font-size: 14px;
    --description-font-size: 12px;
    --description-spacing: 7px;
    --icon-font-size: 12px;
  }

  /* Slotted styling (e.g. HTML <p> tags for descriptions)*/
  ::slotted([slot^="description"]) {
    font-size: var(--description-font-size);
    color: gray;
    margin: 0;
  }
  slot[name="description"] {
    font-size: var(--description-font-size);
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
    font-size: var(--label-font-size);
  }

  
  .nys-toggle__text.disabled{
    color: var(--nys-color-base, #797C7F);
  }

  /* Toggle Switch component */
  .nys-toggle__toggle {
    position: relative;
    display: inline-block;
    width: var(--toggle-width);
    height: var(--toggle-height);
  }

  .nys-toggle__toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    border-radius: 34px;
    width: var(--toggle-width);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--nys-color-base, #797C7F);
    transition: all 0.3s cubic-bezier(0.27, 0.2, 0.25, 1.51);
  }

  .knob {
    content: "";
    position: absolute;
    height: var(--slider-diameter);
    width: var(--slider-diameter);
    left: var(--slider-offset);
    bottom: var(--slider-offset);
    border-radius: 50%;
    background-color: var(--nys-color-ink-reverse, #FFF);
    transition: 0.3s;
    overflow: hidden;
    display: flex; /* Center icon inside the knob */
    align-items: center;
    justify-content: center;
  }

  /* Switch BG: Checked */
  input:checked + .slider {
    background-color: var(--nys-color-theme, #154973);
  }

  /* Switch BG: Hover */
  input:hover + .slider {
    background-color: var(--nys-color-theme-strong, #0E324F);
  }

  /* Switch BG: Active */
  input:active + .slider {
    background-color: var(--nys-color-theme-stronger, #081B2B);
  }

  /* Switch Outline: Focus */
  input:focus + .slider {
    box-shadow:
      0 0 0 1px white,
      0 0 0 3px var(--nys-color-theme, #154973);
  }

  /* Switch Outline: Focus and checked */
  input:checked:focus + .slider {
    box-shadow:
      0 0 0 1px white,
      0 0 0 4px var(--slider-checked-focus-border);
  }

  /* Switch Knob: Checked */
  input:checked + .slider .knob {
    transform: translateX(var(--slider-checked-translate));
  }

  /* Icon Styling */
  .toggle-icon {
    position: absolute;
    color: var(--nys-color-base, #797C7F);
  }
  input:checked + .slider .knob .toggle-icon {
    color: var(--nys-color-theme, #154973);
  }
  :host([size="sm"]) .toggle-icon {
    font-size: calc(var(--icon-font-size) + 3px);
  }
  :host([size="md"]) .toggle-icon {
    font-size: var(--icon-font-size);
  }
  /* If 'cap' is not supported, account for the extra padding from svg due to nys-icon's 'display:inline' */
  @supports not (font-size: 1cap) {
    :host([size="sm"]) .toggle-icon {
      font-size: var(--icon-font-size);
    }
    :host([size="md"]) .toggle-icon {
      font-size: calc(var(--icon-font-size) - 1px);
    }
  }

  /*** Disabled State ***/
  /* Switch BG: Disabled */
  input:disabled + .slider {
    background-color: var(--nys-color-base-weaker, #D0D0CE);
    cursor: not-allowed;
  }
  input:disabled + .slider .knob .toggle-icon {
    color: var(--nys-color-base-weaker, #D0D0CE);
  }

  /* Sizes */
  :host([size="sm"]) {
    --toggle-width: 36px;
    --toggle-height: 20px;
    --slider-diameter: 16px;
    --label-font-size: 12px;
    --description-font-size: 10px;
    --description-spacing: 5px;
    --icon-font-size: 7px;
  }

  :host([size="md"]) {
    --toggle-width: 44px;
    --toggle-height: 24px;
    --slider-diameter: 20px;
    --label-font-size: 14px;
    --description-font-size: 12px;
    --description-spacing: 7px;
    --icon-font-size: 14px;
  }
`;
