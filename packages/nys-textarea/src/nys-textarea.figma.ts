import figma, { html } from "@figma/code-connect/html";
import { Size } from "./nys-textarea.stories";

figma.connect(
  "https://www.figma.com/design/0ogYpymUPQQfhELthntNbt/%F0%9F%92%A0-NYS-%2F-Excelsior-Components-(Alpha)?node-id=2693-16429&t=bofmPKbwqmJlgzaf-1",
  {
    props: {
      value: figma.string("Input"),
      placeholder: figma.string("Placeholder"),
      errorMessage: figma.string("Error Message"),
      size: figma.enum("Size", {
        sm: "sm",
        md: "md",
        lg: "lg",
        fill: "",
      }),
    },
    example: ({ value, disabled, input, size }) =>
      html`<nys-textarea value="value" disabled=${disabled} size=${size}> ${label}</nys-textarea>`,
  },
);
