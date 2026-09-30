import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tab";
import "./nys-tabgroup";
import "./nys-tabpanel";
import "@nysds/nys-button";

const meta: Meta = {
  title: "Components/Tab",
  component: "nys-tab",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          '`<nys-tab>` is a single tab within a `<nys-tabgroup>`.\n\nThe host element carries `role="tab"`, `tabindex`, `aria-selected`,\n`aria-controls`, and `aria-disabled` so assistive technologies see the\ncorrect ARIA tab semantics on the element that is actually focused.\n`<nys-tabgroup>` manages `tabindex`, `aria-selected`, and `aria-controls`\nvia `_applySelection`; do not set them directly on this element.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysTabgroup>\n  <NysTab label="Marcy" />\n  <NysTab label="Algonquin" />\n  <NysTab label="Haystack" />\n  // rest of tabs\n  <NysTabpanel>\n    Mount Marcy is the tallest peak in the Adirondacks. It has an elevation of 5344 feet with 3166 feet of elevation gain. The roundtrip hike to the top is 14.8 miles and is an out-and-back route.\n  </NysTabpanel>\n  <NysTabpanel>\n    Algonquin Peak is the 2nd tallest peak in the Adirondacks. It has an elevation of 5114 feet with 3050 feet of elevation gain. The roundtrip hike to the top is 7.8 miles and is an out-and-back route.\n  </NysTabpanel>\n  <NysTabpanel>\n    Mount Haystack is the 3rd tallest peak in the Adirondacks. It has an elevation of 4960 feet with 4000 feet of elevation gain. The roundtrip hike to the top is 16.4 miles and is an out-and-back route.\n  </NysTabpanel>\n  // rest of tab panel content\n</NysTabgroup>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-tabgroup>\n  <nys-tab label="Marcy"></nys-tab>\n  <nys-tab label="Algonquin"></nys-tab>\n  <nys-tab label="Haystack"></nys-tab>\n  // rest of tabs\n  <nys-tabpanel>\n    Mount Marcy is the tallest peak in the Adirondacks. It has an elevation of 5344 feet with 3166 feet of elevation gain. The roundtrip hike to the top is 14.8 miles and is an out-and-back route.\n  </nys-tabpanel>\n  <nys-tabpanel>\n    Algonquin Peak is the 2nd tallest peak in the Adirondacks. It has an elevation of 5114 feet with 3050 feet of elevation gain. The roundtrip hike to the top is 7.8 miles and is an out-and-back route.\n  </nys-tabpanel>\n  <nys-tabpanel>\n    Mount Haystack is the 3rd tallest peak in the Adirondacks. It has an elevation of 4960 feet with 4000 feet of elevation gain. The roundtrip hike to the top is 16.4 miles and is an out-and-back route.\n  </nys-tabpanel>\n  // rest of tab panel content\n</nys-tabgroup>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    name: "",
    label: "Marcy",
    selected: false,
    disabled: false,
  },
  render: (args) => {
    return html`
      <nys-tabgroup name=${args.name}>
        <nys-tab
          label=${args.label}
          ?selected=${args.selected}
          ?disabled=${args.disabled}
        ></nys-tab>
        <nys-tab label="Algonquin"></nys-tab>
        <nys-tab label="Haystack"></nys-tab>
        <nys-tab label="Skylight" id="tab4"></nys-tab>
        <nys-tab label="Whiteface" id="tab5"></nys-tab>
        <nys-tabpanel>
          Mount Marcy is the tallest peak in the Adirondacks. It has an
          elevation of 5344 feet with 3166 feet of elevation gain. The roundtrip
          hike to the top is 14.8 miles and is an out-and-back route.
        </nys-tabpanel>
        <nys-tabpanel>
          Algonquin Peak is the 2nd tallest peak in the Adirondacks. It has an
          elevation of 5114 feet with 3050 feet of elevation gain. The roundtrip
          hike to the top is 7.8 miles and is an out-and-back route.
        </nys-tabpanel>
        <nys-tabpanel>
          Mount Haystack is the 3rd tallest peak in the Adirondacks. It has an
          elevation of 4960 feet with 4000 feet of elevation gain. The roundtrip
          hike to the top is 16.4 miles and is an out-and-back route.
        </nys-tabpanel>
        <nys-tabpanel>
          Mount Skylight is the 4th tallest peak in the Adirondacks. It has an
          elevation of 4926 feet with 5100 feet of elevation gain. The roundtrip
          hike to the top is 16 miles and is an out-and-back route.
        </nys-tabpanel>
        <nys-tabpanel>
          Whiteface is the 5th tallest peak in the Adirondacks. It has an
          elevation of 4867 feet with 3050 feet of elevation gain. The roundtrip
          hike to the top is 7.2 miles and is an out-and-back route.
        </nys-tabpanel>
        <p style="padding: 1rem">
          <strong>Note:</strong>
          The content in the tab panels was gathered from
          <a href="https://www.lakeplacid.com/do/outdoors/summerfall/hiking"
            >lakeplacid.com</a
          >
          and may not be completely accurate. This is meant to be a demo of how
          the component works, not a hiking guide.
        </p>
      </nys-tabgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup>
  <nys-tab label="Marcy"></nys-tab>
  <nys-tab label="Algonquin"></nys-tab>
  <nys-tab label="Haystack"></nys-tab>
  // rest of tabs
  <nys-tabpanel>
    Mount Marcy is the tallest peak in the Adirondacks. It has an elevation of 5344 feet with 3166
    feet of elevation gain. The roundtrip hike to the top is 14.8 miles and is an out-and-back
    route.
  </nys-tabpanel>
  <nys-tabpanel>
    Algonquin Peak is the 2nd tallest peak in the Adirondacks. It has an elevation of 5114 feet with
    3050 feet of elevation gain. The roundtrip hike to the top is 7.8 miles and is an out-and-back
    route.
  </nys-tabpanel>
  <nys-tabpanel>
    Mount Haystack is the 3rd tallest peak in the Adirondacks. It has an elevation of 4960 feet with
    4000 feet of elevation gain. The roundtrip hike to the top is 16.4 miles and is an out-and-back
    route.
  </nys-tabpanel>
  // rest of tab panel content
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};

export const ExplicitOrdering: Story = {
  render: () => {
    return html`
      <nys-tabgroup id="explicit-ordering">
        <nys-tab label="1st Tab" id="tab1"></nys-tab>
        <nys-tab label="2nd Tab" id="tab2"></nys-tab>
        <nys-tab label="3rd Tab" id="tab3"></nys-tab>
        <nys-tabpanel aria-labelledby="tab2">Content for tab 2</nys-tabpanel>
        <nys-tabpanel aria-labelledby="tab3">Content for tab 3</nys-tabpanel>
        <nys-tabpanel aria-labelledby="tab1">Content for tab 1</nys-tabpanel>
      </nys-tabgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup id="explicit-ordering">
  <nys-tab label="1st Tab" id="tab1"></nys-tab>
  <nys-tab label="2nd Tab" id="tab2"></nys-tab>
  <nys-tab label="3rd Tab" id="tab3"></nys-tab>
  <nys-tabpanel aria-labelledby="tab2">Content for tab 2</nys-tabpanel>
  <nys-tabpanel aria-labelledby="tab3">Content for tab 3</nys-tabpanel>
  <nys-tabpanel aria-labelledby="tab1">Content for tab 1</nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};

export const JSInTabpanel: Story = {
  render: () => {
    return html`
      <nys-tabgroup>
        <nys-tab label="Tab 1"></nys-tab>
        <nys-tab label="Tab 2"></nys-tab>
        <nys-tabpanel>
          <p>Content for tab 1</p>
        </nys-tabpanel>
        <nys-tabpanel>
          <p>Content for tab 2</p>
        </nys-tabpanel>
      </nys-tabgroup>
      <script>
        const tabgroup = document.querySelector("nys-tabgroup");
        const panels = tabgroup.querySelectorAll("nys-tabpanel");
        panels[0].innerHTML += "<p>Added via JS</p>";
      </script>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup>
<nys-tab label="Tab 1"></nys-tab>
<nys-tab label="Tab 2"></nys-tab>
<nys-tabpanel>
<p>Content for tab 1</p>
</nys-tabpanel>
<nys-tabpanel>
<p>Content for tab 2</p>
</nys-tabpanel>
</nys-tabgroup>
<script>
const tabgroup = document.querySelector("nys-tabgroup");
const panels = tabgroup.querySelectorAll("nys-tabpanel");
panels[0].innerHTML += "<p>Added via JS</p>";
</script>`,
        type: "auto",
      },
    },
  },
};

export const CustomStyling: Story = {
  render: () => {
    return html`
      <style>
        nys-tabpanel {
          --_nys-tabpanel-background-color: var(--nys-color-theme-faint);
          border: solid 2px var(--nys-color-theme-strong);
          --nys-button-background-color: var(--nys-color-success);
        }
      </style>
      <nys-tabgroup>
        <nys-tab label="Tab 1"></nys-tab>
        <nys-tab label="Tab 2"></nys-tab>
        <nys-tabpanel>
          <p>Content for tab 1</p>
          <nys-button>Click me</nys-button>
        </nys-tabpanel>
        <nys-tabpanel>
          <p>Content for tab 2</p>
        </nys-tabpanel>
      </nys-tabgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<style>
  nys-tabpanel {
    --_nys-tabpanel-background-color: var(--nys-color-theme-faint);
    border: solid 2px var(--nys-color-theme-strong);
    --nys-button-background-color: var(--nys-color-success);
  }
</style>
<nys-tabgroup>
  <nys-tab label="Tab 1"></nys-tab>
  <nys-tab label="Tab 2"></nys-tab>
  <nys-tabpanel>
    <p>Content for tab 1</p>
    <nys-button>Click me</nys-button>
  </nys-tabpanel>
  <nys-tabpanel>
    <p>Content for tab 2</p>
  </nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-tabgroup name="Account Settings">
        <nys-tab label="Profile"></nys-tab>
        <nys-tab label="Security"></nys-tab>
        <nys-tab label="Notifications" disabled></nys-tab>
        <nys-tabpanel><p>Manage your profile information.</p></nys-tabpanel>
        <nys-tabpanel
          ><p>Update your password and 2FA settings.</p></nys-tabpanel
        >
        <nys-tabpanel
          ><p>Notification preferences (coming soon).</p></nys-tabpanel
        >
      </nys-tabgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup name="Account Settings">
  <nys-tab label="Profile"></nys-tab>
  <nys-tab label="Security"></nys-tab>
  <nys-tab label="Notifications" disabled></nys-tab>
  <nys-tabpanel><p>Manage your profile information.</p></nys-tabpanel>
  <nys-tabpanel><p>Update your password and 2FA settings.</p></nys-tabpanel>
  <nys-tabpanel><p>Notification preferences (coming soon).</p></nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};

export const Preselected: Story = {
  render: () => {
    return html`
      <nys-tabgroup name="Reports">
        <nys-tab label="Summary"></nys-tab>
        <nys-tab label="Details" selected></nys-tab>
        <nys-tabpanel><p>Summary view</p></nys-tabpanel>
        <nys-tabpanel><p>Detailed view (shown by default)</p></nys-tabpanel>
      </nys-tabgroup>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup name="Reports">
  <nys-tab label="Summary"></nys-tab>
  <nys-tab label="Details" selected></nys-tab>
  <nys-tabpanel><p>Summary view</p></nys-tabpanel>
  <nys-tabpanel><p>Detailed view (shown by default)</p></nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};
