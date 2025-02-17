import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_GLOBALFOOTER>", {
  props: {
    agencyName: figma.string("Agency Name"),
  },
  example: (props) => html`
    <nys-globalfooter
      agencyName="${props.agencyName}"
      homepageLink="https://"
    >
      <!-- Placeholder, replace with real links -->
      <ul>
        <li><a href="https://">Placeholder</a></li>
        <li><a href="https://">Placeholder</a></li>
      </ul>
    </nys-globalfooter>
  `,
});
