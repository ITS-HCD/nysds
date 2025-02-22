import figma, { html } from "@figma/code-connect/html";

// Error (not working?)
figma.connect("<FIGMA_CHECKBOX>", {
  variant: { Error: true },
  props: {
    label: figma.string("↳ Label"),
    description: figma.string("↳ Description"),
    size: figma.enum("Size", {
      sm: "sm",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    checked: figma.boolean("Checked"),
    required: figma.boolean("Required"),
    error: figma.nestedProps("_Error", {
      message: figma.string("Error Message"),
    }),
  },
  example: (props) =>
    html` <!-- 
  - Include in <nys-checkboxgroup> to group checkbox buttons
  - Use the same 'name' attribute to group data in form submissions
  - Replace 'value' attribute to modify the data submitted to forms 
-->
      <nys-checkbox
        label="${props.label}"
        description="${props.description}"
        size="${props.size}"
        value="${props.label}"
        name="GROUP_NAME_(OPTIONAL)"
        checked="${props.checked}"
        disabled="${props.disabled}"
        required="${props.required}"
        errorMessage="${props.error.message}"
        showError
      ></nys-checkbox>`,
});

// Checkbox Only (no label)
figma.connect("<FIGMA_CHECKBOX>", {
  variant: { Label: false, Error: false },
  props: {
    size: figma.enum("Size", {
      sm: "sm",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    checked: figma.boolean("Checked"),
    required: figma.boolean("Required"),
  },
  example: (props) =>
    html` <!-- 
  - Include in <nys-checkboxgroup> to group checkbox buttons
  - Use the same 'name' attribute to group data in form submissions
  - Replace 'value' attribute to modify the data submitted to forms 
-->
      <nys-checkbox
        size="${props.size}"
        value="VALUE_(REPLACE)"
        name="GROUP_NAME_(REPLACE)"
        checked="${props.checked}"
        disabled="${props.disabled}"
        required="${props.required}"
      ></nys-checkbox>`,
});

// Label Only
figma.connect("<FIGMA_CHECKBOX>", {
  variant: { "Multiline / Description": false, Label: true, Error: false },
  props: {
    label: figma.string("↳ Label"),
    size: figma.enum("Size", {
      sm: "sm",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    checked: figma.boolean("Checked"),
    required: figma.boolean("Required"),
  },
  example: (props) =>
    html` <!-- 
  - Include in <nys-checkboxgroup> to group checkbox buttons
  - Use the same 'name' attribute to group data in form submissions
  - Replace 'value' attribute to modify the data submitted to forms 
-->
      <nys-checkbox
        label="${props.label}"
        size="${props.size}"
        value="${props.label}"
        name="GROUP_NAME_(REPLACE)"
        checked="${props.checked}"
        disabled="${props.disabled}"
        required="${props.required}"
      ></nys-checkbox>`,
});

// Description Hidden
figma.connect("<FIGMA_CHECKBOX>", {
  variant: {
    "Multiline / Description": true,
    Description: false,
    Error: false,
  },
  props: {
    label: figma.string("↳ Label"),
    size: figma.enum("Size", {
      sm: "sm",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    checked: figma.boolean("Checked"),
    required: figma.boolean("Required"),
  },
  example: (props) =>
    html` <!-- 
  - Include in <nys-checkboxgroup> to group checkbox buttons
  - Use the same 'name' attribute to group data in form submissions
  - Replace 'value' attribute to modify the data submitted to forms 
-->
      <nys-checkbox
        label="${props.label}"
        size="${props.size}"
        value="${props.label}"
        name="GROUP_NAME_(REPLACE)"
        checked="${props.checked}"
        disabled="${props.disabled}"
        required="${props.required}"
      ></nys-checkbox>`,
});

// Multi-line with Label + Multiline: True
figma.connect("<FIGMA_CHECKBOX>", {
  variant: { "Multiline / Description": true, Label: true, Error: false },
  props: {
    label: figma.string("↳ Label"),
    description: figma.string("↳ Description"),
    size: figma.enum("Size", {
      sm: "sm",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    checked: figma.boolean("Checked"),
    required: figma.boolean("Required"),
  },
  example: (props) =>
    html` <!-- 
  - Include in <nys-checkboxgroup> to group checkbox buttons
  - Use the same 'name' attribute to group data in form submissions
  - Replace 'value' attribute to modify the data submitted to forms 
-->
      <nys-checkbox
        label="${props.label}"
        description="${props.description}"
        size="${props.size}"
        value="${props.label}"
        name="GROUP_NAME_(OPTIONAL)"
        checked="${props.checked}"
        disabled="${props.disabled}"
        required="${props.required}"
      ></nys-checkbox>`,
});
