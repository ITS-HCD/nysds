import { css } from "lit";

export default css`
  :host {
    --toggle-width: 46px;
    --toggle-height: 24px;
    --slider-diameter: 18px;
    --slider-offset: calc((var(--toggle-height) - var(--slider-diameter)) / 2);
    --slider-checked-translate: calc(
      var(--toggle-width) - var(--slider-diameter) - var(--slider-offset) - 4px
    );

    /* Slider colors */
    --slider-checked-background: #1c73a8;
    --slider-unchecked-background: #ccc;
    --slider-checked-focus-border: #146598;

    /* Font sizes and spacing for labels/descriptions and icons */
    --label-font-size: 14px;
    --description-font-size: 12px;
    --description-spacing: 7px;
    --icon-font-size: 12px;
  }

  /* Slotted Styling */
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

  .nys-toggle__content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .texts-right-container {
    display: flex;
    flex-direction: column;
    font-size: var(--label-font-size);
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--slider-unchecked-background);
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
    background-color: white;
    transition: 0.3s;
    overflow: hidden;
    display: flex; /* Center icon inside the knob */
    align-items: center;
    justify-content: center;
  }

  /* Switch BG: Checked */
  input:checked + .slider {
    background-color: var(--slider-checked-background);
  }

  /* Switch Outline: Focus */
  input:focus + .slider {
    box-shadow:
      0 0 0 1px white,
      0 0 0 3px var(--slider-checked-background);
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
    color: var(--slider-unchecked-background);
  }
  input:checked + .slider .knob .toggle-icon {
    color: var(--slider-checked-background);
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
    :host([size="lg"]) .toggle-icon {
      font-size: var(--icon-font-size);
    }
  }

  /*** Disabled State ***/
  input:disabled + .slider {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }

  input:disabled + .slider .knob {
    background-color: #bdbdbd;
  }

  input:checked:disabled + .slider {
    background-color: #a5a5a5;
  }

  input:disabled + .slider .knob .toggle-icon {
    color: #f6f8fa;
  }

  input:checked:disabled + .slider .knob .toggle-icon {
    color: #f6f8fa;
  }

  /* Sizes */
  :host([size="sm"]) {
    --toggle-width: 36px;
    --toggle-height: 18px;
    --slider-diameter: 12px;
    --label-font-size: 12px;
    --description-font-size: 10px;
    --description-spacing: 5px;
    --icon-font-size: 7px;
  }

  :host([size="md"]) {
    --toggle-width: 46px;
    --toggle-height: 24px;
    --slider-diameter: 18px;
    --label-font-size: 14px;
    --description-font-size: 12px;
    --description-spacing: 7px;
    --icon-font-size: 12px;
  }

  :host([size="lg"]) {
    --toggle-width: 60px;
    --toggle-height: 30px;
    --slider-diameter: 24px;
    --label-font-size: 16px;
    --description-font-size: 14px;
    --description-spacing: 10px;
    --icon-font-size: 13px;
  }
`;
