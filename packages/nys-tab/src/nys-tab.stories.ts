import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tab";
import "./nys-tabgroup";
import "./nys-tabpanel";
import "@nysds/nys-accordion";

interface NysTabArgs {
  label: string;
  selected: boolean;
  disabled: boolean;
}

const meta: Meta<NysTabArgs> = {
  title: "Components/Tab",
  component: "nys-tab",
  argTypes: {
    label: { control: "text" },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
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
  args: {},
  render: () => html`
    <nys-tabgroup>
      <nys-tab label="Marcy"></nys-tab>
      <nys-tab label="Algonquin"></nys-tab>
      <nys-tab label="Haystack"></nys-tab>
      <nys-tab label="Skylight" id="tab4"></nys-tab>
      <nys-tab label="Whiteface" id="tab5"></nys-tab>
      <nys-tab label="Gore (not a high peak)" disabled id="tab6"></nys-tab>
      <nys-tabpanel
        >Mount Marcy is the tallest peak in the Adirondacks. It has an elevation
        of 5344 feet with 3166 feet of elevation gain. The roundtrip hike to the
        top is 14.8 miles and is an out-and-back route.
      </nys-tabpanel>
      <nys-tabpanel
        >Algonquin Peak is the 2nd tallest peak in the Adirondacks. It has an
        elevation of 5114 feet with 3050 feet of elevation gain. The roundtrip
        hike to the top is 7.8 miles and is an out-and-back route.</nys-tabpanel
      >
      <nys-tabpanel
        >Mount Haystack is the 3rd tallest peak in the Adirondacks. It has an
        elevation of 4960 feet with 4000 feet of elevation gain. The roundtrip
        hike to the top is 16.4 miles and is an out-and-back
        route.</nys-tabpanel
      >
      <nys-tabpanel
        >Mount Skylight is the 4th tallest peak in the Adirondacks. It has an
        elevation of 4926 feet with 5100 feet of elevation gain. The roundtrip
        hike to the top is 16 miles and is an out-and-back route.</nys-tabpanel
      >
      <nys-tabpanel
        >Whiteface is the 5th tallest peak in the Adirondacks. It has an
        elevation of 4867 feet with 3050 feet of elevation gain. The roundtrip
        hike to the top is 7.2 miles and is an out-and-back route.</nys-tabpanel
      >
      <p style="padding: 1rem;">
        <strong>Note:</strong> The content in the tab panels was gathered from
        <a href="https://www.lakeplacid.com/do/outdoors/summerfall/hiking"
          >lakeplacid.com</a
        >
        and may not be completely accurate. This is meant to be a demo of how
        the component works, not a hiking guide.
      </p>
    </nys-tabgroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup>
      <nys-tab label="Marcy"></nys-tab>
      <nys-tab label="Algonquin"></nys-tab>
      <nys-tab label="Haystack"></nys-tab>
      <nys-tab label="Skylight" id="tab4"></nys-tab>
      <nys-tab label="Whiteface" id="tab5"></nys-tab>
      <nys-tab label="Gore (not a high peak)" disabled id="tab6"></nys-tab>
      <nys-tabpanel
        >Mount Marcy is the tallest peak in the Adirondacks. It has an elevation
        of 5344 feet with 3166 feet of elevation gain. The roundtrip hike to the
        top is 14.8 miles and is an out-and-back route.
      </nys-tabpanel>
      <nys-tabpanel
        >Algonquin Peak is the 2nd tallest peak in the Adirondacks. It has an
        elevation of 5114 feet with 3050 feet of elevation gain. The roundtrip
        hike to the top is 7.8 miles and is an out-and-back route.</nys-tabpanel
      >
      <nys-tabpanel
        >Mount Haystack is the 3rd tallest peak in the Adirondacks. It has an
        elevation of 4960 feet with 4000 feet of elevation gain. The roundtrip
        hike to the top is 16.4 miles and is an out-and-back
        route.</nys-tabpanel
      >
      <nys-tabpanel
        >Mount Skylight is the 4th tallest peak in the Adirondacks. It has an
        elevation of 4926 feet with 5100 feet of elevation gain. The roundtrip
        hike to the top is 16 miles and is an out-and-back route.</nys-tabpanel
      >
      <nys-tabpanel
        >Whiteface is the 5th tallest peak in the Adirondacks. It has an
        elevation of 4867 feet with 3050 feet of elevation gain. The roundtrip
        hike to the top is 7.2 miles and is an out-and-back route.</nys-tabpanel
      >
    </nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};
