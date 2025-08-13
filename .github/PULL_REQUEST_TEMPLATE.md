<!---
Welcome! Thank you for contributing to New York State's Design System (NYSDS).
Your contributions are vital to our success, and we are glad you're here.

This pull request (PR) template helps speed up reviews and merging into the public codebase.
Please provide as much detail as possible to help us understand your changes.
In other words: we love clear explanations!
-->

<!---
Title format:
NYSDS – [Component]: [Brief statement of what this PR solves]
e.g. "NYSDS – Button: Update hover states"
-->

# Summary

_Provide a summary that we can use for the changelog._

<!--
Write in past tense and include:
- What was changed
- Why was it changed
- The benefit from the update
-->

## Breaking change

_Indicate if this update is a breaking change with **one** of the following statements:_

This is **not** a breaking change.  
:warning: This is **potentially** a breaking change.  
:warning: This is a **breaking change**.

<!--
Breaking changes can include:
  - Changes to a component’s JavaScript API
  - Changes to required HTML/markup
  - Major design or significant style updates
If applicable, explain the required actions users must take to adapt to the change.
-->

## Related issues

Closes #_[issue_no]_

<!--
Every pull request should resolve an open issue.
If no issue exists, please create one so we can track the changes at:
https://github.com/its-hcd/nysds/issues/new/choose
-->

## Related pull requests

_If this PR depends on other PRs (e.g. documentation changes in another repo), list them here (with links)._

<!--
For example:
- If this PR requires an update to the Storybook documentation, list that PR.
- If a change to the component library requires an update to the reference site, include a link to the PR for [NYSDS site repo](https://github.com/its-hcd/nysds-site).
-->

## Preview link

_Provide a link to a demo or deployment preview, if available._

<!--
This could include a deployed Storybook instance, staging environment, or Netlify preview.
-->

## Problem statement

_What problem does this solve? Who is impacted? Why is it important?_

<!--
A successful problem statement conveys:
1. The desired state
2. The current/actual state
3. The impact of the current problem (who it affects and why it's important to solve)
-->

## Solution

_Provide a summary of the solution this PR offers._

<!--
It can be helpful to include:
1. The specific changes made to resolve the issue
2. Why this approach was chosen over alternatives
3. Possible limitations, alternate solutions, or follow-up work
-->

## Major changes

_For complex or multi-part PRs, list significant changes made:_

- **New components**: (e.g., `Modal` component)
- **Modified components**: (e.g., updates to `Button` component for new styling)
- **Design tokens**: (e.g., new color tokens for accessibility)
- **Documentation updates**: (mention changes to Storybook, README, or component docs)

## Screenshots (if applicable)

_Include screenshots or GIFs to demonstrate visual or functional changes to components._

## Testing and review

_Provide testing instructions and any special notes for the reviewer._

<!--
Testing instructions can include:
1. Steps to reproduce the issue (if it's a bug fix)
2. How to test the new or updated component
3. Specific feedback you are looking for (e.g., design accuracy, performance, accessibility)
-->

### Browser testing

_Indicate whether you have tested your changes in multiple browsers (e.g., Chrome, Firefox, Safari)._  
Tested on:

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] iOS Safari _(optional)_
- [ ] Android Chrome _(optional)_

### Accessibility testing

_Indicate the accessibility checks you have completed:_

- [ ] Screen reader testing
- [ ] Keyboard navigation
- [ ] Color contrast checks
- [ ] Axe/Lighthouse audit
- [ ] Other: _[describe]_

### Unit and integration tests

- [ ] Unit tests updated/added
- [ ] Integration tests updated/added

## Additional considerations

_Anything else to call out? (performance, dependencies, migration notes, backward compatibility, security)_

<!--
Ask yourself:
- Is this change backward-compatible with existing components?
- Does this change introduce new dependencies?

If this PR updates dependencies, please include the table below.
-->
<!--
## Dependency updates
| Dependency name              | Previous version | New version |
| ---------------------------- | :--------------: | :---------: |
| [Updated dependency example] |     [1.0.0]      |   [1.0.1]   |
| [New dependency example]     |        --        |   [3.0.1]   |
| [Removed dependency example] |     [2.10.2]     |     --      |
-->
<!--
For PRs that include dependency updates, uncomment this section and
include a list of the changed dependencies and version numbers.
-->

<!--
## Before submitting this PR, confirm:
- [ ] The code follows the NYSDS coding guidelines.
- [ ] Accessibility checks are complete (see above).
- [ ] Run `git pull origin [base branch]` to pull latest from base branch and resolved conflicts (our base branch is `develop`).
- [ ] Run your code through [HTML_CodeSniffer](http://squizlabs.github.io/HTML_CodeSniffer/) and make sure it’s error free.
- [ ] Run `npm run test` and confirm that all tests pass.
- [ ] Update relevant documentation.
-->
