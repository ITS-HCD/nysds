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

export const BasicUsage: Story = {
  args: {
    videourl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    titleText: "Video Title",
  },
  render: (args) => {
    return html`
      <nys-video
        .id=${args.id}
        ?autoplay=${args.autoplay}
        ?disabled=${args.disabled}
        .titleText=${args.titleText}
        .videourl=${args.videourl}
        .size=${args.size}
        .loading=${args.loading}
        .starttime=${args.starttime}
        .thumbnail=${args.thumbnail}
      ></nys-video>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-video
  videourl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  titleText="Video Title"
></nys-video>`,
        type: "auto",
      },
    },
  },
};
