import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tab";
import "./nys-tabgroup";
import "./nys-tabpanel";

// Define the structure of the args used in the stories
interface NysTabArgs {
  id: string;
  label: string;
  "aria-labelledby": string;
  name: string;
  selected: boolean;
  disabled: boolean;
}

const meta: Meta<NysTabArgs> = {
  title: "Components/Tab",
  component: "nys-tab",
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    "aria-labelledby": { control: "text" },
    name: { control: "text" },
    selected: { control: "boolean", default: false },
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
type Story = StoryObj<NysTabArgs>;

export const Basic: Story = {
  args: {
    label: "Marcy",
  },
  render: (args) => {
    return html`
      <nys-tabgroup
        .id=${args.id}
        ?selected=${args["selected"]}
        ?disabled=${args["disabled"]}
        .label=${args["label"]}
        .aria-labelledby=${args["aria-labelledby"]}
        .name=${args["name"]}
      >
        <nys-tab label="Marcy"></nys-tab>
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
