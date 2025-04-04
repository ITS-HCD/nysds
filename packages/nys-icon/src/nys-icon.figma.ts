import figma, { html } from "@figma/code-connect/html";

figma.connect("<FIGMA_ICON>", {
  props: {
    size: figma.enum("size", {
      "12": "12",
      "24": "24",
      "32": "32",
      "48": "48",
      "64": "64",
      "2xs": "2xs",
      xs: "xs",
      sm: "sm",
      md: "md",
      lg: "lg",
      xl: "xl",
      "2xl": "2xl",
      "3xl": "3xl",
      "4xl": "4xl",
      "5xl": "5xl",
    }),
    // name: figma.instance("shape"),
    name: figma.instance("shape"),
  },
  example: (props) => html`
    <!-- Replace icon name with name="icon_name" attribute -->
    <nys-icon ${props.name} size="${props.size}"> </nys-icon>
  `,
});

figma.connect("<FIGMA_ICONS_CLOSE>", { example: () => html`close` });
figma.connect("<FIGMA_ICONS_DOWNLOAD>", { example: () => html`download` });
figma.connect("<FIGMA_ICONS_CALENDAR_MONTH>", {
  example: () => html`calendar_month`,
});
figma.connect("<FIGMA_ICONS_CHECK>", { example: () => html`check` });
figma.connect("<FIGMA_ICONS_CHEVRON_RIGHT>", {
  example: () => html`chevron_right`,
});
figma.connect("<FIGMA_ICONS_ARROW_BACK>", { example: () => html`arrow_back` });
figma.connect("<FIGMA_ICONS_CHEVRON_LEFT>", {
  example: () => html`chevron_left`,
});
figma.connect("<FIGMA_ICONS_CHEVRON_DOWN>", {
  example: () => html`chevron_down`,
});
figma.connect("<FIGMA_ICONS_CHEVRON_UP>", { example: () => html`chevron_up` });
figma.connect("<FIGMA_ICONS_DOWNLOAD_DONE>", {
  example: () => html`download_done`,
});
figma.connect("<FIGMA_ICONS_UPLOAD_FILE>", {
  example: () => html`upload_file`,
});
figma.connect("<FIGMA_ICONS_DRIVE_FOLDER_UPLOAD>", {
  example: () => html`drive_folder_upload`,
});
figma.connect("<FIGMA_ICONS_MORE_VERT>", { example: () => html`more_vert` });
figma.connect("<FIGMA_ICONS_CANCEL>", { example: () => html`cancel` });
figma.connect("<FIGMA_ICONS_LANGUAGE>", { example: () => html`language` });
figma.connect("<FIGMA_ICONS_SEARCH>", { example: () => html`search` });
figma.connect("<FIGMA_ICONS_ MENU>", { example: () => html` menu` });
figma.connect("<FIGMA_ICONS_ACCOUNT_CIRCLE>", {
  example: () => html`account_circle`,
});
figma.connect("<FIGMA_ICONS_FACEBOOK>", { example: () => html`facebook` });
figma.connect("<FIGMA_ICONS_X>", { example: () => html`x` });
figma.connect("<FIGMA_ICONS_INSTAGRAM>", { example: () => html`instagram` });
figma.connect("<FIGMA_ICONS_LINKEDIN>", { example: () => html`linkedin` });
figma.connect("<FIGMA_ICONS_GOOGLE_PLAY>", {
  example: () => html`google_play`,
});
figma.connect("<FIGMA_ICONS_VIMEO>", { example: () => html`vimeo` });
figma.connect("<FIGMA_ICONS_SNAPCHAT>", { example: () => html`snapchat` });
figma.connect("<FIGMA_ICONS_TUMBLR>", { example: () => html`tumblr` });
figma.connect("<FIGMA_ICONS_TIKTOK>", { example: () => html`tiktok` });
figma.connect("<FIGMA_ICONS_SOUNDCLOUD>", { example: () => html`soundcloud` });
figma.connect("<FIGMA_ICONS_FLICKR>", { example: () => html`flickr` });
figma.connect("<FIGMA_ICONS_PINTEREST>", { example: () => html`pinterest` });
figma.connect("<FIGMA_ICONS_YOUTUBE>", { example: () => html`youtube` });
figma.connect("<FIGMA_ICONS_SHARE>", { example: () => html`share` });
figma.connect("<FIGMA_ICONS_EDIT_SQUARE>", {
  example: () => html`edit_square`,
});
figma.connect("<FIGMA_ICONS_RSS>", { example: () => html`rss` });
figma.connect("<FIGMA_ICONS_VISIBILITY>", { example: () => html`visibility` });
figma.connect("<FIGMA_ICONS_VISIBILITY_OFF>", {
  example: () => html`visibility_off`,
});
figma.connect("<FIGMA_ICONS_THUMB_UP>", { example: () => html`thumb_up` });
figma.connect("<FIGMA_ICONS_THUMB_DOWN>", { example: () => html`thumb_down` });
figma.connect("<FIGMA_ICONS_WARNING>", { example: () => html`warning` });
figma.connect("<FIGMA_ICONS_CHECK_CIRCLE>", {
  example: () => html`check_circle`,
});
figma.connect("<FIGMA_ICONS_INFO>", { example: () => html`info` });
figma.connect("<FIGMA_ICONS_ERROR>", { example: () => html`error` });
figma.connect("<FIGMA_ICONS_EMERGENCY_HOME>", {
  example: () => html`emergency_home`,
});
figma.connect("<FIGMA_ICONS_CLEAR_DAY>", { example: () => html`clear_day` });
figma.connect("<FIGMA_ICONS_AIR>", { example: () => html`air` });
figma.connect("<FIGMA_ICONS_RAINY>", { example: () => html`rainy` });
figma.connect("<FIGMA_ICONS_CORONAVIRUS>", {
  example: () => html`coronavirus`,
});
figma.connect("<FIGMA_ICONS_AC_UNIT>", { example: () => html`ac_unit` });
figma.connect("<FIGMA_ICONS_HELP>", { example: () => html`help` });
figma.connect("<FIGMA_ICONS_PUBLISH>", { example: () => html`publish` });
figma.connect("<FIGMA_ICONS_ARROW_FORWARD>", {
  example: () => html`arrow_forward`,
});
figma.connect("<FIGMA_ICONS_ARROW_DOWNWARD>", {
  example: () => html`arrow_downward`,
});
figma.connect("<FIGMA_ICONS_ARROW_UPWARD>", {
  example: () => html`arrow_upward`,
});
figma.connect("<FIGMA_ICONS_OPEN_IN_NEW>", {
  example: () => html`open_in_new`,
});
figma.connect("<FIGMA_ICONS_SMS>", { example: () => html`sms` });
figma.connect("<FIGMA_ICONS_NOTIFICATIONS>", {
  example: () => html`notifications`,
});
