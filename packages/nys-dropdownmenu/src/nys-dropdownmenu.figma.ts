import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_DROPDOWNMENU>", {
  props: {
    for: figma.string("Trigger ID"),
    showDropdown: figma.boolean("Show Dropdown"),
    position: figma.enum("Position", {
      "bottom-start": "bottom-start",
      "bottom-end": "bottom-end",
      "top-start": "top-start",
      "top-end": "top-end",
    }),
  },
  example: (props) =>
    html` <nys-dropdownmenu
      for="${props.for}"
      position="${props.position}"
      ?showDropdown=${props.showDropdown}
    >
      <nys-dropdownmenuitem
        label="Profile"
        link="/example-profile"
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Repositories & Github Pages"
        link="/example-repos"
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Organizations"
        link="/example-orgs"
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Sign out"
        link="/example-signout"
      ></nys-dropdownmenuitem>
    </nys-dropdownmenu>`,
});
