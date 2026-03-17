import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_DROPDOWNMENU>", {
  props: {
    // for: figma.string("Trigger"),
    // showDropdown: figma.boolean("Show Dropdown"),
    disabled: figma.boolean("Disabled"),
    position: figma.enum("Overlay Position", {
      "bottom-start": "bottom-start",
      "bottom-end": "bottom-end",
    }),
  },
  example: (props) =>
    html` <nys-dropdownmenu for="trigger-id" position="${props.position}">
      <nys-dropdownmenuitem
        label="Profile"
        link="/example-profile"
        disabled=${props.disabled}
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Repositories & Github Pages"
        link="/example-repos"
        disabled=${props.disabled}
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Organizations"
        link="/example-orgs"
        disabled=${props.disabled}
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Sign out"
        link="/example-signout"
        disabled=${props.disabled}
      ></nys-dropdownmenuitem>
    </nys-dropdownmenu>`,
});

figma.connect("<FIGMA_DROPDOWNMENUITEM>", {
  props: {
    disabled: figma.boolean("Disabled"),
    label: figma.string("Label"),
  },
  example: (props) => html`
    <nys-dropdownmenuitem
      label=${props.label}
      link="/example-profile"
      disabled=${props.disabled}
    ></nys-dropdownmenuitem>
  `,
});
