import { css } from "lit";

export default css`
  :host {
    --switch-width: 46px;
    --switch-height: 24px;
    --slider-diameter: 18px;
    --slider-offset: calc((var(--switch-height) - var(--slider-diameter)) / 2);
    --slider-checked-translate: calc(
      var(--switch-width) - var(--slider-diameter) - var(--slider-offset) - 4px
    );

    /* Slider colors */
    --slider-checked-background: #1c73a8;
    --slider-unchecked-background: #ccc;
    --slider-checked-focus-border: #146598;

    /* Font sizes and spacing for labels/descriptions */
    --label-font-size: 14px;
    --description-font-size: 12px;
    --description-spacing: 7px;
  }

  ::slotted(p) {
    margin: 0;
  }

  ::slotted([slot^="description"]) {
    font-size: var(--description-font-size);
    color: gray;
  }

  ::slotted([slot="description-bottom"]) {
    margin-top: var(--description-spacing);
  }

  .nys-toggle--main-container {
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
  .switch {
    position: relative;
    display: inline-block;
    width: var(--switch-width);
    height: var(--switch-height);
  }

  .switch input {
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
  /* If 'cap' is not supported, account for the extra padding from svg due to nys-icon's 'display:inline' */
  @supports not (font-size: 1cap) {
    :host([size="sm"]) .toggle-icon {
      font-size: 7px;
    }
    .toggle-icon {
      font-size: 13px;
    }
  }
  :host([size="sm"]) .toggle-icon {
    font-size: 12px;
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
    --switch-width: 36px;
    --switch-height: 18px;
    --slider-diameter: 12px;
    --label-font-size: 12px;
    --description-font-size: 10px;
    --description-spacing: 5px;
  }

  :host([size="md"]) {
    --switch-width: 46px;
    --switch-height: 24px;
    --slider-diameter: 18px;
    --label-font-size: 14px;
    --description-font-size: 12px;
    --description-spacing: 7px;
  }

  :host([size="lg"]) {
    --switch-width: 60px;
    --switch-height: 30px;
    --slider-diameter: 24px;
    --label-font-size: 16px;
    --description-font-size: 14px;
    --description-spacing: 10px;
  }
`;
