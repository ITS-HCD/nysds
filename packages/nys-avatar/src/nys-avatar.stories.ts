import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-avatar";

// Define the structure of the args used in the stories
interface NysAvatarArgs {
  id: string;
  ariaLabel: string;
  image: string;
  initials: string;
  icon: string;
  color: string;
  interactive: boolean;
  disabled: boolean;
  lazy: boolean;
}

const meta: Meta<NysAvatarArgs> = {
  title: "Components/Avatar",
  component: "nys-avatar",
  argTypes: {
    id: { control: "text" },
    ariaLabel: { control: "text" },
    image: { control: "text" },
    initials: { control: "text" },
    icon: { control: "text" },
    color: { control: "text" },
    interactive: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
    lazy: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysAvatarArgs>;

export const Basic: Story = {
  args: {
    ariaLabel: "User avatar",
  },
  render: (args) => {
    return html`
      <nys-avatar
        .id=${args.id}
        ?interactive=${args.interactive}
        ?disabled=${args.disabled}
        ?lazy=${args.lazy}
        .ariaLabel=${args.ariaLabel}
        .image=${args.image}
        .initials=${args.initials}
        .icon=${args.icon}
        .color=${args.color}
      ></nys-avatar>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar ariaLabel="User avatar"></nys-avatar>`,
        type: "auto",
      },
    },
  },
};

export const Image: Story = {
  render: () => {
    return html`
      <nys-avatar
        image="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ariaLabel="Jane Smith"
      ></nys-avatar>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar image="path/to/img.png" ariaLabel="Jane Smith"></nys-avatar>`,
        type: "auto",
      },
    },
  },
};

export const Initials: Story = {
  render: () => {
    return html`
      <nys-avatar initials="JS" ariaLabel="Jane Smith"></nys-avatar>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar initials="JS" ariaLabel="Jane Smith"></nys-avatar>`,
        type: "auto",
      },
    },
  },
};

export const Icon: Story = {
  render: () => {
    return html` <nys-avatar icon="account_circle"></nys-avatar> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar icon="account_circle"></nys-avatar>`,
        type: "auto",
      },
    },
  },
};

export const Interactive: Story = {
  render: () => {
    return html` <nys-avatar interactive></nys-avatar> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar interactive></nys-avatar>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html` <nys-avatar disabled></nys-avatar> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar disabled></nys-avatar>`,
        type: "auto",
      },
    },
  },
};

export const CustomBackgroundColor: Story = {
  render: () => {
    return html`
      <nys-avatar color="var(--nys-color-red-500)" interactive></nys-avatar>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar color="var(--nys-color-red-500)" interactive></nys-avatar>`,
        type: "auto",
      },
    },
  },
};

export const LazyLoading: Story = {
  render: () => {
    return html` <nys-avatar lazy></nys-avatar> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar lazy></nys-avatar>`,
        type: "auto",
      },
    },
  },
};
