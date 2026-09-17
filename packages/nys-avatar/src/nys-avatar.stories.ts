import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-avatar";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Avatar",
  component: "nys-avatar",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'Displays a user representation as image, initials, or icon with automatic fallback chain.\n\nPriority: `image` > `initials` > `icon` > default icon. Set `color` to customize background;\nforeground auto-adjusts for contrast. Use `interactive` for clickable avatars (e.g., profile menus).\n\nAn avatar with no `ariaLabel` is treated as decorative and hidden from assistive\ntech — correct beside a visible name, wrong for an `interactive` avatar, which\nrenders a `<button>` and warns in the console when left nameless.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysAvatar ariaLabel="User avatar" />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-avatar ariaLabel="User avatar"></nys-avatar>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    ariaLabel: "User avatar",
    image: "",
    initials: "",
    icon: "",
    color: "",
    interactive: false,
    disabled: false,
    lazy: false,
  },
  render: (args) => {
    return html`
      <nys-avatar
        ariaLabel=${args.ariaLabel}
        image=${args.image}
        initials=${args.initials}
        icon=${args.icon}
        color=${args.color}
        ?interactive=${args.interactive}
        ?disabled=${args.disabled}
        ?lazy=${args.lazy}
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
    return html`
      <!-- Interactive renders a <button>, so it always needs a name. -->
      <nys-avatar interactive ariaLabel="Open account menu"></nys-avatar>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Interactive renders a <button>, so it always needs a name. -->
<nys-avatar interactive ariaLabel="Open account menu"></nys-avatar>`,
        type: "auto",
      },
    },
  },
};

export const Decorative: Story = {
  render: () => {
    return html`
      <!-- No ariaLabel: hidden from assistive tech, for use beside a visible name. -->
      <nys-avatar initials="JS"></nys-avatar>
      <span>Jane Smith</span>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- No ariaLabel: hidden from assistive tech, for use beside a visible name. -->
<nys-avatar initials="JS"></nys-avatar>
<span>Jane Smith</span>`,
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
      <nys-avatar
        color="var(--nys-color-red-500)"
        interactive
        ariaLabel="Open account menu"
      ></nys-avatar>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-avatar color="var(--nys-color-red-500)" interactive ariaLabel="Open account menu"></nys-avatar>`,
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
