import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_ONTHISPAGE>", {
  example: () => html`
    <nys-onthispage></nys-onthispage>

    <main>
      <h1>Page title</h1>

      <h2>Heading text</h2>
      <p>Section content.</p>

      <h2>Heading text</h2>
      <p>Section content.</p>

      <h2>Heading text</h2>
      <p>Section content.</p>
    </main>
  `,
});
