import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-icon";

// Define the structure of the args used in the stories
interface NysIconArgs {
  id: string;
  name: string;
  library: string;
  ariaLabel: string;
  rotate: string;
  flip: string;
  color: string;
  size:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "12"
    | "14"
    | "16"
    | "18"
    | "20"
    | "24"
    | "32"
    | "40"
    | "50";
}

const meta: Meta<NysIconArgs> = {
  title: "Components/Icon",
  component: "nys-icon",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    library: { control: "text" },
    ariaLabel: { control: "text" },
    rotate: { control: "text" },
    flip: { control: "text" },
    color: { control: "text" },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "12",
        "14",
        "16",
        "18",
        "20",
        "24",
        "32",
        "40",
        "50",
      ],
    },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysIconArgs>;

export const Basic: Story = {
  render: () => {
    registerIconLibrary("fa", {
      resolver: (name) =>
        `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/svg/${name}.svg`,
    });
    return html``;
  },
  parameters: {
    docs: {
      source: {
        code: `
registerIconLibrary("fa", {
  resolver: (name) => \`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/svg/${name}.svg\`,
});`,
        type: "auto",
      },
    },
  },
};

export const BasicIconDefaultNYSDSLibrary: Story = {
  render: () => {
    return html` <nys-icon name="check_circle" size="lg"></nys-icon> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="check_circle" size="lg"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const FontAwesomeIcon: Story = {
  render: () => {
    return html` <nys-icon name="house" library="fa" size="lg"></nys-icon> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="house" library="fa" size="lg"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const AccessibleIconWithLabel: Story = {
  render: () => {
    return html`
      <nys-icon
        name="warning"
        ariaLabel="Warning"
        color="var(--nys-color-warning)"
      ></nys-icon>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="warning" ariaLabel="Warning" color="var(--nys-color-warning)"></nys-icon>`,
        type: "auto",
      },
    },
  },
};
