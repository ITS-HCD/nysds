import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BREADCRUMBS>", {
  props: {
    size: figma.enum("Size", {
      md: "md",
      sm: "sm",
    }),
    collapsed: figma.boolean("Collapsed"),
    backgroundBar: figma.boolean("Background Bar"),
    backToParentMobile: figma.boolean("Back to Parent"),
  },
  example: (props) => html`
    <nys-breadcrumbs
      size="${props.size}"
      collapsed="${props.collapsed}"
      backToParentMobile="${props.backToParentMobile}"
      backgroundBar="${props.backgroundBar}"
    >
      <nys-breadcrumbitem link="/" label="{pageTitle}"></nys-breadcrumbitem>
      <nys-breadcrumbitem link="/link" label="{pageTitle}"></nys-breadcrumbitem>
      <nys-breadcrumbitem label="{currentPageTitle}"></nys-breadcrumbitem>
    </nys-breadcrumbs>
  `,
});
