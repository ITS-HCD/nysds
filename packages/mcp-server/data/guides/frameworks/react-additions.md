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
import { NysStepper, NysStep, NysButton } from '@nysds/react';

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
