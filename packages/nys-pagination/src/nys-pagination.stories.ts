import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-pagination";
import "@nysds/nys-button";

const meta: Meta = {
  title: "Components/Pagination",
  component: "nys-pagination",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'Page navigation with Previous/Next buttons and numbered page links. Auto-collapses with ellipses for many pages.\n\nSet `totalPages` and `currentPage` to control state. Listen to `nys-change` for page selection.\nHidden automatically when `totalPages` is 1. Responsive: shows compact controls on mobile.\n\n## Accessibility\n- The controls sit in a `navigation` landmark named "Pagination".\n- The current page\'s button carries `aria-current="page"` so assistive technology\n  announces which page the user is on.\n- Keyboard focus follows the user across a page change: it stays on the page they\n  activated, and moves to the current page\'s button when Previous or Next disables\n  itself on the first or last page rather than falling back to the document.\n- The ellipsis between non-adjacent page numbers is inert text, not a control, and is\n  hidden from assistive technology.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysPagination currentPage={5} totalPages={10} />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-pagination [currentPage]="5" [totalPages]="10"></nys-pagination>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    name: "",
    currentPage: 5,
    totalPages: 10,
  },
  render: (args) => {
    return html`
      <nys-pagination
        name=${args.name}
        currentPage=${args.currentPage}
        totalPages=${args.totalPages}
      ></nys-pagination>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-pagination currentPage="5" totalPages="10"></nys-pagination>`,
        type: "auto",
      },
    },
  },
};

export const FirstPage: Story = {
  render: () => {
    return html`
      <nys-pagination currentPage="1" totalPages="10"></nys-pagination>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-pagination currentPage="1" totalPages="10"></nys-pagination>`,
        type: "auto",
      },
    },
  },
};

export const LastPage: Story = {
  render: () => {
    return html`
      <nys-pagination currentPage="10" totalPages="10"></nys-pagination>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-pagination currentPage="10" totalPages="10"></nys-pagination>`,
        type: "auto",
      },
    },
  },
};
