# New York State Design System

This repository contains a library of reusable code components for building New York State applications and websites. These components are built using LitElement and styled with custom CSS properties (variables) for easy customization.

## About the New York State Design System
Our mission is to standardize and elevate digital experiences across New York State by providing scalable, accessible tools for building applications.

### What’s Included?
 - **Components**: Modular web components built with Lit for performance and flexibility.
 - **Styles**: A foundational CSS framework, including design tokens and utility classes.
 - **Themes**: Customizable agency-specific themes for adapting designs to organizational branding.
 - **Figma Libraries**: Design libraries for prototyping that mirror the components and variables in code, promoting consistency between design and development.

### Why Use NYSDS?

#### Key Benefits
 - **Accessibility**: Every component is tested to meet WCAG 2.2 standards.
 - **Lit-based Web Components**: Built on the powerful and lightweight Lit framework, web components are native code designed to work seamlessly across modern frameworks or standalone applications.
 - **Customizable Design Tokens**: CSS variables that serve as a foundation for consistently building new components.
 - **Override-Friendly Architecture**: Components are designed with built-in overrides, making it easy to styles and behavior to meet specific application needs.

## Install the NYSDS
To start using the NYSDS in your project, you need to install the core libraries:

```bash
npm install @nysds/components @nysds/styles
```

### Reference the files in your application
```html
<script type="module" src="[path-to-dir]/nysds.js"></script>
<link rel="stylesheet" href="[path-to-dir]/nysds-full.min.css" />
```