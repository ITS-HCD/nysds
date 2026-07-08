import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-icon";
import { registerIconLibrary } from "./icon-library-registry";

// Module-scope setup hoisted from <script data-scope="module"> blocks in
// the component's JSDoc examples. This runs once at import time so setup
// (e.g. icon library registration) is in place before any story's
// elements connect — running it inside render() is too late on the first
// visit because connectedCallback fires before the render body executes.
registerIconLibrary("fa", {
  resolver: (name) =>
    `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/${name}.svg`,
  mutator: (svg) => {
    svg.setAttribute("fill", "currentColor");
  },
});
registerIconLibrary("material", {
  resolver: (name) =>
    `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/default/24px.svg`,
  mutator: (svg) => {
    svg.setAttribute("fill", "currentColor");
  },
});

const meta: Meta = {
  title: "Components/Icon",
  component: "nys-icon",
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
    name: "check_circle",
    library: "default",
    ariaLabel: "",
    rotate: "0",
    flip: "",
    color: "",
  },
  render: (args) => {
    return html`
      <nys-icon
        name=${args.name}
        library=${args.library}
        ariaLabel=${args.ariaLabel}
        rotate=${args.rotate}
        flip=${args.flip}
        color=${args.color}
      ></nys-icon>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="check_circle"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const ARIALabel: Story = {
  render: () => {
    return html`
      <nys-icon name="edit_square" ariaLabel="Edit content"></nys-icon>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="edit_square" ariaLabel="Edit content"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const SizeRelative: Story = {
  render: () => {
    return html` <nys-icon name="edit_square" size="4xl"></nys-icon> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="edit_square" size="4xl"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const SizeLiteral: Story = {
  render: () => {
    return html` <nys-icon name="edit_square" size="24"></nys-icon> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="edit_square" size="24"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const Color: Story = {
  render: () => {
    return html` <nys-icon name="edit_square" color="#db117d"></nys-icon> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="edit_square" color="#db117d"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const Rotate: Story = {
  render: () => {
    return html` <nys-icon name="edit_square" rotate="20"></nys-icon> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="edit_square" rotate="20"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const Flip: Story = {
  render: () => {
    return html` <nys-icon name="edit_square" flip="vertical"></nys-icon> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-icon name="edit_square" flip="vertical"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const ExternalLibraryFontAwesome: Story = {
  render: () => {
    return html` <nys-icon name="heart" library="fa"></nys-icon> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
// Register the icon library before using <nys-icon>
import { registerIconLibrary } from '@nysds/nys-icon';

registerIconLibrary("fa", {
resolver: (name) =>
\`https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/\${name}.svg\`,
mutator: (svg) => {
svg.setAttribute("fill", "currentColor");
},
});

<nys-icon name="heart" library="fa"></nys-icon>`,
        type: "auto",
      },
    },
  },
};

export const ExternalLibraryMaterial: Story = {
  render: () => {
    return html` <nys-icon name="favorite" library="material"></nys-icon> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
// Register the icon library before using <nys-icon>
import { registerIconLibrary } from '@nysds/nys-icon';

registerIconLibrary("material", {
resolver: (name) =>
\`https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/\${name}/default/24px.svg\`,
mutator: (svg) => {
svg.setAttribute("fill", "currentColor");
},
});

<nys-icon name="favorite" library="material"></nys-icon>`,
        type: "auto",
      },
    },
  },
};
