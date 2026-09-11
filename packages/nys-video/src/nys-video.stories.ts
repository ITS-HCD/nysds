import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-video";

const meta: Meta = {
  title: "Components/Video",
  component: "nys-video",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'A YouTube video player with a thumbnail preview and play button.\nLoads the iframe only after the user clicks play, keeping initial page load light.\nSupports autoplay (muted), custom thumbnails, start time, lazy loading, and disabled state.\nAnnounces playback state and ad state to screen readers via a live region.\n\nFor use with YouTube URLs only. Component renders nothing if the URL is invalid.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysVideo videourl="https://www.youtube.com/watch?v=TBfFzt0150Q" titleText="IT\'S a Tech Podcast, Episode 3: Human-Centered Design" />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-video videourl="https://www.youtube.com/watch?v=TBfFzt0150Q" titleText="IT\'S a Tech Podcast, Episode 3: Human-Centered Design"></nys-video>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    titleText: "IT'S a Tech Podcast, Episode 3: Human-Centered Design",
    videourl: "https://www.youtube.com/watch?v=TBfFzt0150Q",
    size: "",
    loading: "lazy",
    starttime: 0,
    autoplay: false,
    disabled: false,
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["full", "md", "sm", ""] },
    loading: { control: { type: "select" }, options: ["lazy", "eager"] },
  },
  render: (args) => {
    return html`
      <nys-video
        titleText=${args.titleText}
        videourl=${args.videourl}
        size=${args.size}
        loading=${args.loading}
        starttime=${args.starttime}
        ?autoplay=${args.autoplay}
        ?disabled=${args.disabled}
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
