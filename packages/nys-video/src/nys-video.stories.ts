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
        <nys-video videourl="https://www.youtube.com/watch?v=EmM70a3x0jE" titletext="OMH is sharing stories of everyday New Yorkers with lived experience who prove that recovery is possible. Meet Kurt Warner, a licensed clinical social worker and therapist in Cortland County. From struggling with severe obsessive-compulsive disorder and then a traumatic brain injury, he used his love of literature to empower his recovery and become a published author." id="nys-video-1787160964740-3" size=""><template shadowrootmode="open"><!---->
        <div class="nys-video nys-video--md ">
          <!--?lit$204353189$-->
      <div aria-live="assertive" aria-atomic="true" class="nys-video__announcer sr-only">
        <!--?lit$204353189$-->
      </div>
    
          <div class="nys-video__ratio-box">
            <div class="nys-video__thumbnail">
              <img alt="" src="https://img.youtube.com/vi/EmM70a3x0jE/maxresdefault.jpg">
              <button class="nys-video__play-icon" aria-label="Play OMH is sharing stories of everyday New Yorkers with lived experience who prove that recovery is possible. Meet Kurt Warner, a licensed clinical social worker and therapist in Cortland County. From struggling with severe obsessive-compulsive disorder and then a traumatic brain injury, he used his love of literature to empower his recovery and become a published author.">
                <span class="nys-video__play-badge">
                  <!--?lit$204353189$--><svg aria-hidden="true" width="31" height="35" viewBox="0 0 31 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.4221 15.7357L2.568 0.231711C1.42656 -0.426849 0 0.396831 0 1.71395V32.7229C0 34.041 1.42656 34.8647 2.568 34.2052L29.4221 18.7012C30.5635 18.0426 30.5635 16.3952 29.4221 15.7357Z" fill="white"></path>
        </svg>
                </span>
              </button>
            </div>
          </div>
          <!--?lit$204353189$--><div class="nys-video__title-text">
            <p><!--?lit$204353189$-->OMH is sharing stories of everyday New Yorkers with lived experience who prove that recovery is possible. Meet Kurt Warner, a licensed clinical social worker and therapist in Cortland County. From struggling with severe obsessive-compulsive disorder and then a traumatic brain injury, he used his love of literature to empower his recovery and become a published author.</p>
          </div>
        </div>
      </template></nys-video>
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
