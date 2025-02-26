import figma, { html } from "@figma/code-connect/html";

// Omit any prop that is default (as it doesn't need to be passed to code)
figma.connect("<FIGMA_SELECT>", {
  props: {
    width: figma.enum("Width", {
      sm: "sm",
      md: "md",
      lg: "lg",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    showError: figma.enum("State", {
      Error: true,
    }),
    error: figma.nestedProps("_Error", {
      message: figma.string("Error Message"),
    }),
    value: figma.string("Input"),
  },
  example: (props) =>
    html` <!-- Replace "name" value with the name of your form field -->
      <nys-select
        width="${props.width}"
        name="(REPLACE)"
        showError="${props.showError}"
        errorMessage="${props.error.message}"
        disabled="${props.disabled}"
      >
        <nys-option value="${props.value}">${props.value}</nys-option>
        <nys-option value="VALUE">OPTION (REPLACE)</nys-option>
        <nys-option value="VALUE">OPTION (REPLACE)</nys-option>
      </nys-select>`,
});
