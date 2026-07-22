import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_ICONLIST>", {
  props: {
    // TODO: Add props here
  },
  example: () =>
    html` <nys-iconlist id="event-details">
      <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
      <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
    </nys-iconlist>`,
});
