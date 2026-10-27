import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-hero";

const meta: Meta = {
  title: "Components/Hero",
  component: "nys-hero",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          "`<nys-hero>` is ...\n\nExtends `NysElement` from `@nysds/internals`, which provides\nautomatic\nid generation. See `nys-alert` for a reference implementation.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysHero />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-hero></nys-hero>\n```",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => {
    return html` <nys-hero></nys-hero> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-hero></nys-hero>`,
        type: "auto",
      },
    },
  },
};
