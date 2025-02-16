import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_ALERTS_ALERT>", {
  variant: { Contents: "Heading Only" },
  props: {
    heading: figma.string("Heading"),
    type: figma.enum("Intent", {
      "🔵 Info": "info",
      "🟢 Success": "success",
      "🟡 Warning": "warning",
      "🔴 Danger": "danger",
      "🛟 Emergency": "emergency",
      "🔘 Base": "base",
    }),
    dismissible: figma.boolean("Dismissible")
  },
  example: (props) => html`
    <nys-alert 
      type="${props.type}"
      heading="${props.heading}"
      dismissible="${props.dismissible}"
    ></nys-alert>
  `,
});

figma.connect("<FIGMA_ALERTS_ALERT>", {
  variant: { Contents: "Heading + Text" },
  props: {
    heading: figma.string("Heading"),
    text: figma.string("Text"),
    type: figma.enum("Intent", {
      "🔵 Info": "info",
      "🟢 Success": "success",
      "🟡 Warning": "warning",
      "🔴 Danger": "danger",
      "🛟 Emergency": "emergency",
      "🔘 Base": "base",
    }),
    dismissible: figma.boolean("Dismissible")
  },
  example: (props) => html`
    <nys-alert 
      type="${props.type}"
      heading="${props.heading}"
      text="${props.text}"
      dismissible="${props.dismissible}"
    ></nys-alert>
  `,
});

figma.connect("<FIGMA_ALERTS_ALERT>", {
  variant: { Contents: "Heading + Text + Actions" },
  props: {
    heading: figma.string("Heading"),
    text: figma.string("Text"),
    primaryLabel: figma.string("Primary Action"),
    secondaryLabel: figma.string("Secondary"),
    type: figma.enum("Intent", {
      "🔵 Info": "info",
      "🟢 Success": "success",
      "🟡 Warning": "warning",
      "🔴 Danger": "danger",
      "🛟 Emergency": "emergency",
      "🔘 Base": "base",
    }),
    dismissible: figma.boolean("Dismissible")
  },
  example: (props) => html`
    <nys-alert
      type="${props.type}"
      heading="${props.heading}"
      text="${props.text}"
      dismissible="${props.dismissible}"
      primaryLabel="${props.primaryLabel}"
      primaryAction="https://..."
      secondaryLabel="${props.secondaryLabel}"
      secondaryAction="https://..."
    ></nys-alert>
  `,
});

figma.connect("<FIGMA_ALERTS_ALERT>", {
  variant: { Contents: "Heading + Actions" },
  props: {
    heading: figma.string("Heading"),
    primaryLabel: figma.string("Primary Action"),
    secondaryLabel: figma.string("Secondary"),
    type: figma.enum("Intent", {
      "🔵 Info": "info",
      "🟢 Success": "success",
      "🟡 Warning": "warning",
      "🔴 Danger": "danger",
      "🛟 Emergency": "emergency",
      "🔘 Base": "base",
    }),
    dismissible: figma.boolean("Dismissible")
  },
  example: (props) => html`
    <nys-alert 
      type="${props.type}"
      heading="${props.heading}"
      dismissible="${props.dismissible}"
      primaryLabel="${props.primaryLabel}"
      primaryAction="https://..."
      secondaryLabel="${props.secondaryLabel}"
      secondaryAction="https://..."
    ></nys-alert>
  `,
});