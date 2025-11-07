import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_CHECKBOX>", {
  props: {
    checked: figma.boolean("Checked"),
    disabled: figma.boolean("Disabled"),
    required: figma.boolean("Required"),
    size: figma.enum("Size", {
      sm: "sm",
      md: "md", // Default
    }),
    label: figma.boolean("Label", {
      true: figma.string("↳ Label"),
    }),
    description: figma.boolean("Description", {
      true: figma.string("↳ Description"),
    }),
    tile: figma.boolean("Tile"),
    showError: figma.boolean("Error"),
    error: figma.nestedProps("Error", {
      message: figma.string("Error Message"),
    }),
  },
  example: (props) => html`
    <!-- 
  1. Update 'name' attribute to group checkbox data
  2. Update 'value' attribute to change data sent via forms 
-->
    <nys-checkbox
      size="${props.size}"
      label="${props.label}"
      description="${props.description}"
      checked="${props.checked}"
      disabled="${props.disabled}"
      required="${props.required}"
      showError="${props.showError}"
      errorMessage="${props.error.message}"
      value="${props.label}"
      name="---REPLACE_THIS---"
      tile="${props.tile}"
    ></nys-checkbox>
  `,
});

figma.connect("<FIGMA_CHECKBOXGROUP>", {
  props: {
    size: figma.enum("Size", {
      sm: "sm",
      md: "md", // Default
    }),
    // showError: figma.boolean("Error"),
    label: figma.nestedProps("Label", {
      text: figma.string("Label"),
      optional: figma.boolean("Optional"),
      required: figma.boolean("Required"),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    // error: figma.nestedProps("Error", {
    //   message: figma.string("Error Message"),
    // }),
    error: figma.nestedProps("_Error", {
      message: figma.string("Error Message"),
    }),
    tile: figma.boolean("Tile"),
    input: figma.nestedProps("Input", {
      showError: figma.boolean("Error"),
      // error: figma.nestedProps("_Error", {
      //   message: figma.string("Error Message"),
      // }),
    }),
    checkbox_1: figma.nestedProps("Option 1", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
      }),
    }),
    checkbox_2: figma.nestedProps("Option 2", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
      }),
    }),
    checkbox_3: figma.nestedProps("Option 3", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    checkbox_4: figma.nestedProps("Option 4", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    checkbox_5: figma.nestedProps("Option 5", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    checkbox_6: figma.nestedProps("Option 6", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    checkbox_7: figma.nestedProps("Option 7", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    checkbox_8: figma.nestedProps("Option 8", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    checkbox_9: figma.nestedProps("Option 9", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
    checkbox_10: figma.nestedProps("Option 10", {
      text: figma.string("Label"),
      checked: figma.boolean("Checked"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      description: figma.boolean("Description", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),
    }),
  },
  example: (props) =>
    html` <!-- 
  1. Update 'name' attribute to group checkbox data
  2. Update 'value' attribute to change data sent via forms 
  3. Delete checkboxes that are not needed
-->
      <nys-checkboxgroup
        label="${props.label.text}"
        description="${props.label.description}"
        size="${props.size}"
        required="${props.label.required}"
        optional="${props.label.optional}"
        showError="${props.input.showError}"
        errorMessage="${props.error.message}"
        name="---REPLACE_THIS---"
        tile="${props.tile}"
      >
        <nys-checkbox
          label="${props.checkbox_1.text}"
          description="${props.checkbox_1.description}"
          checked="${props.checkbox_1.checked}"
          disabled="${props.checkbox_1.disabled}"
          value="${props.checkbox_1.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
        <nys-checkbox
          label="${props.checkbox_2.text}"
          description="${props.checkbox_2.description}"
          checked="${props.checkbox_2.checked}"
          disabled="${props.checkbox_2.disabled}"
          value="${props.checkbox_2.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
        <nys-checkbox
          label="${props.checkbox_3.text}"
          description="${props.checkbox_3.description}"
          checked="${props.checkbox_3.checked}"
          disabled="${props.checkbox_3.disabled}"
          value="${props.checkbox_3.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
        <nys-checkbox
          label="${props.checkbox_4.text}"
          description="${props.checkbox_4.description}"
          checked="${props.checkbox_4.checked}"
          disabled="${props.checkbox_4.disabled}"
          value="${props.checkbox_4.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
        <nys-checkbox
          label="${props.checkbox_5.text}"
          description="${props.checkbox_5.description}"
          checked="${props.checkbox_5.checked}"
          disabled="${props.checkbox_5.disabled}"
          value="${props.checkbox_5.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
        <nys-checkbox
          label="${props.checkbox_6.text}"
          description="${props.checkbox_6.description}"
          checked="${props.checkbox_6.checked}"
          disabled="${props.checkbox_6.disabled}"
          value="${props.checkbox_6.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
        <nys-checkbox
          label="${props.checkbox_7.text}"
          description="${props.checkbox_7.description}"
          checked="${props.checkbox_7.checked}"
          disabled="${props.checkbox_7.disabled}"
          value="${props.checkbox_7.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
        <nys-checkbox
          label="${props.checkbox_8.text}"
          description="${props.checkbox_8.description}"
          checked="${props.checkbox_8.checked}"
          disabled="${props.checkbox_8.disabled}"
          value="${props.checkbox_8.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
        <nys-checkbox
          label="${props.checkbox_9.text}"
          description="${props.checkbox_9.description}"
          checked="${props.checkbox_9.checked}"
          disabled="${props.checkbox_9.disabled}"
          value="${props.checkbox_9.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
        <nys-checkbox
          label="${props.checkbox_10.text}"
          description="${props.checkbox_10.description}"
          checked="${props.checkbox_10.checked}"
          disabled="${props.checkbox_10.disabled}"
          value="${props.checkbox_10.text}"
          name="---REPLACE_THIS---"
        ></nys-checkbox>
      </nys-checkboxgroup>`,
});
