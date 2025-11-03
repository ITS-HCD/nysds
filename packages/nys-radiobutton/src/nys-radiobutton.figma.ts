import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_RADIOGROUP>", {
  props: {
    size: figma.enum("Size", {
      sm: "sm",
      md: "md", // Default
    }),
    label: figma.nestedProps("Label", {
      text: figma.string("Label"),
      optional: figma.boolean("Optional"),
      required: figma.boolean("Required"),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    tile: figma.boolean("Tile"),
    error: figma.nestedProps("_Error", {
      message: figma.string("Error Message"),
    }),
    input: figma.nestedProps("Input", {
      showError: figma.boolean("Error"),
      radio1text: figma.string("Radio 1 Label"),
      radio1description: figma.boolean("Radio 1 Description", {
        true: figma.string("↳ Radio 1 Description"),
        false: undefined,
      }),
      radio2text: figma.string("Radio 2 Label"),
      radio2description: figma.boolean("Radio 2 Description", {
        true: figma.string("↳ Radio 2 Description"),
        false: undefined,
      }),
      radio3text: figma.boolean("Radio Option 3", {
        true: figma.string("↳ Radio 3 Label"),
      }),
      radio3description: figma.boolean("↳ Radio 3 Description", {
        true: figma.string("- ↳ Radio 3 Description"),
        false: undefined,
      }),
      radio4text: figma.boolean("Radio Option 4", {
        true: figma.string("↳ Radio 4 Label"),
        false: undefined,
      }),
      radio4description: figma.boolean("↳ Radio 4 Description", {
        true: figma.string("- ↳ Radio 4 Description"),
        false: undefined,
      }),
      radio5text: figma.boolean("Radio Option 5", {
        true: figma.string("↳ Radio 5 Label"),
        false: undefined,
      }),
      radio5description: figma.boolean("↳ Radio 5 Description", {
        true: figma.string("- ↳ Radio 5 Description"),
        false: undefined,
      }),
      radio6text: figma.boolean("Radio Option 6", {
        true: figma.string("↳ Radio 6 Label"),
        false: undefined,
      }),
      radio6description: figma.boolean("↳ Radio 6 Description", {
        true: figma.string("- ↳ Radio 6 Description"),
        false: undefined,
      }),
      radio7text: figma.boolean("Radio Option 7", {
        true: figma.string("↳ Radio 7 Label"),
        false: undefined,
      }),
      radio7description: figma.boolean("↳ Radio 7 Description", {
        true: figma.string("- ↳ Radio 7 Description"),
        false: undefined,
      }),
    }),
  },
  example: (props) =>
    html` <!-- 
  - Use the same 'name' attribute make radio buttons mutually exclusive
  - Update 'value' attribute to change data submitted to forms 
-->
      <nys-radiogroup
        label="${props.label.text}"
        description="${props.label.description}"
        size="${props.size}"
        ?required="${props.label.required}"
        ?optional="${props.label.optional}"
        ?showError="${props.input.showError}"
        errorMessage="${props.error.message}"
        name="---REPLACE_THIS---"
        ?tile="${props.tile}"
      >
        <nys-radiobutton
          label="${props.input.radio1text}"
          description="${props.input.radio1description}"
          value="${props.input.radio1text}"
          name="---REPLACE_THIS---"
        ></nys-radiobutton>
        <nys-radiobutton
          label="${props.input.radio2text}"
          description="${props.input.radio2description}"
          value="${props.input.radio2text}"
          name="---REPLACE_THIS---"
        ></nys-radiobutton>
        <nys-radiobutton
          label="${props.input.radio3text}"
          description="${props.input.radio3description}"
          value="${props.input.radio3text}"
          name="---REPLACE_THIS---"
        ></nys-radiobutton>
        <nys-radiobutton
          label="${props.input.radio4text}"
          description="${props.input.radio4description}"
          value="${props.input.radio4text}"
          name="---REPLACE_THIS---"
        ></nys-radiobutton>
        <nys-radiobutton
          label="${props.input.radio5text}"
          description="${props.input.radio5description}"
          value="${props.input.radio5text}"
          name="---REPLACE_THIS---"
        ></nys-radiobutton>
        <nys-radiobutton
          label="${props.input.radio6text}"
          description="${props.input.radio6description}"
          value="${props.input.radio6text}"
          name="---REPLACE_THIS---"
        ></nys-radiobutton>
        <nys-radiobutton
          label="${props.input.radio7text}"
          description="${props.input.radio7description}"
          value="${props.input.radio7text}"
          name="---REPLACE_THIS---"
        ></nys-radiobutton>
      </nys-radiogroup>`,
});

// Radiobutton Medium
figma.connect("<FIGMA_RADIOBUTTON1>", {
  props: {
    label: figma.nestedProps("Label", {
      text: figma.string("Label"),
      optional: figma.boolean("Optional"),
      required: figma.boolean("Required"),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    error: figma.nestedProps("_Error", {
      message: figma.string("Error Message"),
    }),
    input: figma.nestedProps("Input", {
      showError: figma.boolean("Error"),
      radioText: figma.string("Radio Label"),
      radioDescription: figma.boolean("Radio Description", {
        true: figma.string("↳ Radio Description"),
        false: undefined,
      }),
    }),
    checked: figma.boolean("Checked"),
    disabled: figma.boolean("Disabled"),
  },
  example: (props) => html`
    <nys-radiobutton
      label="${props.input.radioText}"
      description="${props.input.radioDescription}"
      value="${props.input.radioText}"
      name="---REPLACE_NAME---"
      ?checked="${props.checked}"
      ?disabled="${props.disabled}"
    ></nys-radiobutton>
  `,
});

// Radiobutton Small
figma.connect("<FIGMA_RADIOBUTTON2>", {
  props: {
    label: figma.nestedProps("Label", {
      text: figma.string("Label"),
      optional: figma.boolean("Optional"),
      required: figma.boolean("Required"),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    error: figma.nestedProps("_Error", {
      message: figma.string("Error Message"),
    }),
    input: figma.nestedProps("Input", {
      showError: figma.boolean("Error"),
      radioText: figma.string("Radio Label"),
      radioDescription: figma.boolean("Radio Description", {
        true: figma.string("↳ Radio Description"),
        false: undefined,
      }),
    }),
    checked: figma.boolean("Checked"),
    disabled: figma.boolean("Disabled"),
  },
  example: (props) => html`
    <nys-radiobutton
      label="${props.input.radioText}"
      description="${props.input.radioDescription}"
      value="${props.input.radioText}"
      name="---REPLACE_NAME---"
      ?checked="${props.checked}"
      ?disabled="${props.disabled}"
    ></nys-radiobutton>
  `,
});

// Radiobutton Medium Tile
figma.connect("<FIGMA_RADIOBUTTON3>", {
  props: {
    label: figma.nestedProps("Label", {
      text: figma.string("Label"),
      optional: figma.boolean("Optional"),
      required: figma.boolean("Required"),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    error: figma.nestedProps("_Error", {
      message: figma.string("Error Message"),
    }),
    input: figma.nestedProps("Input", {
      showError: figma.boolean("Error"),
      radioText: figma.string("Radio Label"),
      radioDescription: figma.boolean("Radio Description", {
        true: figma.string("↳ Radio Description"),
        false: undefined,
      }),
    }),
    checked: figma.boolean("Checked"),
    disabled: figma.boolean("Disabled"),
  },
  example: (props) => html`
    <nys-radiobutton
      label="${props.input.radioText}"
      description="${props.input.radioDescription}"
      value="${props.input.radioText}"
      name="---REPLACE_NAME---"
      ?checked="${props.checked}"
      ?disabled="${props.disabled}"
    ></nys-radiobutton>
  `,
});

// Radiobutton Small Tile
figma.connect("<FIGMA_RADIOBUTTON4>", {
  props: {
    label: figma.nestedProps("Label", {
      text: figma.string("Label"),
      optional: figma.boolean("Optional"),
      required: figma.boolean("Required"),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    error: figma.nestedProps("_Error", {
      message: figma.string("Error Message"),
    }),
    input: figma.nestedProps("Input", {
      showError: figma.boolean("Error"),
      radioText: figma.string("Radio Label"),
      radioDescription: figma.boolean("Radio Description", {
        true: figma.string("↳ Radio Description"),
        false: undefined,
      }),
    }),
    checked: figma.boolean("Checked"),
    disabled: figma.boolean("Disabled"),
  },
  example: (props) => html`
    <nys-radiobutton
      label="${props.input.radioText}"
      description="${props.input.radioDescription}"
      value="${props.input.radioText}"
      name="---REPLACE_NAME---"
      ?checked="${props.checked}"
      ?disabled="${props.disabled}"
    ></nys-radiobutton>
  `,
});
