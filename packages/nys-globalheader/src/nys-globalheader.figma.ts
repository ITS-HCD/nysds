import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_GLOBALHEADER>", {
  props: {
    globalheader: figma.nestedProps("Global Header", {
      appName: figma.string("Application Name"),
      agencyName: figma.string("Agency Name"),
    }),
    menuitems: figma.nestedProps("Menu Items", {
      item1: figma.boolean("Item 1", {
        true: figma.string("↳ Item 1"),
        false: undefined,
      }),
      item2: figma.boolean("Item 2", {
        true: figma.string("↳ Item 2"),
        false: undefined,
      }),
      item3: figma.boolean("Item 3", {
        true: figma.string("↳ Item 3"),
        false: undefined,
      }),
      item4: figma.boolean("Item 4", {
        true: figma.string("↳ Item 4"),
        false: undefined,
      }),
      item5: figma.boolean("Item 5", {
        true: figma.string("↳ Item 5"),
        false: undefined,
      }),
      item6: figma.boolean("Item 6", {
        true: figma.string("↳ Item 6"),
        false: undefined,
      }),
      item7: figma.boolean("Item 7", {
        true: figma.string("↳ Item 7"),
        false: undefined,
      }),
      item8: figma.boolean("Item 8", {
        true: figma.string("↳ Item 8"),
        false: undefined,
      }),
      item9: figma.boolean("Item 9", {
        true: figma.string("↳ Item 9"),
        false: undefined,
      }),
      item10: figma.boolean("Item 10", {
        true: figma.string("↳ Item 10"),
        false: undefined,
      }),
    }),
  },
  example: (props) => html`
    <nys-globalheader
      appName="${props.globalheader.appName}"
      agencyName="${props.globalheader.agencyName}"
    >
      <ul>
        <li><a href="https://">${props.menuitems.item1}</a></li>
        <li><a href="https://">${props.menuitems.item2}</a></li>
        <li><a href="https://">${props.menuitems.item3}</a></li>
        <li><a href="https://">${props.menuitems.item4}</a></li>
        <li><a href="https://">${props.menuitems.item5}</a></li>
        <li><a href="https://">${props.menuitems.item6}</a></li>
        <li><a href="https://">${props.menuitems.item7}</a></li>
        <li><a href="https://">${props.menuitems.item8}</a></li>
        <li><a href="https://">${props.menuitems.item9}</a></li>
        <li><a href="https://">${props.menuitems.item10}</a></li>
      </ul>
    </nys-globalheader>
  `,
});

// // Variant: Application Name Only
// figma.connect("<FIGMA_GLOBALHEADER>", {
//   variant: { Content: "Application" },
//   props: {
//     appName: figma.string("Application Name"),
//   },
//   example: (props) => html`
//     <nys-globalheader appName="${props.appName}" homepageLink="https://">
//       <!-- Placeholder, replace with real links -->
//       <ul>
//         <li><a href="https://">Placeholder</a></li>
//         <li><a href="https://">Placeholder</a></li>
//       </ul>
//     </nys-globalheader>
//   `,
// });

// // Variant: Application Name Only
// figma.connect("<FIGMA_GLOBALHEADER>", {
//   variant: { Content: "Application" },
//   props: {
//     appName: figma.string("Application Name"),
//   },
//   example: (props) => html`
//     <nys-globalheader appName="${props.appName}" homepageLink="https://">
//       <!-- Placeholder, replace with real links -->
//       <ul>
//         <li><a href="https://">Placeholder</a></li>
//         <li><a href="https://">Placeholder</a></li>
//       </ul>
//     </nys-globalheader>
//   `,
// });

// // Variant: Agency Name Only
// figma.connect("<FIGMA_GLOBALHEADER>", {
//   variant: { Content: "Agency" },
//   props: {
//     agencyName: figma.string("Agency Name"),
//   },
//   example: (props) => html`
//     <nys-globalheader agencyName="${props.agencyName}" homepageLink="https://">
//       <!-- Placeholder, replace with real links -->
//       <ul>
//         <li><a href="https://">Placeholder</a></li>
//         <li><a href="https://">Placeholder</a></li>
//       </ul>
//     </nys-globalheader>
//   `,
// });

// // Variant: Application + Agency Name
// figma.connect("<FIGMA_GLOBALHEADER>", {
//   variant: { Content: "Application + Agency" },
//   props: {
//     appName: figma.string("Application Name"),
//     agencyName: figma.string("Agency Name"),
//   },
//   example: (props) => html`
//     <nys-globalheader
//       appName="${props.appName}"
//       agencyName="${props.agencyName}"
//       homepageLink="https://"
//     >
//       <!-- Placeholder, replace with real links -->
//       <ul>
//         <li><a href="https://">Placeholder</a></li>
//         <li><a href="https://">Placeholder</a></li>
//       </ul>
//     </nys-globalheader>
//   `,
// });
