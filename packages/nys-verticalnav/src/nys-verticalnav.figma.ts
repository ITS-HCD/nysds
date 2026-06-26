import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_VERTICALNAV>", {
  example: () => html`
    <nys-verticalnav header="Page navigation" headerLevel="h2">
      <ul>
        <li><a href="/">Link text</a></li>
        <li><a href="/">Link text</a></li>
        <li>
          <h3>Section header</h3>
          <ul>
            <li><a href="">Sub-link text</a></li>
            <li><a href="">Sub-link text</a></li>
          </ul>
        </li>
        <li>
          <nys-verticalnavgroup label="Group label">
            <ul>
              <li><a href="">Sub-link text</a></li>
              <li><a href="">Sub-link text</a></li>
            </ul>
          </nys-verticalnavgroup>
        </li>
      </ul>
    </nys-verticalnav>
  `,
});
