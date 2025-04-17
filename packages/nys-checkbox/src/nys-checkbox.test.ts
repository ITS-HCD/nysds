/*** Accessibility tests ***/
/*
 * Ensure checkbox has a label property to provide accessible text for screen readers:
 * - If description exist, it should be used readable for screen readers.
 * - If text contains prop "optional", make sure it is readable to screen readers.
 */

/*
 * Clicking the label
 * - The aria-checked attribute should be dynamically set to "true" when the checkbox is checked and "false" when it is unchecked.
 */

/*
 * Ensure aria-checked is correctly set based on the checkbox's checked state:
 * - The aria-checked attribute should be dynamically set to "true" when the checkbox is checked and "false" when it is unchecked.
 */

/*
 * Ensure aria-required is set correctly when the checkbox is required:
 * - When the checkbox is required (this.required = true), the aria-required attribute should be set to "true."
 */

/*
 * Ensure checkbox is focusable and keyboard accessibility.
 */

/*
 * Ensure the checkbox has error messaging for invalid states:
 * - Ex: if checkbox GROUP required, checkboxes must have one checked
 * - Ex: if INDIVIDUAL checkbox required, checkbox must be checked
 */

/* ACCESSIBILITY INSIGHT TOOL (Feedback) */
// "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds"
