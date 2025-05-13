/*** Accessibility tests ***/
/*
 * Ensure radiobutton has a label property to provide accessible text for screen readers:
 * - If description exist, it should be used readable for screen readers.
 * - If text contains prop "optional", make sure it is readable to screen readers.
 */

/*
 * Ensure radiobutton is focusable and keyboard accessibility.
 */

/*
 * Ensure aria-checked is correctly set based on the checkbox's checked state:
 * - The aria-checked attribute should be dynamically set to "true" when the checkbox is checked and "false" when it is unchecked.
 */

/*
 * Ensure aria-required is set correctly when the radiobutton is required:
 * - When the radiobutton is required (this.required = true), the aria-required attribute should be set to "true."
 */

/*
 * Ensure aria-disabled is set correctly when the radiobutton is disabled:
 * - When the radiobutton is disabled (this.disabled = true), the aria-disabled attribute should be set to "true."
 */

/*
 * Ensure the radiobutton has error messaging for invalid states:
 * - Ex: if radio GROUP required, radiobutton must have one checked
 */

/* ACCESSIBILITY INSIGHT TOOL (Feedback) */
// "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds"
