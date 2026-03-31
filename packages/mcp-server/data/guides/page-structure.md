# NYSDS Page Structure Guide

## Overview

All NYS web pages should follow a consistent structure using NYSDS components for headers, footers, and navigation. This ensures accessibility compliance and brand consistency.

## Required Page Structure

```
┌─────────────────────────────────────┐
│ nys-skipnav (hidden until focused)  │
├─────────────────────────────────────┤
│ nys-unavheader (Universal header)   │
├─────────────────────────────────────┤
│ nys-globalheader (Agency header)    │
├─────────────────────────────────────┤
│                                     │
│ <main id="main-content">            │
│   Page content goes here            │
│ </main>                             │
│                                     │
├─────────────────────────────────────┤
│ nys-backtotop                       │
├─────────────────────────────────────┤
│ <footer>                            │
│   nys-globalfooter (Agency footer)  │
│   nys-unavfooter (Universal footer) │
│ </footer>                           │
└─────────────────────────────────────┘
```

## Component Order (Top to Bottom)

### Header Section
1. **`<nys-skipnav>`** - Skip navigation link (first focusable element)
2. **`<nys-unavheader>`** - NYS Universal header (NY.gov branding)
3. **`<nys-globalheader>`** - Agency-specific header with navigation

### Main Content
4. **`<main id="main-content">`** - Semantic landmark containing page content
   - The `id="main-content"` is the default target for `nys-skipnav`
   - All primary page content belongs inside this element

### Footer Section
5. **`<nys-backtotop>`** - Back to top button (before footer)
6. **`<footer>`** - Semantic footer landmark containing:
   - **`<nys-globalfooter>`** - Agency-specific footer with links
   - **`<nys-unavfooter>`** - NYS Universal footer

## Complete Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | Agency Name</title>

  <!-- NYSDS Styles -->
  <link rel="stylesheet" href="path/to/@nysds/styles/dist/nysds-full.min.css">
  <!-- Agency Theme (optional) -->
  <link rel="stylesheet" href="path/to/@nysds/styles/dist/nysds-theme-[agency].min.css">
  <!-- Fonts -->
  <link rel="stylesheet" href="path/to/nysds-fonts.css">
  <link rel="preload" href="path/to/fonts/proximanova-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">
</head>
<body>
  <!-- Skip Navigation (must be first focusable element) -->
  <nys-skipnav></nys-skipnav>

  <!-- NYS Universal Header -->
  <nys-unavheader></nys-unavheader>

  <!-- Agency Global Header -->
  <nys-globalheader
    appName="Agency Name"
    homepageLink="https://agency.ny.gov/">
    <ul>
      <li><a href="/about">About</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nys-globalheader>

  <!-- Main Content Area -->
  <main id="main-content">
    <div class="nys-grid-container">
      <!-- Page content here -->
      <h1>Page Title</h1>
      <p>Content...</p>
    </div>
  </main>

  <!-- Back to Top Button -->
  <nys-backtotop></nys-backtotop>

  <!-- Footer Section -->
  <footer>
    <nys-globalfooter
      agencyName="Agency Name"
      homepageLink="https://agency.ny.gov/">
      <ul>
        <li><a href="/accessibility">Accessibility</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/contact">Contact Us</a></li>
      </ul>
    </nys-globalfooter>

    <nys-unavfooter></nys-unavfooter>
  </footer>

  <!-- NYSDS Components JavaScript -->
  <script type="module" src="path/to/@nysds/components/dist/nysds.js"></script>
</body>
</html>
```

## Page with Sidebar (e.g., Multi-Step Form)

For pages with a sidebar (like a stepper), use the grid system within `<main>`:

```html
<main id="main-content">
  <div class="nys-grid-container">
    <div class="nys-grid-row">
      <!-- Sidebar (stepper, navigation) -->
      <nys-stepper
        label="Application"
        class="nys-grid-col-12 nys-desktop:nys-grid-col-3">
        <nys-step label="Step 1" current></nys-step>
        <nys-step label="Step 2"></nys-step>
        <nys-step label="Step 3"></nys-step>
      </nys-stepper>

      <!-- Main content area -->
      <div class="nys-grid-col-12 nys-desktop:nys-grid-col-9">
        <h1>Step 1: Personal Information</h1>
        <!-- Form content -->
      </div>
    </div>
  </div>
</main>
```

## Accessibility Requirements

1. **Skip Navigation**: `nys-skipnav` must be the first focusable element
2. **Main Landmark**: Use `<main id="main-content">` for primary content
3. **Footer Landmark**: Wrap footer components in `<footer>` element
4. **Language**: Set `lang` attribute on `<html>` element
5. **Page Title**: Include descriptive `<title>` with page name and agency

## Common Mistakes to Avoid

- Do not place `nys-skipnav` after other focusable elements
- Do not use `href="#app"` or wrapper div as skipnav target (use `#main-content`)
- Do not omit the `<main>` landmark element
- Do not place `nys-backtotop` inside the `<footer>` element
- Do not omit `<footer>` wrapper around footer components
