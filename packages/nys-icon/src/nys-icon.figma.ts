import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_ICON>", {
  props: {
    size: figma.enum("size", {
      "12": "12",
      "24": "24",
      "32": "32",
      "48": "48",
      "64": "64",
      "2xs": "2xs",
      xs: "xs",
      sm: "sm",
      md: "md",
      lg: "lg",
      xl: "xl",
      "2xl": "2xl",
      "3xl": "3xl",
      "4xl": "4xl",
      "5xl": "5xl",
    }),
    name: figma.instance("shape").getProps<{ name: string }>(),
  },
  example: (props) => html`
    <nys-icon name="${props.name}" size="${props.size}"></nys-icon>
  `,
});

// account_circle
figma.connect(
  "https://www.figma.com/design/Tad3pBv2jhA8XVf6aMlKEi?node-id=1-65",
  {
    props: { name: "account_circle" },
    example: (props) => html`${props.name}`,
  },
);
