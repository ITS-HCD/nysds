import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_PROCESSLIST>", {
  props: {
    // TODO: Add props here
  },
  example: () =>
    html` <nys-processlist id="application-steps">
      <nys-processlistitem label="Gather your documents"></nys-processlistitem>
      <nys-processlistitem
        label="Complete the application"
      ></nys-processlistitem>
      <nys-processlistitem
        label="Submit and await review"
      ></nys-processlistitem>
    </nys-processlist>`,
});
