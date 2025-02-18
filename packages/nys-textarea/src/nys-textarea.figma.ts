import figma, { html } from "@figma/code-connect/html";

// Omit any value that is default (doesn't need to be passed to code)
figma.connect("<FIGMA_TEXTAREA>", {
  props: {
    width: figma.enum("Width", {
      sm: "sm",
      md: "md",
      lg: "lg",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    resizable: figma.enum("Resizable", {
      true: undefined,
      false: "none",
    }),
    value: figma.boolean("Input", {
      true: figma.string("↳ Input"),
      false: undefined,
    }),
    placeholder: figma.boolean("Placeholder", {
      true: figma.string("↳ Placeholder"),
      false: undefined,
    }),
    rows: figma.enum("Rows", {
      "2": 2,
      "6": 6,
    }),
  },
  example: (props) =>
    html` <nys-textarea
      width="${props.width}"
      value="${props.value}"
      placeholder="${props.placeholder}"
      rows="${props.rows}"
      name="GROUP_NAME_(REPLACE)"
      disabled="${props.disabled}"
      resizable="${props.resizable}"
    ></nys-textarea>`,
});


figma.connect("<FIGMA_TEXTAREA>", {
  variant: { State: "Error" },
  props: {
    width: figma.enum("Width", {
      sm: "sm",
      md: "md",
      lg: "lg",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    resizable: figma.enum("Resizable", {
      true: undefined,
      false: "none",
    }),
    value: figma.boolean("Input", {
      true: figma.string("↳ Input"),
      false: undefined,
    }),
    placeholder: figma.boolean("Placeholder", {
      true: figma.string("↳ Placeholder"),
      false: undefined,
    }),
    rows: figma.enum("Rows", {
      "2": 2,
      "6": 6,
    }),
    error: figma.nestedProps("_Error", {
      message: figma.string("Error Message"),
    }),
  },
  example: (props) =>
    html` <nys-textarea
      width="${props.width}"
      value="${props.value}"
      placeholder="${props.placeholder}"
      rows="${props.rows}"
      name="GROUP_NAME_(REPLACE)"
      disabled="${props.disabled}"
      resizable="${props.resizable}"
      showError
      errorMessage="${props.error.message}"
    ></nys-textarea>`,
});