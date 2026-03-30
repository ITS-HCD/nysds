# NYSDS with React

> **Note:** React integration is currently untested. The guidance below is based on standard web component usage patterns and may require adjustments.

## Installation

```bash
npm install @nysds/components
```

## Usage

```jsx
import '@nysds/components/nys-button';

function App() {
  return <nys-button label="Click me" />;
}
```

Note: Web components work in React but require property binding for complex types.
