import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-avatar";

// Define the structure of the args used in the stories
interface NysAvatarArgs {
  id: string;
  label: string;
  initials?: string;
  icon?: string;
  image?: string;
  size?: string;
  shape?: string;
  lazy?: boolean;
}

const meta: Meta<NysAvatarArgs> = {
  title: "Components/Avatar",
  component: "nys-avatar",
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    initials: { control: "text" },
    icon: { control: "text" },
    image: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    shape: { control: "select", options: ["square", "rounded", "circle"] },
    lazy: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysAvatarArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Default
export const Default: Story = {
  args: {
    label: "User avatar",
    image:
      "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`",
  },
  render: (args) =>
    html` <nys-avatar
      .label=${args.label}
      .initials=${args.initials}
      .icon=${args.icon}
      image=${args.image}
      .size=${args.size}
      .shape=${args.shape}
      ?lazy
    >
    </nys-avatar>`,
  parameters: {
    docs: {
      source: {
        code: `
 <nys-avatar
	label="User avatar"
	image="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
 ></nys-avatar>
	  `.trim(),
      },
    },
  },
};

// Story: Image
export const AvatarImage: Story = {
  args: {
    label: "User avatar",
  },
  render: (args) =>
    html` <div style="display:flex; gap:5px;">
      <nys-avatar
        .label=${args.label}
        .initials=${args.initials}
        .icon=${args.icon}
        image="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        .size=${args.size}
        .shape=${args.shape}
      >
      </nys-avatar>
      <nys-avatar
        .label=${args.label}
        .initials=${args.initials}
        .icon=${args.icon}
        image="https://images.unsplash.com/photo-1523318840068-3e8c0f998509?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        .size=${args.size}
        .shape=${args.shape}
        ?lazy
      >
      </nys-avatar>
    </div>`,
  parameters: {
    docs: {
      source: {
        code: `
<div style="display:flex; gap:5px;">
<nys-avatar
  label="User avatar"
  image="c"
></nys-avatar>
<nys-avatar
  label="User avatar"
  image="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  lazy
></nys-avatar>
</div>
    `.trim(),
      },
    },
  },
};

// Story: Initials
export const AvatarInitials: Story = {
  args: {
    label: "User avatar",
    initials: "RC",
  },
  render: (args) => html`
    <nys-avatar
      .label=${args.label}
      .initials=${args.initials}
      .icon=${args.icon}
      .image=${args.image}
      .size=${args.size}
      .shape=${args.shape}
      .lazy=${args.lazy}
    >
    </nys-avatar>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar
  label="User avatar"
  initials="RC"
></nys-avatar>
    `.trim(),
      },
    },
  },
};

// Story: Icon
export const AvatarIcon: Story = {
  args: {
    label: "User avatar",
    icon: "account_circle",
  },
  render: (args) =>
    html` <nys-avatar
      .label=${args.label}
      .initials=${args.initials}
      .icon=${args.icon}
      .image=${args.image}
      .size=${args.size}
      .shape=${args.shape}
      .lazy=${args.lazy}
    >
    </nys-avatar>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar
  label="User avatar"
  icon="account_circle"
></nys-avatar>
    `.trim(),
      },
    },
  },
};

// Story: Shapes
export const AvatarShapes: Story = {
  args: {
    label: "User avatar",
    icon: "account_circle",
  },
  render: (args) =>
    html` <div style="display:flex; gap:5px;">
      <nys-avatar
        .label=${args.label}
        .initials=${args.initials}
        .icon=${args.icon}
        .image=${args.image}
        .size=${args.size}
        shape="square"
      >
      </nys-avatar>
      <nys-avatar
        .label=${args.label}
        .initials=${args.initials}
        .icon=${args.icon}
        .image=${args.image}
        .size=${args.size}
        shape="rounded"
      >
      </nys-avatar>
      <nys-avatar
        .label=${args.label}
        .initials=${args.initials}
        .icon=${args.icon}
        .image=${args.image}
        .size=${args.size}
        shape="circle"
      >
      </nys-avatar>
    </div>`,
  parameters: {
    docs: {
      source: {
        code: `
<div style="display:flex; gap:5px;">
<nys-avatar
  label="User avatar"
  icon="account_circle"
  shape="square"
></nys-avatar>
<nys-avatar
  label="User avatar"
  icon="account_circle"
  shape="rounded"
></nys-avatar>
<nys-avatar
  label="User avatar"
  icon="account_circle"
  shape="circle"
></nys-avatar>
</div>
    `.trim(),
      },
    },
  },
};
