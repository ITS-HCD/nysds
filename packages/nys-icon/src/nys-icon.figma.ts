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
    name: figma.instance("shape"),
  },
  example: (props) => html`
    <!-- Replace icon name with name="icon_name" attribute -->
    <nys-icon ${props.name} size="${props.size}"> </nys-icon>
  `,
});

/*
// account_circle
figma.connect(
  "https://www.figma.com/design/Tad3pBv2jhA8XVf6aMlKEi/%F0%9F%92%9F-NYSDS-%2F-Icons?node-id=1-65",
  {
    props: { name: "account_circle" },
    example: (props) => html`${props.name}`,
  },
);

// select
figma.connect(
  "https://www.figma.com/design/Tad3pBv2jhA8XVf6aMlKEi/%F0%9F%92%9F-NYSDS-%2F-Icons?node-id=3-20",
  {
    props: { name: "select" },
    example: (props) => html`${props.name}`,
  },
);

// check
figma.connect(
  "https://www.figma.com/design/Tad3pBv2jhA8XVf6aMlKEi/%F0%9F%92%9F-NYSDS-%2F-Icons?node-id=1-17",
  {
    props: { name: "check" },
    example: (props) => html`${props.name}`,
  },
);
*/
