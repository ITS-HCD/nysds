import figma, { html } from "@figma/code-connect/html";

// Omit any prop that is default (as it doesn't need to be passed to code)
figma.connect("<FIGMA_SELECT>", {
  props: {
    width: figma.enum("Width", {
      sm: "sm",
      md: "md",
      lg: "lg",
      full: "full",
    }),
    label: figma.nestedProps("Label", {
      text: figma.string("Label"),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
      required: figma.boolean("Required"),
      optional: figma.boolean("Optional"),
    }),
    input: figma.nestedProps("Input", {
      disabled: figma.boolean("Disabled"),
      value: figma.boolean("Value", {
        true: figma.string("↳ Value"),
        false: undefined,
      }),
      /**
       * Due to code connect limitation with nested instance within a nested instance,
       * We can work around this with targeting the first level within "input" prop as usual, but putting the inner nested "error" prop outside of this key/value pair
       */
      showError: figma.boolean("Error"),
    }),
    error: figma.nestedProps("Error", {
      message: figma.string("Error Message"),
    }),
  },
  example: (props) =>
    html`<!-- 
  - Replace "name" value with the name of your form field 
  - Add <nys-option> elements as needed
-->
      <nys-select
        width="${props.width}"
        label="${props.label.text}"
        description="${props.label.description}"
        ?required="${props.label.required}"
        ?optional="${props.label.optional}"
        ?disabled="${props.input.disabled}"
        ?showError="${props.input.showError}"
        errorMessage="${props.error.message}"
        name="(REPLACE)"
      >
        <option value="---REPLACE_VALUE---">${props.input.value}</option>
        <option value="---REPLACE_VALUE---">Option 2 {REPLACE}</option>
        <option value="---REPLACE_VALUE---">Option 3 {REPLACE}</option>
      </nys-select>`,
});
