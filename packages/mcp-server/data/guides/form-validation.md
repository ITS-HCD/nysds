# NYSDS Form Validation Guide

## Overview

NYSDS form components include built-in validation support using the `showError` and `errorMessage` properties. All form components integrate with ElementInternals for native form validation.

## Error Display Properties

All NYSDS form components support these validation properties:

| Property | Type | Description |
|----------|------|-------------|
| `showError` | boolean | When true, displays the error state |
| `errorMessage` | string | The error message to display |
| `required` | boolean | Marks the field as required |

## Error Summary Pattern

Display an error summary at the top of forms with links to each field:

```html
<nys-alert type="danger" heading="Please correct the following errors">
  <ul>
    <li><a href="#email-field">Email address is required</a></li>
    <li><a href="#phone-field">Phone number format is invalid</a></li>
  </ul>
</nys-alert>
```

This pattern:
- Appears at the top of the form after submission attempt
- Lists all errors with anchor links to the fields
- Helps users quickly navigate to problem areas
- Is essential for accessibility (screen reader users)

## Inline Error Pattern

Display errors directly on the form fields:

```html
<nys-textinput
  id="email-field"
  label="Email"
  required
  showError
  errorMessage="Please enter a valid email address"
></nys-textinput>

<nys-select
  id="state-field"
  label="State"
  required
  showError
  errorMessage="Please select a state"
></nys-select>

<nys-radiogroup
  id="preference-field"
  label="Contact Preference"
  showError
  errorMessage="Please select a contact preference"
>
  <nys-radiobutton label="Email" value="email"></nys-radiobutton>
  <nys-radiobutton label="Phone" value="phone"></nys-radiobutton>
</nys-radiogroup>
```

## Complete Form Example

```html
<form id="contact-form" novalidate>
  <!-- Error summary (hidden initially, shown on validation failure) -->
  <nys-alert id="error-summary" type="danger" heading="Please correct the following errors" hidden>
    <ul id="error-list"></ul>
  </nys-alert>

  <nys-textinput
    id="name-field"
    label="Full Name"
    required
    class="nys-margin-b-300"
  ></nys-textinput>

  <nys-textinput
    id="email-field"
    label="Email Address"
    type="email"
    required
    class="nys-margin-b-300"
  ></nys-textinput>

  <nys-textarea
    id="message-field"
    label="Message"
    required
    class="nys-margin-b-400"
  ></nys-textarea>

  <nys-button type="submit" label="Submit"></nys-button>
</form>
```

## JavaScript Validation Example

```javascript
const form = document.getElementById('contact-form');
const errorSummary = document.getElementById('error-summary');
const errorList = document.getElementById('error-list');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const errors = [];

  // Validate each field
  const nameField = document.getElementById('name-field');
  if (!nameField.value) {
    nameField.showError = true;
    nameField.errorMessage = 'Full name is required';
    errors.push({ id: 'name-field', message: 'Full name is required' });
  } else {
    nameField.showError = false;
  }

  const emailField = document.getElementById('email-field');
  if (!emailField.value) {
    emailField.showError = true;
    emailField.errorMessage = 'Email address is required';
    errors.push({ id: 'email-field', message: 'Email address is required' });
  } else if (!isValidEmail(emailField.value)) {
    emailField.showError = true;
    emailField.errorMessage = 'Please enter a valid email address';
    errors.push({ id: 'email-field', message: 'Please enter a valid email address' });
  } else {
    emailField.showError = false;
  }

  // Show/hide error summary
  if (errors.length > 0) {
    errorList.innerHTML = errors
      .map(err => `<li><a href="#${err.id}">${err.message}</a></li>`)
      .join('');
    errorSummary.hidden = false;
    errorSummary.scrollIntoView({ behavior: 'smooth' });
  } else {
    errorSummary.hidden = true;
    form.submit();
  }
});
```

## Form Components with Validation Support

The following NYSDS components support `showError` and `errorMessage`:

- `nys-textinput` - Text input fields
- `nys-textarea` - Multi-line text areas
- `nys-select` - Dropdown selects
- `nys-radiogroup` - Radio button groups
- `nys-checkbox` - Checkboxes
- `nys-checkboxgroup` - Checkbox groups
- `nys-date` - Date pickers

## Accessibility Considerations

1. **Error summary links**: Include anchor links to fields for keyboard navigation
2. **Focus management**: Move focus to error summary or first error field on validation failure
3. **ARIA attributes**: NYSDS components automatically set `aria-invalid` and `aria-describedby`
4. **Clear error messages**: Use specific, actionable error text
