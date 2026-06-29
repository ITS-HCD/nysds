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
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => {
    return html`
      <nys-video
        videourl="https://www.youtube.com/watch?v=TBfFzt0150Q"
        titleText="IT'S a Tech Podcast, Episode 3: Human-Centered Design"
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
