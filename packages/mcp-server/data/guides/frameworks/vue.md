# NYSDS with Vue

## Installation

```bash
npm install @nysds/components
```

## Configuration

Configure Vue to recognize custom elements:

```javascript
// vite.config.js
export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('nys-')
        }
      }
    })
  ]
}
```

## Usage

```vue
<script setup>
import '@nysds/components/nys-button';
</script>

<template>
  <nys-button label="Click me" />
</template>
```
