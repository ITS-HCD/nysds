import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-video";

interface NysVideoArgs {
  id: string;
  titleText: string;
  videourl: string;
  size: "full" | "contained" | "compacted";
  loading: "lazy" | "eager";
  ariaLabel: string;
  starttime: number;
  thumbnail: string;
  autoplay: boolean;
}

const meta: Meta<NysVideoArgs> = {
  title: "Components/Video",
  component: "nys-video",
  argTypes: {
    id: { control: "text" },
    titleText: { control: "text" },
    videourl: { control: "text" },
    size: {
      control: "select",
      options: ["full", "contained", "compacted"],
    },
    loading: {
      control: "select",
      options: ["lazy", "eager"],
    },
    ariaLabel: { control: "text" },
    starttime: { control: "number" },
    thumbnail: { control: "text" },
    autoplay: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysVideoArgs>;

export const Basic: Story = {
  args: {
    videourl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    size: "full",
    ariaLabel: "Rick Astley - Never Gonna Give You Up",
    titleText: "Rick Astley - Never Gonna Give You Up",
    autoplay: false,
  },
  render: (args) => html`
    <nys-video
      videourl=${args.videourl}
      size=${args.size}
      arialabel=${args.ariaLabel}
      .titleText=${args.titleText}
      ?autoplay=${args.autoplay}
    ></nys-video>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  size="full"
  arialabel="Rick Astley - Never Gonna Give You Up"
  titleText="Rick Astley - Never Gonna Give You Up"
></nys-video>`,
        type: "auto",
      },
    },
  },
};

export const WithThumbnail: Story = {
  args: {
    videourl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    size: "full",
    ariaLabel: "Rick Astley - Never Gonna Give You Up",
    titleText: "Rick Astley - Never Gonna Give You Up",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    autoplay: false,
  },
  render: (args) => html`
    <nys-video
      videourl=${args.videourl}
      size=${args.size}
      arialabel=${args.ariaLabel}
      .titleText=${args.titleText}
      thumbnail=${args.thumbnail}
      ?autoplay=${args.autoplay}
    ></nys-video>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  size="full"
  arialabel="Rick Astley - Never Gonna Give You Up"
  titleText="Rick Astley - Never Gonna Give You Up"
  thumbnail="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
></nys-video>`,
        type: "auto",
      },
    },
  },
};

export const WithStartTime: Story = {
  args: {
    videourl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    size: "full",
    ariaLabel: "Rick Astley - Never Gonna Give You Up",
    titleText: "Rick Astley - Never Gonna Give You Up",
    starttime: 30,
    autoplay: false,
  },
  render: (args) => html`
    <nys-video
      videourl=${args.videourl}
      size=${args.size}
      arialabel=${args.ariaLabel}
      .titleText=${args.titleText}
      starttime=${args.starttime}
      ?autoplay=${args.autoplay}
    ></nys-video>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  size="full"
  arialabel="Rick Astley - Never Gonna Give You Up"
  titleText="Rick Astley - Never Gonna Give You Up"
  starttime="30"
></nys-video>`,
        type: "auto",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <nys-video
        videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        size="full"
        arialabel="Full size example"
        titleText="Full Size"
      ></nys-video>
      <nys-video
        videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        size="contained"
        arialabel="Contained size example"
        titleText="Contained Size"
      ></nys-video>
      <nys-video
        videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        size="compacted"
        arialabel="Compact size example"
        titleText="Compact Size"
      ></nys-video>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-video videourl="..." size="full" arialabel="Full size example" titleText="Full Size"></nys-video>
<nys-video videourl="..." size="contained" arialabel="Contained size example" titleText="Contained Size"></nys-video>
<nys-video videourl="..." size="compacted" arialabel="Compact size example" titleText="Compact Size"></nys-video>`,
        type: "auto",
      },
    },
  },
};