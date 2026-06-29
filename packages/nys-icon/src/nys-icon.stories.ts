import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-icon";
import { registerIconLibrary } from "./icon-library-registry";

// Register external icon libraries at module scope so they are available
// before any <nys-icon> elements connect. Registering inside render() is
// too late on the first visit because the elements' connectedCallback and
// _loadIcon fire before the render body executes, returning null from
// getIconLibrary().
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
  render: () => {
    return html` <nys-icon name="check_circle"></nys-icon> `;
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
\`https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/${name}.svg\`,
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
\`https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/default/24px.svg\`,
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
