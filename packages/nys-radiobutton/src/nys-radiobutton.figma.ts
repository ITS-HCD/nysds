import figma, { html } from "@figma/code-connect/html";

// Checkbox Only (no label)
figma.connect("<FIGMA_RADIOBUTTON>", {
  variant: { Label: false },
  props: {
    size: figma.enum("Size", {
      sm: "sm",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    checked: figma.boolean("Checked"),
  },
  example: (props) =>
    html` <!-- 
  - Include in <nys-radiogroup> to group radiobutton buttons
  - Use the same 'name' attribute make radio buttons mutually exclusive
  - Replace 'value' attribute to modify the data submitted to forms 
-->
      <nys-radiobutton
        size="${props.size}"
        value="VALUE_(REPLACE)"
        name="GROUP_NAME_(REPLACE)"
        checked="${props.checked}"
        disabled="${props.disabled}"
      ></nys-radiobutton>`,
});

// Label Only
figma.connect("<FIGMA_RADIOBUTTON>", {
  variant: { "Multiline | Description": false, Label: true },
  props: {
    label: figma.string("↳ Label"),
    size: figma.enum("Size", {
      sm: "sm",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    checked: figma.boolean("Checked"),
  },
  example: (props) =>
    html` <!-- 
  - Include in <nys-radiogroup> to group radiobutton buttons
  - Use the same 'name' attribute make radio buttons mutually exclusive
  - Replace 'value' attribute to modify the data submitted to forms 
-->
      <nys-radiobutton
        label="${props.label}"
        size="${props.size}"
        value="${props.label}"
        name="GROUP_NAME_(REPLACE)"
        checked="${props.checked}"
        disabled="${props.disabled}"
      ></nys-radiobutton>`,
});

// Description Hidden
figma.connect("<FIGMA_RADIOBUTTON>", {
  variant: { "Multiline | Description": true, Description: false },
  props: {
    label: figma.string("↳ Label"),
    size: figma.enum("Size", {
      sm: "sm",
    }),
    disabled: figma.enum("State", {
      Disabled: true,
    }),
    checked: figma.boolean("Checked"),
  },
  example: (props) =>
    html` <!-- 
  - Include in <nys-radiogroup> to group radiobutton buttons
  - Use the same 'name' attribute make radio buttons mutually exclusive
  - Replace 'value' attribute to modify the data submitted to forms 
-->
      <nys-radiobutton
        label="${props.label}"
        size="${props.size}"
        value="${props.label}"
        name="GROUP_NAME_(REPLACE)"
        checked="${props.checked}"
        disabled="${props.disabled}"
      ></nys-radiobutton>`,
});

// Multi-line with Label + Multiline: True
figma.connect("<FIGMA_RADIOBUTTON>", {
  variant: { "Multiline | Description": true, Label: true },
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
  },
  example: (props) =>
    html` <!-- 
  - Include in <nys-radiogroup> to group radiobutton buttons
  - Use the same 'name' attribute make radio buttons mutually exclusive
  - Replace 'value' attribute to modify the data submitted to forms 
-->
      <nys-radiobutton
        label="${props.label}"
        description="${props.description}"
        size="${props.size}"
        value="${props.label}"
        name="GROUP_NAME_(OPTIONAL)"
        checked="${props.checked}"
        disabled="${props.disabled}"
      ></nys-radiobutton>`,
});
