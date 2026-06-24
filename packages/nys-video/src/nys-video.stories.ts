import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-video";

// Define the structure of the args used in the stories
interface NysVideoArgs {
  id: string;
  titleText: string;
  videourl: string;
  size: "full" | "md" | "sm" | "";
  loading: "lazy" | "eager";
  starttime: number;
  thumbnail: string | null;
  autoplay: boolean;
  disabled: boolean;
}

const meta: Meta<NysVideoArgs> = {
  title: "Components/Video",
  component: "nys-video",
  argTypes: {
    id: { control: "text" },
    titleText: { control: "text" },
    videourl: { control: "text" },
    size: { control: "select", options: ["full", "md", "sm"] },
    loading: { control: "select", options: ["lazy", "eager"] },
    starttime: { control: "number" },
    thumbnail: { control: "text" },
    autoplay: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
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
    videourl: "https://www.youtube.com/watch?v=TBfFzt0150Q",
    titleText: "IT",
  },
  render: (args) => {
    return html`
      <nys-video
        .id=${args.id}
        ?autoplay=${args["autoplay"]}
        ?disabled=${args["disabled"]}
        .titleText=${args["titleText"]}
        .videourl=${args["videourl"]}
        .size=${args["size"]}
        .loading=${args["loading"]}
        .starttime=${args["starttime"]}
        .thumbnail=${args["thumbnail"]}
      ></nys-video>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
  titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
></nys-video>`,
        type: "auto",
      },
    },
  },
};

export const Thumbnail: Story = {
  render: () => {
    return html`
      <nys-video
        videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
        titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
        thumbnail="https://designsystem.ny.gov/assets/img/homepage-grid-3.svg"
      ></nys-video>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
  titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
  thumbnail="https://designsystem.ny.gov/assets/img/homepage-grid-3.svg"
></nys-video>`,
        type: "auto",
      },
    },
  },
};

export const Autoplay: Story = {
  render: () => {
    return html`
      <nys-video
        videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
        titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
        autoplay
      ></nys-video>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
  titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
  autoplay
></nys-video>`,
        type: "auto",
      },
    },
  },
};

export const StartTime: Story = {
  render: () => {
    return html`
      <nys-video
        videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
        titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
        starttime="43"
      ></nys-video>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
  titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
  starttime="43"
></nys-video>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-video
        videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
        titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
        disabled
      ></nys-video>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
  titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
  disabled
></nys-video>`,
        type: "auto",
      },
    },
  },
};

export const SizeFull: Story = {
  render: () => {
    return html`
      <nys-video
        size="full"
        videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
        titleText="Small (width: 320-439px)"
      ></nys-video>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  size="full"
  videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
  titleText="Small (width: 320-439px)"
></nys-video>`,
        type: "auto",
      },
    },
  },
};

export const SizeSmall: Story = {
  render: () => {
    return html`
      <nys-video
        size="sm"
        videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
        titleText="Small (width: 320-439px)"
      ></nys-video>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  size="sm"
  videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
  titleText="Small (width: 320-439px)"
></nys-video>`,
        type: "auto",
      },
    },
  },
};
