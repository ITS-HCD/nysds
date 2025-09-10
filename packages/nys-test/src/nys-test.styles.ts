import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Test Styles */
    --_nys-test-width: fit-content;
    --_nys-test-height: var(--nys-size-600, 48px);
    --_nys-test-radius: var(--nys-radius-xl, 12px);
    --_nys-test-padding: var(--nys-space-100, 8px);
    --_nys-test-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-test-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-test-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-test-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-test-font-family: var(
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
  }

  .nys-test {
    width: var(--_nys-test-width);
    height: var(--_nys-test-height);
    border-radius: var(--_nys-test-radius);
    padding: var(--_nys-test-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-test-gap);
    font-family: var(--_nys-test-font-family);
    font-size: var(--_nys-test-font-size);
    font-weight: var(--_nys-test-font-weight);
    line-height: var(--_nys-test-line-height);
  }
`;
