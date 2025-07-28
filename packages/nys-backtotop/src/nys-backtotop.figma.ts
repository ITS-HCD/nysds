import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_BACKTOTOP>", {
  example: () => html`
    <!--
  - Use left attribute to position the component on the bottom left of the screen instead. This is useful when the right side of the screen is occupied by other elements, such as a chat bot.
-->
    <nys-backtotop></nys-backtotop>
  `,
});
