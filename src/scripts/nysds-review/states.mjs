/**
 * Interactive states captured by the visual regression run (visual.mjs).
 *
 * Each entry adds one screenshot per state for one story: the story is loaded
 * fresh, the target is hovered, pressed, keyboard-focused or clicked, and the
 * page is captured and compared against the base branch like any other story. Results
 * show up in the report as "<Component> - <Story> (<state>)".
 *
 *   package    nys-* package whose SCSS has the :hover/:active/:focus-visible rules
 *   story      which story page to use: the story's export name in kebab case, as in
 *              its preview path (nys-avatar/interactive → "interactive"); default:
 *              the package's first story
 *   target     Playwright selector for the element to interact with. CSS selectors
 *              reach into open shadow roots, so "nys-button .nys-button" finds the
 *              <button> inside nys-button's shadow DOM.
 *   states     any of "hover", "active" (mouse held down), "focus" (tabbed to, so
 *              :focus-visible applies), "click" (clicked, capturing the result,
 *              such as an expanded accordion). Only give "click" to targets that
 *              change in place: a click that navigates fails the shot.
 *   open       optional selector clicked first, for targets that only render once
 *              something is opened (menus)
 *   viewports  optional subset of viewports, for targets hidden at some sizes
 *   skip       instead of states: why this package's state styles aren't captured
 *
 * Every package with state styles needs an entry (or a skip): the run warns
 * about any that are missing.
 */
export default [
  {
    package: "nys-accordion",
    target: "nys-accordionitem .nys-accordionitem__heading",
    states: ["hover", "active", "focus", "click"],
  },
  {
    package: "nys-avatar",
    story: "interactive",
    target: "nys-avatar button.nys-avatar__component",
    states: ["hover", "active", "focus"],
  },
  {
    package: "nys-breadcrumbs",
    target: "nys-breadcrumbs a",
    states: ["hover", "active", "focus"],
  },
  {
    package: "nys-button",
    target: "nys-button .nys-button",
    states: ["hover", "active", "focus"],
  },
  {
    package: "nys-card",
    story: "clickable",
    // No "click": this story's card runs alert(), which changes nothing visible.
    target: "nys-card .nys-card--clickable",
    states: ["hover", "active", "focus"],
  },
  {
    package: "nys-checkbox",
    target: "nys-checkbox .nys-checkbox__checkbox",
    states: ["hover", "active", "focus", "click"],
  },
  {
    package: "nys-combobox",
    target: "nys-combobox .nys-combobox__input",
    states: ["hover", "click"],
  },
  {
    package: "nys-datepicker",
    target: "nys-datepicker #calendar-button",
    states: ["hover", "active", "focus", "click"],
  },
  {
    package: "nys-dropdownmenu",
    open: "nys-button .nys-button",
    target: "nys-dropdownmenuitem a",
    states: ["hover", "active"],
  },
  {
    package: "nys-fileinput",
    story: "dropzone",
    target: "nys-fileinput .nys-fileinput__dropzone",
    states: ["hover"],
  },
  {
    package: "nys-globalfooter",
    story: "homepage-link",
    target: "nys-globalfooter .nys-globalfooter__heading-container a",
    states: ["hover", "focus"],
  },
  {
    package: "nys-globalheader",
    story: "with-links",
    target: "nys-globalheader > ul a",
    states: ["hover", "active", "focus"],
    // Below 1024px the links are inside the closed mobile menu.
    viewports: ["desktop"],
  },
  {
    package: "nys-modal",
    story: "actions-slot",
    target: "#modal-wrapper3 > nys-button",
    states: ["click"],
  },
  {
    package: "nys-radiobutton",
    // The radios render inside nys-radiogroup's shadow DOM, not in nys-radiobutton.
    target: "nys-radiogroup .nys-radiobutton",
    states: ["hover", "active"],
  },
  {
    package: "nys-radiobutton",
    target: "nys-radiogroup .nys-radiobutton__radio",
    states: ["focus", "click"],
  },
  {
    package: "nys-select",
    target: "nys-select .nys-select__select",
    states: ["hover"],
  },
  {
    package: "nys-skipnav",
    target: "nys-skipnav .nys-skipnav__link",
    states: ["focus"],
  },
  {
    package: "nys-stepper",
    target: "nys-step .nys-step__contentwrapper",
    states: ["focus"],
  },
  {
    package: "nys-tab",
    target: "nys-tab:not([selected])",
    states: ["hover", "active", "focus", "click"],
  },
  {
    package: "nys-textarea",
    target: "nys-textarea .nys-textarea__textarea",
    states: ["hover", "focus"],
  },
  {
    package: "nys-textinput",
    target: "nys-textinput .nys-textinput__input",
    states: ["hover", "focus"],
  },
  {
    package: "nys-toggle",
    target: "nys-toggle .slider",
    states: ["hover", "active", "click"],
  },
  {
    package: "nys-toggle",
    target: "nys-toggle input",
    states: ["focus"],
  },
  {
    package: "nys-unavfooter",
    // The first link is the logo, which has no visible hover state.
    target: "nys-unavfooter a:not(#nys-unavheader__logolink)",
    states: ["hover", "active"],
  },
  {
    package: "nys-verticalnav",
    target: "nys-verticalnav ul a",
    states: ["hover", "active", "focus"],
    // Below desktop the links are inside the collapsed menu.
    viewports: ["desktop"],
  },
  {
    package: "nys-video",
    // No "click": playing swaps in YouTube's player, loaded from the network,
    // so the screenshot would track YouTube rather than this code.
    target: "nys-video .nys-video__play-icon",
    states: ["hover", "active", "focus"],
  },
];
