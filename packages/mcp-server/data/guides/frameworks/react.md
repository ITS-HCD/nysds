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
import '@nysds/components/nys-button';
import '@nysds/components/nys-alert';

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
