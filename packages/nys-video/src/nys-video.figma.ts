import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_VIDEO>", {
  props: {
    videourl: figma.string("videourl"),
    titleText: figma.string("titleText"),
    size: figma.enum("size", {
      full: "full",
      contained: "contained",
      compacted: "compacted",
    }),
    arialabel: figma.string("arialabel"),
    starttime: figma.string("starttime"),
    thumbnail: figma.string("thumbnail"),
    autoplay: figma.boolean("autoplay"),
    disabled: figma.boolean("disabled"),
    loading: figma.enum("loading", {
      lazy: "lazy",
      eager: "eager",
    }),
  },
  example: (props) => html`
    <nys-video
      videourl="${props.videourl}"
      size="${props.size}"
      arialabel="${props.arialabel}"
      titleText="${props.titleText}"
      thumbnail="${props.thumbnail}"
      starttime="${props.starttime}"
      loading="${props.loading}"
      ?autoplay="${props.autoplay}"
      ?disabled="${props.disabled}"
    ></nys-video>
  `,
});
