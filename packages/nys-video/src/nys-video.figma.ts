import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_VIDEO>", {
  props: {
    titleText: figma.nestedProps("Title", {
      text: figma.string("↳Text"),
    }),
    playButton: figma.nestedProps("Play Button", {
      Disabled: figma.boolean("Disabled"),
    }),
    size: figma.enum("Size", {
      Full: "full",
      Contained: "contained",
      Compacted: "compact",
    }),
  },
  example: (props) => html`
    <nys-video
      size="${props.size}"
      titleText="${props.titleText.text}"
      disabled="${props.playButton.Disabled}"
    ></nys-video>
  `,
});
