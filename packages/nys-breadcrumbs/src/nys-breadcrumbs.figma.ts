import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BREADCRUMBS>", {
  props: {
    size: figma.enum("Size", {
      md: "md",
      sm: "sm",
    }),
    collapsed: figma.boolean("Collapsed"),
    backToParentMobile: figma.boolean("Back to Parent"),
  },
  example: (props) => html`
    <nys-breadcrumbs
      size="${props.size}"
      collapsed="${props.collapsed}"
      backToParentMobile="${props.backToParentMobile}"
    >
      <nys-breadcrumbitem link="/" label="{pageTitle}"></nys-breadcrumbitem>
      <nys-breadcrumbitem link="/link" label="{pageTitle}"></nys-breadcrumbitem>
      <nys-breadcrumbitem label="{currentPageTitle}"></nys-breadcrumbitem>
    </nys-breadcrumbs>
  `,
});
