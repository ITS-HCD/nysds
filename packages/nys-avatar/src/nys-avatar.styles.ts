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
  }

  /* Sizes */
  :host([size="sm"]) {
    --toggle-width: 36px;
    --toggle-height: 20px;
    --slider-diameter: 16px;
    --label-font-size: 12px;
    --description-font-size: 10px;
    --description-spacing: 5px;
    --icon-font-size: 13px;
  }

  :host([size="md"]) {
    --toggle-width: 44px;
    --toggle-height: 24px;
    --slider-diameter: 20px;
    --label-font-size: 14px;
    --description-font-size: 12px;
    --description-spacing: 7px;
    --icon-font-size: 16px;
  }
`;
