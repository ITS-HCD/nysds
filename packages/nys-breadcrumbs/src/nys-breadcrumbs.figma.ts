import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BREADCRUMBS>", {
  props: {
    size: figma.enum("Size", {
      md: "md",
      sm: "sm",
    }),
    collapsed: figma.boolean("Collapsed"),
    backgroundBar: figma.boolean("Background Bar"),
    backToParent: figma.boolean("Back to Parent"),
  },
  example: (props) => html`
    <nys-breadcrumbs
      size="${props.size}"
      collapsed="${props.collapsed}"
      backToParent="${props.backToParent}"
      backgroundBar="${props.backgroundBar}"
    >
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/link">{pageTitle}</a></li>
        <li><a href="/link">{pageTitle}</a></li>
        <li>Current Page</li>
      </ol>
    </nys-breadcrumbs>
  `,
});
