# NYSDS with React

> **Note:** React integration is currently untested. The guidance below is based on standard web component usage patterns and may require adjustments.

## Installation

```bash
npm install @nysds/components @nysds/styles
```

## Load styles

Import the NYSDS stylesheet in your app entry point (e.g., `index.tsx` or `App.tsx`):

```tsx
// New project: includes reset, typography, and utility classes
import '@nysds/styles/dist/nysds-full.min.css';

// Existing project: CSS variables only (styles components, nothing else)
// import '@nysds/styles/dist/nysds.min.css';
```

## Usage

Import components and use them in JSX:

```tsx
import '@nysds/nys-button';
import '@nysds/nys-alert';

function App() {
  return (
    <div>
      <nys-button label="Click me"></nys-button>
      <nys-alert type="info">This is an alert.</nys-alert>
    </div>
  );
}
```

## Notes on web components in React

- String attributes work normally: `<nys-button label="Click me" />`
- For event listeners, use `ref` and `addEventListener` — React's synthetic event system doesn't forward to custom elements
- Boolean attributes should be set explicitly: `<nys-button disabled={true} />`

## Using the stepper in React (multi-page pattern)

`nys-stepper` requires careful state management in React. Two state variables are needed:

- `currentStep` — the furthest step the user has reached (progress boundary). Maps to the `current` prop on `NysStep`.
- `viewingStep` — which step's content is currently displayed. Maps to the `selected` prop on `NysStep`.

**Always pass both `current` and `selected` explicitly from React state.** Without explicit `selected`, the stepper's internal fallback will override the user's sidebar navigation on every React re-render.

**Event listening:** Use `onNysStepClick` on each `NysStep` (not on `NysStepper`). Always call `e.preventDefault()` to suppress `href`-based page navigation.

**Do not use `href` for SPA routing.** Omit `href` and handle step changes entirely in React state.

**Do not place `<NysStepper>` inside a `<form>` element.**

```tsx
import { useState } from 'react';
import { NysStepper, NysStep, NysButton } from '@nysds/components/react';

const STEPS = [
  { label: 'Personal Info',   content: <PersonalInfoForm /> },
  { label: 'Contact Details', content: <ContactForm /> },
  { label: 'Review',          content: <ReviewForm /> },
];

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [viewingStep, setViewingStep] = useState(0);

  function handleContinue() {
    if (viewingStep < STEPS.length - 1) {
      setCurrentStep(viewingStep + 1);
      setViewingStep(viewingStep + 1);
    }
  }

  return (
    <div className="nys-grid-row">
      <NysStepper label="Application" className="nys-grid-col-12 nys-desktop:nys-grid-col-3">
        {STEPS.map((step, i) => (
          <NysStep
            key={i}
            label={step.label}
            current={i === currentStep}
            selected={i === viewingStep}
            onNysStepClick={(e) => { e.preventDefault(); setViewingStep(i); }}
          />
        ))}
        <div slot="actions">
          <NysButton label="Save & Exit" variant="outline" fullWidth />
        </div>
      </NysStepper>

      <main className="nys-grid-col-12 nys-desktop:nys-grid-col-9">
        {STEPS[viewingStep].content}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {viewingStep > 0 && (
            <NysButton label="Back" variant="outline"
              onNysClick={() => setViewingStep((v) => v - 1)} />
          )}
          {viewingStep === currentStep && currentStep < STEPS.length - 1 && (
            <NysButton label="Continue" onNysClick={handleContinue} />
          )}
        </div>
      </main>
    </div>
  );
}
```
