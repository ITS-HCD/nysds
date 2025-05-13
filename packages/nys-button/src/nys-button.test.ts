/*** CORE tests ***/
/*
 * ENSURE FORM INTEGRATION (TYPE SUBMIT/RESET):
 * - Default button type is "button"
 * - If the button has type="submit" or type="reset", verify that:
 *    - It is part of a form
 *    - It correctly triggers form submission/reset behavior
 */

/*** Accessibility tests ***/
/*
 * ENSURE ARIA LABELS:
 * - Buttons should have a label property to provide accessible text for screen readers (or default fallback text "button")
 * - Buttons should have property "ariaLabel" filled if no label is provided (i.e. icon button). Otherwise, at least a default fallback for aria-label is provided (e.g. "button")
 */

/*
 * ENSURE Disabled STATE:
 * - If the button is disabled, it should not be focusable or operable
 * - Screen readers should announce the button as disabled
 */

/*
 * ENSURE KEYBOARD SUPPORT:
 * - Buttons should be focusable and operable using the keyboard (e.g. Enter, Space, Arrow keys)
 */

/* ACCESSIBILITY INSIGHT TOOL (Feedback) */
/*
 * ENSURE COLOR CONTRAST:
 * - Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
 */
