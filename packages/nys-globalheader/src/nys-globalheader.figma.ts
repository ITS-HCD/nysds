import figma, { html } from "@figma/code-connect/html";

// Variant: Application Name Only
figma.connect("<FIGMA_GLOBALHEADER>", {
  variant: { Content: "Application" },
  props: {
    appName: figma.string("Application Name"),
  },
  example: (props) => html`
    <nys-globalheader 
      appName="${props.appName}"
      homepageLink="https://"
    >
      <!-- Placeholder, replace with real agency links -->
      <ul>
        <li><a href="https://">Placeholder</a></li>
        <li><a href="https://">Placeholder</a></li>
      </ul>
    </nys-globalheader>
  `,
});

// Variant: Agency Name Only
figma.connect("<FIGMA_GLOBALHEADER>", {
  variant: { Content: "Agency" },
  props: {
    agencyName: figma.string("Agency Name"),
  },
  example: (props) => html`
    <nys-globalheader 
      agencyName="${props.agencyName}"
      homepageLink="https://"
    >
      <!-- Placeholder, replace with real agency links -->
      <ul>
        <li><a href="https://">Placeholder</a></li>
        <li><a href="https://">Placeholder</a></li>
      </ul>
    </nys-globalheader>
  `,
});

// Variant: Application + Agency Name
figma.connect("<FIGMA_GLOBALHEADER>", {
  variant: { Content: "Application + Agency" },
  props: {
    appName: figma.string("Application Name"),
    agencyName: figma.string("Agency Name"),
  },
  example: (props) => html`
    <nys-globalheader
      appName="${props.appName}"
      agencyName="${props.agencyName}"
      homepageLink="https://"
    >
      <!-- Placeholder, replace with real agency links -->
      <ul>
        <li><a href="https://">Placeholder</a></li>
        <li><a href="https://">Placeholder</a></li>
      </ul>
    </nys-globalheader>
  `,
});
